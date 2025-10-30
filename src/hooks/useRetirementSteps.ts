"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";

import {
  LoadingStates,
  OrderDetails,
  PaymentDetails,
  PollingResponse,
  QuoteDetails,
} from "@/types/retirement";

import { handleError } from "@/utils/retirementSteps";

import { useRetire } from "@/context/RetireContext";
import { useAuth } from "@/context/AuthContext";
import { PRICE_MULTIPLIER } from "@/constants";
import useRetirements from "./useRetirements";
import { useRouter } from "next/navigation";
import pollOrderStatus from "@/utils/pollOrderStatus";
import useDownloadPDF from "./useDownloadPDF";
import useCreateRetirementRecord from "./useCreateRetirementRecord";
import { executeRetirementProcess } from "@/utils/retirementService";

const useRetirementSteps = (
  paymentId?: string | null,
  sessionId?: string | null
) => {
  const { user } = useAuth();
  const { fetchRetirementByPaymentId } = useRetirements();
  const router = useRouter();

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<string>("payment");
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    paymentDetails: true,
    quoteDetails: true,
    orderDetails: true,
  });
  const [rehydrated, setRehydrated] = useState<boolean>(false);
  const [hasFiredConfetti, setHasFiredConfetti] = useState<boolean>(false);
  const [processStarted, setProcessStarted] = useState<boolean>(false);

  const {
    setTonnesToRetire,
    beneficiary,
    message,
    quoteDetails,
    setQuoteDetails,
    setOrderDetails,
    orderDetails,
    project,
    setNewRetirement,
    setBeneficiary,
    setMessage,
  } = useRetire();

  const orderDetailsRef = useRef<OrderDetails | null>(orderDetails);
  useEffect(() => {
    orderDetailsRef.current = orderDetails;
  }, [orderDetails]);

  const pollingAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const storedPayment = localStorage.getItem("pendingPayment");
    if (storedPayment) {
      try {
        const parsedPayment = JSON.parse(storedPayment);
        if (parsedPayment.beneficiaryName && !beneficiary) {
          setBeneficiary(parsedPayment.beneficiaryName);
        }
        if (parsedPayment.retirementMessage && !message) {
          setMessage(parsedPayment.retirementMessage);
        }
      } catch (error) {
        console.error("Error parsing pendingPayment for rehydration", error);
      }
    }
    setRehydrated(true);
  }, [beneficiary, message, setBeneficiary, setMessage]);

  const hasExecutedRef = useRef(false);
  const updateLoadingState = useCallback(
    (key: keyof LoadingStates, value: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const createRetirementRecord = useCreateRetirementRecord({
    project,
    paymentId,
    user,
    setNewRetirement,
    orderDetailsRef,
  });

  const downloadCertificatePDF = useDownloadPDF();

  const handlePollingSuccess = useCallback(
    async (data: PollingResponse) => {
      setOrderDetails((prev: OrderDetails | null): OrderDetails | null => {
        if (!prev) return null;
        const updatedQuote: QuoteDetails = {
          ...prev.quote,
          ...data.quote,
          cost_usdc: data.quote?.cost_usdc
            ? data.quote.cost_usdc * PRICE_MULTIPLIER
            : prev.quote.cost_usdc,
          quoteId: data.quote?.quoteId || prev.quote.quoteId,
        };
        return {
          ...prev,
          status: data.status || prev.status,
          quote: updatedQuote,
          order: {
            ...prev.order,
            quote: { uuid: data.quote?.uuid || prev.order.quote.uuid },
            beneficiary_name:
              data.beneficiary_name || prev.order.beneficiary_name,
            retirement_message:
              data.retirement_message || prev.order.retirement_message,
            view_retirement_url:
              data.view_retirement_url || prev.order.view_retirement_url || "",
            polygonscan_url:
              data.polygonscan_url || prev.order.polygonscan_url || "",
          },
        };
      });
      setTonnesToRetire(1);
      setStep("completed");
      setIsPolling(false);
      hasExecutedRef.current = false;

      if (!hasFiredConfetti) {
        confetti({
          particleCount: 100,
          startVelocity: 80,
          spread: 80,
          gravity: 4.5,
          origin: { y: 0.6 },
          scalar: 0.75,
          ticks: 200,
        });
        setHasFiredConfetti(true);
      }

      await createRetirementRecord();
      updateLoadingState("orderDetails", false);
    },
    [
      setOrderDetails,
      setTonnesToRetire,
      createRetirementRecord,
      updateLoadingState,
      hasFiredConfetti,
    ]
  );

  const handlePollingError = useCallback((errorMsg: string) => {
    setError(errorMsg);
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(
    async (quoteId: string, signal?: AbortSignal): Promise<void> => {
      setIsPolling(true);
      pollOrderStatus(
        quoteId,
        handlePollingSuccess,
        handlePollingError,
        signal
      );
    },
    [handlePollingSuccess, handlePollingError]
  );

  const executeFullProcess = useCallback(async (): Promise<void> => {
    try {
      if (!paymentId || hasExecutedRef.current || processStarted) return;
      hasExecutedRef.current = true;
      setProcessStarted(true);
      setStep("payment");

      if (pollingAbortControllerRef.current) {
        pollingAbortControllerRef.current.abort();
      }
      pollingAbortControllerRef.current = new AbortController();

      const processState = {
        inProgress: true,
        paymentId,
        quoteId: null,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        "retirementProcessInProgress",
        JSON.stringify(processState)
      );

      const response = await fetchRetirementByPaymentId(paymentId);
      if (response?.data.retirement) {
        router.push(`/retirements/${response.data.retirement._id}`);
        return;
      }

      const result = await executeRetirementProcess({
        paymentId,
        beneficiary,
        message,
        userWalletAddress: user?.walletAddress || "",
      });

      setPaymentDetails(result.paymentDetails);
      updateLoadingState("paymentDetails", false);
      setStep("quote");
      setQuoteDetails(result.quoteData);
      updateLoadingState("quoteDetails", false);
      setStep("order");
      setOrderDetails(result.orderData);
      orderDetailsRef.current = result.orderData;
      updateLoadingState("orderDetails", false);

      const updatedProcessState = {
        inProgress: true,
        paymentId,
        quoteId: result.orderData.order.quote.uuid,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        "retirementProcessInProgress",
        JSON.stringify(updatedProcessState)
      );

      await startPolling(
        result.orderData.order.quote.uuid,
        pollingAbortControllerRef.current.signal
      );
    } catch (err) {
      setError(handleError(err, "An error occurred during the process."));
    } finally {
      setIsLoading(false);
    }
  }, [
    paymentId,
    startPolling,
    updateLoadingState,
    beneficiary,
    message,
    user?.walletAddress,
    setOrderDetails,
    setQuoteDetails,
    fetchRetirementByPaymentId,
    router,
    processStarted,
  ]);

  useEffect(() => {
    return () => {
      if (pollingAbortControllerRef.current) {
        pollingAbortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (
      rehydrated &&
      paymentId &&
      sessionId === null &&
      (!paymentDetails || paymentDetails.order?.status !== "SUBMITTED") &&
      !processStarted
    ) {
      executeFullProcess();
    }
  }, [
    rehydrated,
    paymentId,
    executeFullProcess,
    sessionId,
    paymentDetails,
    processStarted,
  ]);

  return {
    paymentDetails,
    quoteDetails,
    orderDetails,
    isLoading,
    error,
    step,
    isPolling,
    loadingStates,
    executeFullProcess,
    downloadCertificatePDF,
    createRetirementRecord,
  };
};

export default useRetirementSteps;

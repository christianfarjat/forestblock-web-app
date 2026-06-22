"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useRetire } from "@/context/RetireContext";
import {
  MAX_MONITORING_TIME,
  POLLING_INTERVAL,
  PRICE_MULTIPLIER,
} from "@/constants";
import { Listing } from "@/types/marketplace";
import { PaymentDetails } from "@/types/retirement";
import axiosInstance from "@/utils/axios/axiosInstance";
import type { AxiosError } from "axios";
import qs from "qs";
import { useAuth } from "@/context/AuthContext";
import { axiosPublicInstance } from "@/utils/axios/axiosPublicInstance";

export const useRetireCheckout = (index?: string | null) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIds = searchParams.get("projectIds");
  const priceParam = searchParams.get("priceParam");
  const selectedVintage = searchParams.get("selectedVintage");

  const { user } = useAuth();

  const {
    tonnesToRetire,
    setTonnesToRetire,
    project,
    setProject,
    setTotalSupply,
  } = useRetire();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");
  const [monitoring, setMonitoring] = useState<boolean>(false);
  const [amountReceived, setAmountReceived] = useState<number>(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!projectIds) {
        setError("Listing ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosPublicInstance.get("/carbon/prices", {
          params: { projectIds },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        const listingData = response.data.find((item: Listing) => {
          const matchesPrice =
            item.purchasePrice * PRICE_MULTIPLIER === Number(priceParam);

          if (selectedVintage !== undefined && selectedVintage !== null) {
            return (
              matchesPrice &&
              item?.carbonPool?.creditId?.vintage === Number(selectedVintage)
            );
          }

          return matchesPrice;
        });

        if (listingData) {
          const updatedListing = {
            ...listingData,
            purchasePrice: listingData?.purchasePrice * PRICE_MULTIPLIER,
          };
          setListing(updatedListing);
        } else {
          const fallbackListing = response.data[Number(index)];
          const updatedFallback = {
            ...fallbackListing,
            purchasePrice: fallbackListing?.purchasePrice * PRICE_MULTIPLIER,
          };
          setListing(updatedFallback);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load listing data. Please try again. " + err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProject = async () => {
      try {
        if (!projectIds) return;

        if (typeof window !== "undefined") {
          const storedProject = localStorage.getItem("project");
          if (storedProject) {
            setProject(JSON.parse(storedProject));
          }
        }

        const response = await axiosPublicInstance.get(
          `/carbon/carbonProjects/${projectIds}`
        );

        const data = response.data;
        setTotalSupply(data?.stats?.totalSupply);
        setProject(data);

        if (typeof window !== "undefined") {
          const projectToStore = {
            ...data,
            selectedVintage: selectedVintage ?? "0",
          };
          localStorage.setItem("project", JSON.stringify(projectToStore));
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProject();
    fetchListing();
  }, [searchParams, projectIds, setProject, index, priceParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const changePaymentStatus = async (
    paymentId: string,
    status: string,
    stripeSessionId: string
  ): Promise<boolean> => {
    try {
      const updatePaymentStatus = await axiosInstance.put(
        "payments/change-payment-status",
        {
          paymentId,
          status,
          stripeSessionId,
        }
      );

      if (updatePaymentStatus?.data.status === "CONFIRMED") {
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const calculateTotalCost = () =>
    listing?.purchasePrice ? tonnesToRetire * listing.purchasePrice : 0;

  const handleStripeCheckout = async (formData: object) => {
    const amount = calculateTotalCost();

    if (amount <= 0) {
      alert("Please enter a valid number of tonnes to retire.");
      return;
    }

    if (amount < 0.5) {
      alert("El importe total debe ser de al menos 0,50 USD");
      return;
    }

    try {
      const paymentResponse = await axiosInstance.post(
        "payments/generate-payment",
        {
          amount: calculateTotalCost(),
          tonnesToRetire,
          userId: user?._id,
          type: "stripe",
          formData,
        }
      );

      const response = await axiosInstance.post(
        "/payments/create-checkout-session",
        {
          pricePerUnit: listing?.purchasePrice,
          quantity: tonnesToRetire,
          paymentId: paymentResponse?.data.paymentData.paymentId,
          name: listing?.listing
            ? listing?.listing.id
            : listing?.carbonPool?.creditId?.projectId,
        }
      );

      if (
        typeof window !== "undefined" &&
        response.status === 200 &&
        response.data.url
      ) {
        window.location.href = response.data.url;
      } else {
        console.log("Error creating Stripe Checkout session:", response);
      }
    } catch (error) {
      console.log("Error creating Stripe Checkout session: ", error);
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        (error as Error).message ||
        "Ocurrió un error";
      alert(errorMessage);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    selectedPayment: string | null,
    formData: { beneficiary: string; message: string }
  ) => {
    e.preventDefault();
    if (selectedPayment === null) {
      alert("Debes seleccionar un medio de pago :)");
      return;
    }
    if (tonnesToRetire <= 0 || tonnesToRetire > (listing?.supply ?? 0)) {
      setError("Please enter a valid number of tonnes to retire.");
      return;
    }
    if (selectedPayment === "usdt") {
      try {
        const response = await axiosInstance.post("payments/generate-payment", {
          amount: calculateTotalCost(),
          listingId: listing?.listing?.id,
          tonnesToRetire,
          userId: user?._id,
          type: "usdt",
        });

        const orderData = {
          paymentData: response.data,
          beneficiaryName: formData?.beneficiary,
          retirementMessage: formData?.message,
        };

        setPaymentDetails(response.data);
        setFormSubmitted(true);
        setMonitoring(true);

        localStorage.setItem("pendingPayment", JSON.stringify(orderData));

        setError(null);
      } catch (err) {
        setError("Failed to create payment. Please try again. " + err);
      }
    } else if (selectedPayment === "credit-card") {
      handleStripeCheckout(formData);
    }
  };

  useEffect(() => {
    if (!monitoring) return;

    const startTime = Date.now();
    const interval = setInterval(async () => {
      try {
        if (!paymentDetails?.paymentData?.paymentId) {
          clearInterval(interval);
          setMonitoring(false);
          alert("Error: Missing payment ID. Please try again.");
          return;
        }

        const response = await axiosInstance.get(
          `payments/check-payment-status`,
          {
            params: { paymentId: paymentDetails.paymentData.paymentId },
          }
        );

        const { status, amountReceived } = response.data;

        setPaymentStatus(status);
        setAmountReceived(amountReceived);

        if (["CONFIRMED", "FAILED"].includes(status)) {
          clearInterval(interval);
          setMonitoring(false);

          if (status === "CONFIRMED") {
            router.push(
              `/retirementSteps?paymentId=${paymentDetails.paymentData.paymentId}&selectedVintage=${selectedVintage}`
            );
          } else {
            alert("Payment failed. Please try again.");
          }
        } else if (Date.now() - startTime >= MAX_MONITORING_TIME) {
          clearInterval(interval);
          setMonitoring(false);
          alert("Monitoring timed out. Payment status not confirmed.");
        }
      } catch {
        clearInterval(interval);
        setMonitoring(false);
        alert("Error monitoring payment status. Please try again.");
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [monitoring, paymentDetails, router, selectedVintage]);

  useEffect(() => {
    const storedPayment = localStorage.getItem("pendingPayment");
    if (storedPayment) {
      const parsedPayment = JSON.parse(storedPayment);
      setPaymentDetails(parsedPayment.paymentData);
      setFormSubmitted(true);
      setMonitoring(true);
    }
  }, []);

  return {
    listing,
    tonnesToRetire,
    setTonnesToRetire,
    loading,
    error,
    handleSubmit,
    formSubmitted,
    paymentDetails,
    paymentStatus,
    calculateTotalCost,
    amountReceived,
    changePaymentStatus,
    project,
  };
};

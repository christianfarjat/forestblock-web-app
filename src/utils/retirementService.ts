import {
  createQuote,
  createOrder,
  fetchPaymentDetails,
  handleError,
} from "@/utils/retirementSteps";
import { PaymentDetails, QuoteDetails, OrderDetails } from "@/types/retirement";

export interface RetirementProcessResult {
  paymentDetails: PaymentDetails;
  quoteData: QuoteDetails;
  orderData: OrderDetails;
}

interface ExecuteRetirementProcessParams {
  paymentId: string;
  beneficiary?: string;
  message?: string;
  userWalletAddress: string;
}

export async function executeRetirementProcess({
  paymentId,
  beneficiary,
  message,
  userWalletAddress,
}: ExecuteRetirementProcessParams): Promise<RetirementProcessResult> {
  try {
    const paymentData = await fetchPaymentDetails(paymentId);

    if (paymentData?.paymentData?.status === "SUBMITTED") {
      throw new Error("Payment already submitted. Cannot proceed.");
    }
    if (paymentData?.paymentData?.status !== "CONFIRMED") {
      throw new Error("Payment not confirmed. Cannot proceed.");
    }

    let finalBeneficiary = beneficiary || paymentData.paymentData.beneficiary;
    let finalMessage = message || paymentData.paymentData.message;

    if ((!finalBeneficiary || !finalMessage) && typeof window !== "undefined") {
      const storedPayment = localStorage.getItem("pendingPayment");
      if (storedPayment) {
        try {
          const parsedPayment = JSON.parse(storedPayment);
          if (!finalBeneficiary && parsedPayment.beneficiaryName) {
            finalBeneficiary = parsedPayment.beneficiaryName;
          }
          if (!finalMessage && parsedPayment.retirementMessage) {
            finalMessage = parsedPayment.retirementMessage;
          }
        } catch (parseError) {
          console.error(
            "Error parsing pendingPayment from localStorage:",
            parseError
          );
        }
      }
    }

    if (!finalBeneficiary || !finalMessage) {
      throw new Error(
        "Beneficiary and message are required to create the order."
      );
    }

    const quoteData = await createQuote(
      paymentId,
      paymentData.paymentData.tonnesToRetire
    );
    if (!quoteData.quoteId) {
      throw new Error("Quote ID is missing. Cannot create order.");
    }

    const orderData = await createOrder(
      paymentId,
      finalBeneficiary,
      finalMessage,
      quoteData.quoteId,
      userWalletAddress
    );

    return {
      paymentDetails: paymentData,
      quoteData,
      orderData: {
        ...orderData,
        status: "PENDING",
        quote: quoteData,
      },
    };
  } catch (err) {
    throw handleError(err, "Error executing retirement process");
  }
}

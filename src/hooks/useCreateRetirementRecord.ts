import { Project } from "@/types/project";
import { OrderDetails } from "@/types/retirement";
import { Retirement } from "@/types/useRetirements";
import axiosInstance from "@/utils/axios/axiosInstance";
import { MutableRefObject, useCallback } from "react";

interface CreateRetirementRecordParams {
  project: Project;
  paymentId: string | null | undefined;
  user: { walletAddress?: string } | null;
  setNewRetirement: (retirement: Retirement) => void;
  orderDetailsRef: MutableRefObject<OrderDetails | null>;
}

const useCreateRetirementRecord = ({
  project,
  paymentId,
  user,
  setNewRetirement,
  orderDetailsRef,
}: CreateRetirementRecordParams) => {
  const createRetirementRecord = useCallback(async () => {
    if (!project || !paymentId) {
      return;
    }
    try {
      const selectedVintage = localStorage.getItem("selectedVintage");
      const retirementPayload = {
        project,
        paymentId: paymentId,
        selectedVintage: selectedVintage ?? "0",
        order: orderDetailsRef.current,
        walletAddress: user?.walletAddress,
      };
      const response = await axiosInstance.post(
        "/retirements/registerRetirement",
        retirementPayload
      );
      const newRetirement = response.data;
      setNewRetirement(newRetirement.retirement);

      localStorage.removeItem("project");
      localStorage.removeItem("selectedVintage");
      localStorage.removeItem("pendingPayment");
      localStorage.removeItem("retirementProcessInProgress");
      localStorage.removeItem("retirementProcessId");
      localStorage.removeItem("paymentStartTime");
    } catch (error) {
      console.error("Error creating retirement record:", error);
    }
  }, [
    project,
    paymentId,
    user?.walletAddress,
    setNewRetirement,
    orderDetailsRef,
  ]);
  return createRetirementRecord;
};

export default useCreateRetirementRecord;

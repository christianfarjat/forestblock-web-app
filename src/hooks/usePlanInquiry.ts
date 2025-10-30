"use client";

import { useCallback, useState, ChangeEvent } from "react";
import { AxiosResponse } from "axios";
import axiosInstance from "@/utils/axios/axiosInstance";

export interface InquiryFormData {
  plan: string;
  fullName: string;
  company: string;
  phone: string;
  email: string;
  contactViaWhatsApp: boolean;
}

interface InquiryResponse {
  message: string;
}

const initialFormData: InquiryFormData = {
  plan: "",
  fullName: "",
  company: "",
  phone: "",
  email: "",
  contactViaWhatsApp: false,
};

const usePlanInquiry = () => {
  const [formData, setFormData] = useState<InquiryFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<InquiryResponse | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const setPlan = (plan: string) => {
    setFormData((prev) => ({ ...prev, plan }));
  };

  const submitInquiry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<InquiryResponse> = await axiosInstance.post(
        "/plan/plan-inquiry",
        formData
      );
      setResponse(res.data);
      alert(res.data.message);
    } catch (err: unknown) {
      console.error("Error al enviar la consulta:", err);
      setError("Error al enviar la consulta. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const resetForm = () => setFormData(initialFormData);

  return {
    formData,
    handleInputChange,
    setPlan,
    submitInquiry,
    resetForm,
    loading,
    error,
    response,
  };
};

export default usePlanInquiry;

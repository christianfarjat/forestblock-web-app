import { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { FormState } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { axiosPublicInstance } from "@/utils/axios/axiosPublicInstance";

export function useLogin() {
  const { login } = useAuth();
  const [formState, setFormState] = useState<FormState>({ email: "", otp: "" });
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSendOTP = async (captchaToken: string) => {
    if (!captchaToken) {
      throw new Error('Token de ReCAPTCHA requerido');
    }

    setError("");
    setIsLoading(true);

    try {
      const requestBody = { email: formState.email, captcha_token: captchaToken };
      await axiosPublicInstance.post("/auth/send-otp", requestBody);
      setOtpSent(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        throw new Error(`Error enviando OTP: ${errorMessage}`);
      }
      throw new Error(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const requestBody = { email: formState.email, otp: formState.otp };
      const response: AxiosResponse = await axiosPublicInstance.post(
        "/auth/verify-otp",
        requestBody
      );

      login(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        throw new Error(`Error verificando OTP: ${errorMessage}`);
      }
      throw new Error(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    handleInputChange,
    handleSendOTP,
    handleVerifyOTP,
    otpSent,
    error,
    setError,
    isLoading,
  };
}

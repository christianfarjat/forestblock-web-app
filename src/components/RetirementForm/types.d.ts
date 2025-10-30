export interface RetireFormProps {
  handleSubmit: (
    e: React.FormEvent,
    selectedPayment: string | null,
    formData: { beneficiary: string; message: string }
  ) => void;
  setPaymentMethod: (method: string) => void;
}

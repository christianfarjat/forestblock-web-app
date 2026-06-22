import React, { useState } from "react";
import Image from "next/image";
import { RetireFormProps } from "./types";

const RetireForm: React.FC<RetireFormProps> = ({
  handleSubmit,
  setPaymentMethod,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    beneficiary: "",
    message: "",
  });

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    setPaymentMethod(method);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, selectedPayment, formData)}
      className="grid gap-4"
    >
      {/* Para mobile, mostramos en 1 columna y en pantallas mayores en 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <label className="block text-[18px] font-neueMontreal">
          ¿A quién se acreditará este retiro?{" "}
          <span className="text-customRed font-bold">*</span>
          <input
            type="text"
            name="beneficiary"
            value={formData.beneficiary}
            onChange={handleChange}
            placeholder="Nombre del beneficiario"
            required
            className="mt-1 block w-full border border-gray-300 rounded-full p-2 shadow-sm text-[16px] font-neueMontreal"
          />
        </label>

        <label className="block text-[18px] font-neueMontreal">
          Mensaje de retiro <span className="text-customRed font-bold">*</span>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe el propósito de este retiro"
            required
            className="mt-1 block w-full border border-gray-300 shadow-sm rounded-full p-2 text-[16px] font-neueMontreal"
          />
        </label>
      </div>

      <div className="grid gap-5">
        <label className="block text-[18px] font-neueMontreal">
          Pagar con: <span className="text-customRed font-bold">*</span>
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-gray-500 font-neueMontreal self-end">
            $1,000.00 máximo para tarjetas de crédito.
          </span>
          {/* Agregamos w-full en mobile y w-auto en pantallas mayores */}
          <button
            type="button"
            onClick={() => handlePaymentSelect("credit-card")}
            className={`w-full sm:w-auto flex items-center justify-between p-4 rounded-xl ${
              selectedPayment === "credit-card"
                ? "bg-customGreen"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2 text-[16px] font-medium font-neueMontreal">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
                <Image
                  width={5}
                  height={5}
                  src="/images/card.png"
                  alt="Credit Card Icon"
                  className="w-3 h-3"
                />
              </div>
              Tarjeta de crédito
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePaymentSelect("usdt")}
            className={`w-full sm:w-auto flex items-center justify-between p-4 rounded-xl ${
              selectedPayment === "usdt"
                ? "bg-customGreen"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2 text-[16px] font-medium font-neueMontreal">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
                <Image
                  width={5}
                  height={5}
                  src="/images/usdt.png"
                  alt="Credit Card Icon"
                  className="w-3 h-3"
                />
              </div>
              USDT
            </span>
          </button>
        </div>

        <div className="p-4 border-customYellow border-2 rounded-lg">
          <p className="text-[16px] text-forestGreen text-center font-neueMontreal">
            Ten cuidado de no incluir información personal sensible (como una
            dirección de correo electrónico) en el nombre o mensaje del retiro.
            La información que ingreses aquí no podrá ser editada una vez
            enviada y existirá de manera permanente en una cadena de bloques
            pública.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-mintGreen text-forestGreen font-bold font-aeonik py-4 px-4 text-[23px] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Retirar Carbono
      </button>
    </form>
  );
};

export default RetireForm;

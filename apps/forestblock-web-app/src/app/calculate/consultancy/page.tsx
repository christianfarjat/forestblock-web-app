"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar/TopBar";
import PlanCard from "@/components/PlanCard/PlanCard";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { BackButtonProps } from "@/components/BackButton/types";
import { plans } from "@/constants";
import usePlanInquiry from "@/hooks/usePlanInquiry";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const {
    formData,
    handleInputChange,
    setPlan,
    submitInquiry,
    resetForm,
    loading,
    error,
  } = usePlanInquiry();

  const handleSelectPlan = (planTitle: string) => {
    setPlan(planTitle);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInquiry();
    if (!error) {
      closeModal();
    }
  };

  const BackButton: React.FC<BackButtonProps> = ({ onGoBack, text }) => (
    <button
      className="flex items-center gap-2 text-white p-2 rounded-full transition bg-[#182D1F]/50 mb-5 hover:bg-[#182D1F]/70"
      onClick={onGoBack}
    >
      <div className="flex items-center justify-center w-6 h-6 border border-white rounded-full">
        <IoIosArrowBack size={12} className="text-white" />
      </div>
      <span className="hidden lg:inline text-white text-[17px] font-aeonik font-medium">
        {text}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen p-3">
      <TopBar />

      <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl mt-5">
        <div className="relative">
          <BackButton
            text="Calculadora"
            onGoBack={() => router.push("/calculate")}
          />

          <h1 className="text-[28px] md:text-[40px] font-aeonik font-bold text-forestGreen mb-5 lg:mb-20">
            Selecciona tu plan
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              title={plan.title}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
              onSelectPlan={() => handleSelectPlan(plan.title)}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 sm:px-0 sm:py-0">
          <div className="relative w-full max-w-3xl bg-white rounded-xl p-8 shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
              onClick={closeModal}
            >
              X
            </button>

            <h2 className="text-2xl mb-6 font-bold text-gray-800">
              ¡Completa tus datos para iniciar tu consulta!
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  className="block mb-1 font-semibold text-gray-700"
                  htmlFor="plan"
                >
                  Plan seleccionado
                </label>
                <select
                  id="plan"
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-forestGreen"
                  value={formData.plan}
                  onChange={handleInputChange}
                >
                  {plans.map((p) => (
                    <option key={p.title} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-1 font-semibold text-gray-700"
                    htmlFor="fullName"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-forestGreen"
                    placeholder="Ingresa tu nombre completo"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 font-semibold text-gray-700"
                    htmlFor="company"
                  >
                    Empresa
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-forestGreen"
                    placeholder="Nombre de tu empresa (opcional)"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 font-semibold text-gray-700"
                    htmlFor="phone"
                  >
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-forestGreen"
                    placeholder="Tu número de teléfono"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 font-semibold text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-forestGreen"
                    placeholder="Tu correo electrónico"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input
                  id="contactViaWhatsApp"
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-forestGreen focus:ring-forestGreen border-gray-300 rounded"
                  checked={formData.contactViaWhatsApp}
                  onChange={handleInputChange}
                />
                <label
                  className="font-semibold text-gray-700"
                  htmlFor="contactViaWhatsApp"
                >
                  Prefiero ser contactado por WhatsApp
                </label>
              </div>

              <button
                type="submit"
                className="mt-6 w-full md:w-auto bg-customGreen text-forestGreen py-2 px-6 rounded-full hover:bg-customGreen/80 transition font-aeonik font-medium"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Solicitar consulta"}
              </button>
              {error && (
                <p className="mt-2 text-red-600 font-semibold">{error}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

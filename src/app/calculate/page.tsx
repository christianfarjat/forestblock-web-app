'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar/TopBar';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import Button from '@/components/Marketplace/Button';
import MultiStepCalculator from '@/components/MultiStepCalculator/MultiStepCalculator';
import CalculationResult from '@/components/CalculationResult/CalculationResult';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import useCalculator from '@/hooks/useCalculator';
import { CalculatorResponse } from '@/types/calculator';

const CalculatePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();

  const {
    calculate,
    saveCalculation,
    formData,
    setFormData,
    addEntry,
    loading,
    error,
    totalKgCO2e,
  } = useCalculator();

  const [pendingResponse, setPendingResponse] = useState<CalculatorResponse | null>(null);
  const [showMobileResults, setShowMobileResults] = useState(false);

  useEffect(() => {
    if (isAuthenticated && pendingResponse) {
      saveCalculation(pendingResponse);
      setPendingResponse(null);
    }
  }, [isAuthenticated, pendingResponse, saveCalculation]);

  const handleStepComplete = (response: CalculatorResponse) => {
    if (isAuthenticated) {
      saveCalculation(response);
      return;
    }
    const want = window.confirm('¿Querés guardar tu resultado antes de continuar?');
    if (want) {
      setPendingResponse(response);
      openModal('login');
    }
  };

  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />
      <HeroBanner
        title={
          <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
            Tu huella de carbono es un punto de partida. <br />
            <span className="text-mintGreen font-aeonik">Descubre cómo reducirla</span> con nuestra
            consultoría personalizada.
          </h1>
        }
      >
        <Button variant="primary" onClick={() => router.push('/calculate/consultancy')}>
          Solicitar consultoría
        </Button>
        <Button variant="secondary" onClick={() => router.push('/marketplace')}>
          Compensar huella
        </Button>
      </HeroBanner>

      <div className="flex-1 p-3 md:p-10 bg-backgroundGray rounded-xl pb-80 md:pb-0">
        <div className="flex flex-col-reverse md:flex-row gap-6">
          <div className="w-full md:w-[70%]">
            <MultiStepCalculator
              formData={formData}
              setFormData={setFormData}
              addEntry={addEntry}
              calculate={calculate}
              onStepComplete={handleStepComplete}
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
          <div className="hidden md:block w-full md:w-[30%] self-start sticky top-5 z-20">
            <CalculationResult loading={loading} totalKgCO2e={totalKgCO2e} />
          </div>
        </div>
      </div>

      {!showMobileResults ? (
        <button
          onClick={() => setShowMobileResults(true)}
          className="fixed bottom-4 right-4 md:hidden bg-customGreen text-forestGreen px-4 py-2 rounded-full shadow-lg z-50"
        >
          Ver resultados
        </button>
      ) : (
        <div className="fixed bottom-0 left-0 w-full md:hidden bg-white p-3 shadow-2xl z-10 border-t border-t-borderGray2 rounded-t-xl">
          <button
            onClick={() => setShowMobileResults(false)}
            className="absolute top-2 right-2 text-2xl font-bold text-gray-300 hover:text-gray-800 p-2"
            aria-label="Cerrar resultados"
          >
            &times;
          </button>
          <CalculationResult loading={loading} totalKgCO2e={totalKgCO2e} />
        </div>
      )}
    </div>
  );
};

export default CalculatePage;

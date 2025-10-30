/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/Marketplace/Button';
import { steps } from './stepsConfig';
import { MultiStepFormData, CalculationPayload } from '@/types/calculator';
import StepComponents from './StepComponents';
import { validateFormData } from '@/utils/validateFormData';
import { MultiStepCalculatorProps } from './steps/types';
import useParsedFormData from '@/hooks/useParsedFormData';

const MultiStepCalculator: React.FC<MultiStepCalculatorProps> = ({
  formData,
  setFormData,
  addEntry,
  calculate,
  onStepComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = useState<Record<string, number>>({});
  const [finishedSteps, setFinishedSteps] = useState<Set<string>>(new Set());

  const {
    validAirTravelData,
    validCarJourneyData,
    validWaterSupplyData,
    validElectricityConsumptionData,
    validTrainJourneyData,
    validBusTripData,
    validHotelStayData,
    validFuelData,
  } = useParsedFormData(formData);

  useEffect(() => {
    const firstId = steps[0].id as keyof MultiStepFormData;
    if (!formData[firstId] || formData[firstId]!.length === 0) {
      addEntry(firstId, steps[0].defaultData);
      setCurrentEntryIndex({ [firstId]: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStepClick = (nextIndex: number) => {
    const prevId = steps[currentStep].id as keyof MultiStepFormData;
    if (!finishedSteps.has(prevId)) {
      setFormData((prev) => ({ ...prev, [prevId]: [] }));
      setCurrentEntryIndex((prev) => {
        const copy = { ...prev };
        delete copy[prevId];
        return copy;
      });
    }

    const nextId = steps[nextIndex].id as keyof MultiStepFormData;
    if (!formData[nextId] || formData[nextId]!.length === 0) {
      addEntry(nextId, steps[nextIndex].defaultData);
      setCurrentEntryIndex((prev) => ({ ...prev, [nextId]: 0 }));
    }

    setCurrentStep(nextIndex);
  };

  const handleContinue = async () => {
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      errors.forEach((err) => alert(err));
      return;
    }

    const validByStep: Record<string, any[]> = {
      airTravel: validAirTravelData,
      carJourney: validCarJourneyData,
      waterSupply: validWaterSupplyData,
      electricityConsumption: validElectricityConsumptionData,
      trainJourney: validTrainJourneyData,
      busTrip: validBusTripData,
      hotelStay: validHotelStayData,
      fuel: validFuelData,
    };

    const stepId = steps[currentStep].id as keyof MultiStepFormData;
    const entriesForThis = validByStep[stepId] || [];
    const payload: CalculationPayload = {
      calculation_options: [entriesForThis[currentEntryIndex[stepId]]],
      order_count: 1,
    };
    const response = await calculate(payload);
    onStepComplete?.(response);

    setFinishedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });

    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    const nextId = steps[nextStep].id as keyof MultiStepFormData;
    if (!formData[nextId] || formData[nextId]!.length === 0) {
      addEntry(nextId, steps[nextStep].defaultData);
      setCurrentEntryIndex((prev) => ({ ...prev, [nextId]: 0 }));
    }

    setCurrentStep(nextStep);
  };

  const handleSkip = () => {
    const stepId = steps[currentStep].id as keyof MultiStepFormData;
    setFormData((prev) => ({ ...prev, [stepId]: [] }));
    setCurrentEntryIndex((prev) => {
      const next = { ...prev };
      delete next[stepId];
      return next;
    });

    setFinishedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });

    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    const nextId = steps[nextStep].id as keyof MultiStepFormData;
    if (!formData[nextId] || formData[nextId]!.length === 0) {
      addEntry(nextId, steps[nextStep].defaultData);
      setCurrentEntryIndex((prev) => ({ ...prev, [nextId]: 0 }));
    }

    setCurrentStep(nextStep);
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full bg-white rounded-xl md:p-6 p-3 flex flex-col gap-3">
      <h1 className="text-[28px] md:text-[40px] font-aeonik font-bold text-forestGreen mb-5">
        Calcula tu huella
      </h1>

      {steps.map((step, index) => {
        const id = step.id as keyof MultiStepFormData;
        const entries = formData[id] ?? [];
        const entryIndex = currentEntryIndex[id] ?? 0;
        const currentData = entries[entryIndex];
        const StepComponent = StepComponents[id] as React.FC<any>;
        const isActive = index === currentStep;

        return (
          <div key={id} className="border rounded-lg">
            <div
              onClick={() => handleStepClick(index)}
              className={`cursor-pointer flex items-center gap-3 px-3 pt-3 pb-4 ${
                isActive ? 'border-b' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-sm font-semibold">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <h2 className="text-xl font-semibold">{step.label}</h2>
            </div>
            {isActive && currentData && (
              <div className="p-3">
                <StepComponent
                  formData={currentData}
                  setFormData={(data: any) => {
                    const updated = [...entries];
                    updated[entryIndex] = {
                      ...updated[entryIndex],
                      ...data,
                    };
                    setFormData((prev: MultiStepFormData) => ({
                      ...prev,
                      [id]: updated,
                    }));
                  }}
                />

                <div className="flex justify-end gap-3 mt-6">
                  {!isLastStep && (
                    <Button variant="tertiary" onClick={handleSkip}>
                      Omitir
                    </Button>
                  )}
                  <Button variant="quaternary" onClick={handleContinue}>
                    {isLastStep ? 'Calcular' : 'Continuar'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MultiStepCalculator;

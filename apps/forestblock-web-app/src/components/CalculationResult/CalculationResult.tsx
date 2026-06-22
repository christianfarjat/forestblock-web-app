import React from 'react';
import Button from '../Marketplace/Button';
import { useRouter } from 'next/navigation';
import { CalculationResultProps } from './types';
import { CgSpinner } from 'react-icons/cg';
import { kgToToneladas } from '@/utils/conversion';

const CalculationResult: React.FC<CalculationResultProps> = ({ loading, totalKgCO2e }) => {
  const router = useRouter();
  const totalTCO2e = kgToToneladas(totalKgCO2e);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded flex items-center justify-center">
        <CgSpinner className="animate-spin h-8 w-8 text-customGreen" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:gap-4 gap-2 w-full">
      <div className="bg-white rounded-xl md:p-6 p-2 flex flex-col items-center">
        <div className="flex items-center justify-center flex-col">
          <p className="md:text-7xl text-3xl font-aeonik font-medium md:mb-3">
            {totalTCO2e.toFixed(2) || 0}
          </p>
          <div className="flex flex-col items-center md:gap-5 gap-2">
            <p className="text-xl font-aeonik text-center text-customGray">tCO2</p>
            <p className="md:text-lg text-sm font-aeonik text-center text-customGray">
              Rellena la información para saber cuanto CO2 deberías compensar
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button className="w-full" variant="quinary" onClick={() => router.push('/marketplace')}>
          Compensar huella
        </Button>
        <Button
          className="w-full"
          variant="quaternary"
          onClick={() => router.push('/calculate/consultancy')}
        >
          Solicitar consultoría
        </Button>
      </div>
    </div>
  );
};

export default CalculationResult;

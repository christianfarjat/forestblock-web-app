'use client';

import React from 'react';
import { kgToToneladas } from '@/utils/conversion';
import { KlimapiProps } from './types';
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';

const KlimapiResults: React.FC<KlimapiProps> = ({ results }) => {
  const router = useRouter();
  if (!results.length) {
    return (
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-10 text-center flex flex-col items-center gap-4">
        <p className="text-gray-500">No se encontraron resultados de cálculos.</p>
        <Button
          text="Calcular huella de carbono"
          variant="primary"
          onClick={() => router.push('/calculate')}
        />
      </div>
    );
  }

  const totalKgCO2e = results.reduce((sum, result) => sum + result.kgCO2e, 0);
  const totalToneladas = kgToToneladas(totalKgCO2e);

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-10 text-center">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">Resumen de tus cálculos</h2>
      <div className="flex flex-col items-center">
        <p className="text-3xl font-bold text-forestGreen mb-4">
          {totalToneladas.toFixed(2)} tCO₂e
        </p>
      </div>
    </div>
  );
};

export default KlimapiResults;

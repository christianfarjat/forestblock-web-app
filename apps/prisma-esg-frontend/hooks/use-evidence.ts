'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useEvidence() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadEvidence = async (file: File, indicatorId?: string) => {
    setLoading(true);
    try {
      const evidence = await apiClient.uploadEvidence(file, indicatorId);
      setError(null);
      return evidence;
    } catch (err: unknown) {
      setError('Failed to upload evidence');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadEvidence = async (id: string) => {
    setLoading(true);
    try {
      const download = await apiClient.downloadEvidence(id);
      setError(null);
      return download;
    } catch (err) {
      setError('Failed to download evidence');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listEvidence = async (indicatorId?: string) => {
    setLoading(true);
    try {
      const evidence = await apiClient.listEvidence(indicatorId);
      setError(null);
      return evidence;
    } catch (err) {
      setError('Failed to load evidence');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    error,
    uploadEvidence,
    downloadEvidence,
    listEvidence,
  };
}

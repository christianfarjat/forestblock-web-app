'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useEvidence } from '@/hooks/use-evidence';
import { Button } from '@/components/common/button';
import { Alert } from '@/components/common/alert';
import { formatFileSize } from '@/lib/utils';

interface EvidenceUploaderProps {
  indicatorId?: string;
  onSuccess?: () => void;
}

export function EvidenceUploader({ indicatorId, onSuccess }: EvidenceUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadEvidence, isLoading, error } = useEvidence();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadEvidence(selectedFile, indicatorId);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert type="error" message={error} />
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        />

        <Upload size={32} className="mx-auto text-gray-400 mb-4" />

        <p className="text-gray-900 font-medium mb-1">
          Drag and drop your file here
        </p>
        <p className="text-gray-500 text-sm mb-4">
          or click the button below to browse
        </p>

        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
        >
          Choose File
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG
        </p>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <Button
            onClick={handleUpload}
            isLoading={isLoading}
            className="w-full mt-4"
          >
            Upload Evidence
          </Button>
        </div>
      )}
    </div>
  );
}

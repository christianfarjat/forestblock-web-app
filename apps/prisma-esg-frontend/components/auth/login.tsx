'use client';

import { useState } from 'react';
import { Button } from '@/components/common/button';
import { Alert } from '@/components/common/alert';
import { Leaf } from 'lucide-react';

export function Login() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('@/lib/firebase');
      const result = await signInWithPopup(auth, googleProvider);
      // Token will be obtained by auth state listener
      console.log('Signed in as:', result.user.email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="text-green-600" size={32} />
          <h1 className="text-2xl font-bold text-gray-900">Prisma ESG</h1>
        </div>

        <h2 className="text-center text-gray-600 mb-8">
          ESG Tracking & Disclosure Platform
        </h2>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <Button
          onClick={handleGoogleSignIn}
          isLoading={isLoading}
          className="w-full mb-4"
        >
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

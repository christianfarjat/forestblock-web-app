'use client';

import { ReactNode, useEffect, useState } from 'react';
import { validateFirebaseConfig } from '@/lib/firebase-config';

interface FirebaseProviderProps {
  children: ReactNode;
}

/**
 * FirebaseProvider
 * Proveedor de contexto para Firebase.
 * Valida la configuración al montar el componente.
 *
 * Úsalo para envolver tu aplicación en el layout raíz.
 *
 * Ejemplo en app/layout.tsx:
 * ```
 * import { FirebaseProvider } from '@/components/providers/firebase-provider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <FirebaseProvider>
 *           {children}
 *         </FirebaseProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // Valida la configuración de Firebase
      validateFirebaseConfig();
      setIsInitialized(true);
    } catch (error) {
      console.error('Firebase configuration error:', error);
      setHasError(true);
      setIsInitialized(true);
    }
  }, []);

  // Muestra un error si la configuración es inválida
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Firebase Configuration Error
          </h1>
          <p className="text-gray-700 mb-4">
            Las variables de entorno de Firebase no están configuradas correctamente.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Por favor, revisa tu archivo .env.local y asegúrate de que todas las variables
            de Firebase están configuradas. Ver FIREBASE_SETUP.md para más información.
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              Detalles
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              Verifica que estas variables estén en .env.local:
              {'\n'}
              - NEXT_PUBLIC_FIREBASE_API_KEY
              {'\n'}
              - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
              {'\n'}
              - NEXT_PUBLIC_FIREBASE_PROJECT_ID
              {'\n'}
              - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
              {'\n'}
              - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
              {'\n'}
              - NEXT_PUBLIC_FIREBASE_APP_ID
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Inicializando Firebase...</p>
      </div>
    );
  }

  return <>{children}</>;
}

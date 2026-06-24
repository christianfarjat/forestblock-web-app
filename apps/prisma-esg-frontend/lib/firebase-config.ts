/**
 * Configuración centralizada de Firebase
 * Este archivo exporta tipos y utilidades para trabajar con Firebase
 */

/**
 * Tipo para la configuración de Firebase
 * Validar que todas las variables de entorno estén presentes
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Valida que todas las variables de entorno de Firebase estén configuradas
 * @throws Error si falta alguna variable requerida
 */
export function validateFirebaseConfig(): FirebaseConfig {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Firebase configuration incomplete. Missing variables:\n${missingVars.map((v) => `  - ${v}`).join('\n')}\n\nPlease set these in .env.local file.`
    );
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '421467996684',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
}

/**
 * Obtiene la URL del backend API
 * @returns URL del API backend
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
}

/**
 * Verifica si estamos en un entorno de desarrollo
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Verifica si el emulator de Firebase está disponible
 */
export const firebaseEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

/**
 * Project ID de Firebase para esta aplicación
 */
export const FIREBASE_PROJECT_ID = '421467996684';

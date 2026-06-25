'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

/**
 * Firebase Configuration para Prisma ESG
 * Credenciales cargadas desde variables de entorno
 * Project ID: 421467996684
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Verifica que las variables estén cargadas
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey) {
    console.error('⚠️ NEXT_PUBLIC_FIREBASE_API_KEY no está cargada');
  }
  if (!firebaseConfig.projectId) {
    console.error('⚠️ NEXT_PUBLIC_FIREBASE_PROJECT_ID no está cargada');
  }
}

// Inicializa Firebase App - evita reinicialización en HMR
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Obtiene instancia de Auth
const auth = getAuth(app);

// Configuración específica del cliente (solo en navegador)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Activa persistencia local del usuario
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.debug('Failed to set persistence:', error);
  });

  // Conecta al emulador de Firebase Auth si está disponible (desarrollo local)
  if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) {
    try {
      connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`, {
        disableWarnings: true,
      });
    } catch (error) {
      // El emulador podría ya estar conectado, continúa sin error
      console.debug('Emulator already connected or unavailable', error);
    }
  }
}

// Proveedor de Google con configuración personalizada
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'consent',
});

export { app, auth };

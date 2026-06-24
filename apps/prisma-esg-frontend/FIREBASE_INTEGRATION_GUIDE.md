# Guía de Integración Firebase - Prisma ESG

## Estado Actual de Configuración ✓

La aplicación ya tiene todo lo necesario configurado para Firebase. Solo necesitas proporcionar las credenciales específicas de tu proyecto.

### Archivos Configurados

1. **`/lib/firebase.ts`** - Inicialización de Firebase SDK
   - Maneja la inicialización con las credenciales de .env.local
   - Configura persistencia local del usuario
   - Soporte para Firebase Auth Emulator
   - Google Auth Provider preconfigurado

2. **`/lib/firebase-config.ts`** - Utilidades de configuración
   - Función `validateFirebaseConfig()` para validar credenciales
   - Helper `getApiUrl()` para obtener URL del backend
   - Constantes útiles (PROJECT_ID, isDevelopment, etc.)

3. **`/hooks/use-auth.ts`** - Hook de autenticación
   - Integración con Firebase Auth
   - Sincronización automática con backend API
   - Gestión de tokens y organizaciones
   - Logout seguro

4. **`/lib/auth-store.ts`** - State Management (Zustand)
   - Store centralizado de autenticación
   - Usuario, token, organizaciones, roles
   - Persistencia entre navegaciones

5. **`/components/providers/firebase-provider.tsx`** - Proveedor de contexto (nuevo)
   - Validación de configuración al inicio
   - Mensajes de error descriptivos si algo falta

6. **`/.env.local`** - Variables de entorno (nuevo)
   - Template preconfigurado con PROJECT_ID
   - Listo para agregar credenciales

7. **`/FIREBASE_SETUP.md`** - Documentación de setup
   - Instrucciones paso a paso
   - Cómo obtener credenciales de Firebase Console

## Pasos para Completar la Configuración

### Paso 1: Obtener Credenciales de Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto con ID: **421467996684**
3. Ve a **Project Settings** (⚙️ en la esquina superior izquierda)
4. En la pestaña **General**, desplázate a "Your apps"
5. Haz clic en tu aplicación web o crea una nueva
6. Copia los datos de configuración que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "proyecto-421467996684.firebaseapp.com",
  projectId: "421467996684",
  storageBucket: "proyecto-421467996684.appspot.com",
  messagingSenderId: "123456789...",
  appId: "1:123456789:web:abcdef123456..."
};
```

### Paso 2: Actualizar `.env.local`

Edita `/home/user/forestblock-web-app/apps/prisma-esg-frontend/.env.local`:

```env
# Firebase Configuration (obtén estos valores de Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto-421467996684.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=421467996684
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto-421467996684.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Paso 3: Envolver la aplicación con FirebaseProvider (Opcional pero Recomendado)

Edita `/home/user/forestblock-web-app/apps/prisma-esg-frontend/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { FirebaseProvider } from '@/components/providers/firebase-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Prisma ESG - ESG Tracking & Disclosure Platform',
  description: 'Production-ready ESG tracking and disclosure platform',
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
```

### Paso 4: Usar useAuth en tus componentes

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export default function Dashboard() {
  const { user, isLoading, error, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
    </div>
  );
}
```

## Estructura de Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│                   Prisma ESG Frontend                       │
│                     (Next.js 15)                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Firebase Authentication                        │
│  • Google OAuth Provider                                   │
│  • Email/Password (configurable)                           │
│  • User Management & Tokens                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  use-auth Hook                             │
│  • Escucha onAuthStateChanged                              │
│  • Obtiene ID Token                                        │
│  • Sincroniza con Backend API                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Zustand Auth Store                             │
│  • User State                                              │
│  • Organizations & Roles                                   │
│  • Global State Management                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API                               │
│  • Token Validation                                        │
│  • User Data / Organizations                               │
│  • ESG Data & Indicators                                   │
└─────────────────────────────────────────────────────────────┘
```

## Verificación de la Configuración

### En Desarrollo

1. Inicia el servidor:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:3000

3. Verifica en la consola del navegador:
   - No debe haber errores de Firebase
   - Si falta alguna variable, verás un warning

### En Consola del Navegador (DevTools)

```javascript
// Verifica que Firebase está inicializado
import { getApp } from 'firebase/app';
const app = getApp();
console.log('Firebase app:', app);

// Verifica el usuario actual
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log('Current user:', auth.currentUser);
```

## Troubleshooting

### Error: "No Firebase App '[DEFAULT]' has been created"
**Causa**: Variables de entorno incompletas
**Solución**: Verifica que todas las variables en `.env.local` están configuradas

### Error: "Auth.signInWithPopup is not a function"
**Causa**: Firebase no está inicializado correctamente
**Solución**: Espera a que la app cargue (usa isLoading del hook)

### Usuario desconectado inesperadamente
**Causa**: Token expirado o sesión perdida
**Solución**: El sistema debe renovar el token automáticamente. Si persiste, verifica configuración de persistencia en `/lib/firebase.ts`

### Firebase Auth Emulator no conecta
**Causa**: Emulator no está corriendo
**Solución**: 
```bash
npm install -g firebase-tools
firebase emulators:start
```

## Archivos Importados Automáticamente

Estos archivos ya están integrados y NO necesitan cambios manuales:

- ✓ `/lib/api-client.ts` - Cliente HTTP para Backend
- ✓ `/components/auth/login.tsx` - Componente de Login
- ✓ `/hooks/use-indicators.ts` - Hook para Indicadores ESG
- ✓ `/components/dashboard/dashboard.tsx` - Dashboard principal

## Próximos Pasos

1. **Obtener credenciales** de Firebase Console (Project ID: 421467996684)
2. **Actualizar `.env.local`** con las credenciales
3. **Envolver app layout** con FirebaseProvider (opcional)
4. **Iniciar desarrollo** con `npm run dev`
5. **Probar autenticación** con Google OAuth

## Documentación Adicional

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Guía detallada de setup
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)

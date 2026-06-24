# Configuración de Firebase - Prisma ESG Frontend

## Información del Proyecto
- **Project ID**: 421467996684
- **Framework**: Next.js 15
- **React**: 19.2.7
- **Firebase SDK**: 10.11.0

## Pasos para Configurar Firebase

### 1. Obtener Credenciales del Proyecto Firebase

1. Accede a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto con ID: **421467996684**
3. Ve a **Project Settings** (ícono de engranaje en la esquina superior izquierda)
4. En la pestaña **General**, desplázate hacia abajo hasta encontrar "Your apps"
5. Si no hay una aplicación web registrada, haz clic en **"Create a new web app"**
6. Completa los datos (nombre de la app, hosting con Firebase)
7. Copia la configuración que aparece en el código JavaScript

### 2. Credenciales Necesarias

Necesitarás estos valores de tu configuración de Firebase:

- **NEXT_PUBLIC_FIREBASE_API_KEY**: Clave de API de tu proyecto
- **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**: Dominio de autenticación (ej: `proyecto-421467996684.firebaseapp.com`)
- **NEXT_PUBLIC_FIREBASE_PROJECT_ID**: 421467996684 (ya preconfigurado)
- **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**: Bucket de almacenamiento (ej: `proyecto-421467996684.appspot.com`)
- **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**: ID del remitente para mensajería
- **NEXT_PUBLIC_FIREBASE_APP_ID**: ID de la aplicación Firebase

### 3. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y reemplaza los valores de placeholder con las credenciales de Firebase Console:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=421467996684
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

### 4. Archivos de Configuración Actualizados

Los siguientes archivos ya están configurados para funcionar con Firebase:

#### `/lib/firebase.ts`
- Inicializa la aplicación Firebase
- Configura la autenticación con persistencia local
- Incluye soporte para Google Auth Provider
- Compatible con Firebase Auth Emulator (desarrollo local)

#### `/hooks/use-auth.ts`
- Hook personalizado para gestionar estado de autenticación
- Integra Firebase Auth con el store de Zustand
- Maneja automáticamente tokens ID para API calls
- Sincroniza datos de usuario con el backend

#### `/lib/auth-store.ts`
- Zustand store para estado global de autenticación
- Almacena usuario, token, organizaciones y roles
- Estado persistente entre navigaciones

### 5. Desarrollo Local (Opcional)

Para usar el Emulator de Firebase Auth en desarrollo local:

1. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Inicia el emulator:
   ```bash
   firebase emulators:start
   ```

3. En `.env.local`, descomenta y configura:
   ```env
   NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
   ```

### 6. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura de Autenticación

El flujo de autenticación funciona así:

1. **Firebase Auth** maneja login/signup con Google
2. **use-auth hook** escucha cambios de estado en Firebase
3. Obtiene **ID Token** de Firebase
4. Envía token al **backend API** para validación
5. **API** retorna datos de usuario y organizaciones
6. **Zustand store** actualiza estado global

## Seguridad

- Las credenciales públicas están prefijadas con `NEXT_PUBLIC_`
- Los tokens de sesión se almacenan en `localStorage`
- El cookie de sesión del backend se maneja automáticamente
- La persistencia se configura en el navegador automáticamente

## Troubleshooting

### "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifica que todas las variables de `.env.local` están correctamente configuradas
- Las variables deben estar disponibles en tiempo de ejecución del cliente

### "connectAuthEmulator" ya conectado
- Es normal. El sistema detecta cuando el emulator ya está conectado y continúa sin error

### Token expirado
- Los tokens se renuevan automáticamente. Si experimentas logout inesperado:
  - Verifica la configuración de persistencia
  - Revisa los logs de Firebase en la consola del navegador

## Documentación Útil

- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Next.js 15 Documentation](https://nextjs.org/docs)

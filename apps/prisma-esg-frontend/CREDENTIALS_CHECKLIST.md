# Checklist de Credenciales Firebase - Prisma ESG

## Información del Proyecto
- **Nombre**: Prisma ESG Frontend
- **Framework**: Next.js 15 + React 19
- **Firebase Project ID**: 421467996684
- **Ubicación**: `/home/user/forestblock-web-app/apps/prisma-esg-frontend/`

## Credenciales que Necesitas

Obtén estos valores de **Firebase Console > Project Settings > Web Apps**:

### ✓ Paso 1: Obtener Credenciales

- [ ] **NEXT_PUBLIC_FIREBASE_API_KEY**
  - Descripción: Clave de API de tu proyecto Firebase
  - Ejemplo: `AIzaSyD_Example_API_Key_1234567890`
  - Dónde: Firebase Console > Project Settings > Web App Config

- [ ] **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
  - Descripción: Dominio de autenticación de Firebase
  - Ejemplo: `prisma-esg-421467996684.firebaseapp.com`
  - Patrón: `{nombre-proyecto}-{project-id}.firebaseapp.com`
  - Dónde: Firebase Console > Project Settings > Web App Config

- [ ] **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
  - Descripción: ID del proyecto Firebase
  - Valor: `421467996684` (ya preconfigurado)
  - Confirmación: Debe coincidir en Firebase Console

- [ ] **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
  - Descripción: Bucket de almacenamiento de Firebase
  - Ejemplo: `prisma-esg-421467996684.appspot.com`
  - Patrón: `{proyecto-id}.appspot.com`
  - Dónde: Firebase Console > Project Settings > Web App Config

- [ ] **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
  - Descripción: ID del remitente para FCM (Firebase Cloud Messaging)
  - Ejemplo: `421467996684`
  - Nota: Es generalmente el mismo que el proyecto ID
  - Dónde: Firebase Console > Project Settings > Web App Config

- [ ] **NEXT_PUBLIC_FIREBASE_APP_ID**
  - Descripción: ID único de la aplicación web en Firebase
  - Ejemplo: `1:421467996684:web:abcdef1234567890abcdef`
  - Formato: `{numeric-id}:{project-id}:web:{web-app-id}`
  - Dónde: Firebase Console > Project Settings > Web App Config

### ✓ Paso 2: Backend API URL

- [ ] **NEXT_PUBLIC_API_URL**
  - Descripción: URL base del backend API
  - Desarrollo: `http://localhost:8080/api/v1`
  - Producción: `https://api.tu-dominio.com/api/v1`
  - Responsable: Tu equipo de backend

## Instrucciones para Obtener Credenciales

### 1. Accede a Firebase Console
```
https://console.firebase.google.com/
```

### 2. Selecciona el Proyecto
- Busca "421467996684"
- O busca "Prisma ESG" en la lista de proyectos

### 3. Ve a Project Settings
- Haz clic en el ícono ⚙️ (engranaje) en la esquina superior izquierda
- Selecciona "Project Settings"

### 4. Abre la Pestaña "General"
- Desplázate hacia abajo hasta "Your apps"
- Si hay una app web, haz clic en ella
- Si no hay, haz clic en "Create a new web app"

### 5. Copia la Configuración
Verás un código como este. Copia cada valor:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",                    // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",   // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "421467996684",               // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",    // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "421467996684",       // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:421467996684:web:..."          // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## Actualizar Archivo .env.local

Abre `/home/user/forestblock-web-app/apps/prisma-esg-frontend/.env.local` y rellena:

```env
# Firebase Configuration - Obtén estos valores de Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=421467996684
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=421467996684
NEXT_PUBLIC_FIREBASE_APP_ID=1:421467996684:web:...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Validación de Configuración

Una vez completado, verifica que todo está correcto:

### Verificación Rápida
```bash
# Desde /home/user/forestblock-web-app/apps/prisma-esg-frontend/
cat .env.local
```

Deberías ver algo como:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=421467996684
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=421467996684
NEXT_PUBLIC_FIREBASE_APP_ID=1:421467996684:web:...
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Verificación en Navegador
1. Inicia el desarrollo: `npm run dev`
2. Abre http://localhost:3000
3. Abre DevTools (F12)
4. Ve a la consola
5. Si no ves errores de Firebase, ¡está configurado! ✓

## Variables de Entorno Opcionales

Para desarrollo local con Firebase Emulator:

```env
# Firebase Auth Emulator (opcional - solo para desarrollo)
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

Para activar, necesitas:
```bash
npm install -g firebase-tools
firebase emulators:start
```

## Seguridad

- ⚠️ **IMPORTANTE**: Aunque el prefijo `NEXT_PUBLIC_` hace estas variables públicas, esto es seguro porque son credenciales públicas de Firebase
- ✓ Nunca compartas la **Clave Privada** de tu proyecto Firebase
- ✓ Los tokens de sesión se manejan de forma segura en el backend
- ✓ Configura **Firebase Security Rules** apropiadamente

## Troubleshooting

### "Cannot find module 'firebase'"
```bash
npm install firebase@^10.11.0
```

### Variables no se cargan
- Verifica que `.env.local` no está en `.gitignore` (está bien que lo esté)
- Reinicia el servidor: `npm run dev`
- Los cambios en `.env.local` requieren reinicio del servidor Next.js

### Error "missing configuration"
- Copia correctamente TODOS los valores de Firebase Console
- No incluyas comillas o espacios extra
- El Project ID debe ser exactamente: `421467996684`

## Contacto y Soporte

Si tienes problemas:
1. Revisa [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Revisa [FIREBASE_INTEGRATION_GUIDE.md](./FIREBASE_INTEGRATION_GUIDE.md)
3. Consola del navegador (F12) para errores específicos
4. Firebase Console para verificar la configuración del proyecto

---

**Fecha de creación**: 2026-06-24
**Última actualización**: 2026-06-24
**Estado**: Listo para configuración

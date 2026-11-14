# PhotoAuthApp

**Estudiante:** Luis Carlos Contreras Aroche

Aplicación móvil de autenticación y gestión de fotografías construida con **React Native**, **Expo** y **TypeScript**. Un usuario inicia sesión con correo y contraseña mediante **Supabase**; solo con una sesión válida puede elegir una imagen de la galería o capturarla con la cámara, cambiarla o quitarla de la vista previa.

## Funcionamiento

1. Al abrir la app se restaura la sesión almacenada en el dispositivo (AsyncStorage). Si no hay sesión, se muestra el inicio de sesión.
2. El usuario inicia sesión (o crea una cuenta) con correo electrónico y contraseña.
3. En la pantalla principal puede:
   - seleccionar una fotografía desde la galería (`expo-image-picker`);
   - capturar una fotografía con la cámara, previa solicitud y verificación de permisos;
   - reemplazar la fotografía actual;
   - eliminar la fotografía de la vista previa;
   - cerrar sesión.
4. Al cerrar y volver a abrir la aplicación, la sesión persistida permite entrar de nuevo a la pantalla principal sin repetir el login.

## Requisitos

- Node.js 20 o superior
- npm
- Cuenta y proyecto en [Supabase](https://supabase.com)
- Expo Go en un teléfono Android o iOS (recomendado para cámara)

## Configuración de Supabase

1. Crea un proyecto en el panel de Supabase.
2. En **Authentication → Providers** deja habilitado **Email**.
3. En **Authentication → Providers → Email** puedes desactivar *Confirm email* mientras pruebas, para entrar de inmediato después de registrarte.
4. Copia la **Project URL** y la clave **anon public** desde **Project Settings → API**.
5. Duplica el archivo de ejemplo y completa las variables:

```bash
copy .env.example .env
```

Contenido esperado de `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## Instalación y ejecución

```bash
npm install
npx expo start
```

Luego:

- escanea el código QR con **Expo Go**, o
- presiona `a` para Android, `i` para iOS (requiere macOS) o `w` para web.

La cámara nativa se prueba en un dispositivo físico. En web la galería funciona como selector de archivos.

## Estructura del código

```
App.tsx
src/
  context/AuthContext.tsx   # sesión, persistencia y protección de rutas
  screens/LoginScreen.tsx   # correo y contraseña
  screens/HomeScreen.tsx    # galería, cámara y vista previa
  services/supabase.ts      # cliente de Supabase
  services/auth.ts          # inicio, registro y cierre de sesión
  services/photo.ts         # permisos, galería y cámara
  components/               # botones y vista previa
```

## Dependencias principales

- `expo` / `react` / `react-native` / `typescript`
- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage` (persistencia de sesión)
- `expo-image-picker` (galería y cámara)
- `react-native-url-polyfill`
- `react-native-safe-area-context`

## Evidencias

Las capturas de pantalla de inicio de sesión, pantalla principal, galería y cámara están en `docs/screenshots/` y también en el documento PDF de entrega.

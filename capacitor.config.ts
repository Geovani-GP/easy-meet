import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'EasyMeet',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true, // Permitir conexiones HTTP
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Duración del Splash Screen en ms
      backgroundColor: '#7b66ff', // Color de fondo personalizado
      splashFullScreen: true, // Usar pantalla completa
      splashImmersive: true, // Pantalla inmersiva
      androidScaleType: 'CENTER_CROP', // Ajuste para imágenes splash en Android
      showSpinner: true, // Mostrar spinner en el splash
      spinnerStyle: 'large', // Estilo del spinner
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'], // Notificaciones visibles mientras la app está en uso
    },
  },
};

export default config;

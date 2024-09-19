import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'EasyMeet',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#7b66ff',
      splashFullScreen: true,
      splashImmersive: true,
      // Añadir las rutas de las imágenes
      splashImage: 'resources/splash.png', // Cambia esto por la ruta de tu imagen de splash
      splashImageDark: 'resources/splash_dark.png', // Opcional para modo oscuro
    },
  },
};

export default config;

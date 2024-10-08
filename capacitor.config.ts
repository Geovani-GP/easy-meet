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
      launchShowDuration: 3000,
      backgroundColor: '#7b66ff',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;

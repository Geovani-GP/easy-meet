import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  /* appId: 'easymeet.nni.ai', */
  appId: 'com.nni.easy_meet',
  appName: 'EasyMeet',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#7b66ff',
      splashFullScreen: true,
      splashImmersive: true,
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerStyle: 'large',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'], 
    },
    AppleSignIn: {
      clientId: 'easymeet.nni.ai',
      redirectURI: 'easymeet://callback', 
      scopes: ['name', 'email'],
    },
  },
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.MarcoOjeda.app',
  appName: 'marco_ojeda',
  webDir: 'www',
  bundledWebRuntime: false,
  server:{
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;

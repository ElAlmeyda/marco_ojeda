import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marcoojeda.app',
  appName: 'marco_ojeda',
  webDir: 'www',
  server: {
    androidScheme: 'https',  // Para habilitar HTTPS en Android
    cleartext: true          // Solo para desarrollo
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;

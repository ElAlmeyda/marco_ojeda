import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.policlinicamarcoojeda.app',
  appName: 'Policlinica Dental Marco Ojeda',
  webDir: 'www',
  server: {
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

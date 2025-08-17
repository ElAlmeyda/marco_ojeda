import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iTattoo.app',
  appName: 'iTattoo Cliente',
  webDir: 'www',
  server: {
    androidScheme: 'https',  
    cleartext: true          
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "transparent",
    },
  },
};

export default config;

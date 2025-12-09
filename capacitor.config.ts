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
    Deeplinks: {
      routes: [
        {
          scheme: "https",
          host: "itattoo-9f978.web.app",          // <-- cambia aquí si usas otro dominio
          path: "/tatuador/:id",
          iosPath: "/tatuador/:id",
          androidPath: "/tatuador/:id"
        }
      ]
    }
  },
};

export default config;

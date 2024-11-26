self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    self.skipWaiting();
  });
  
  // Evento 'activate' para el Service Worker
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
  });
  
  // Evento para manejar las notificaciones push
  self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title || '¡Notificación Push!';
    const options = {
      body: data.body || 'Tienes una nueva notificación.',
      icon: data.icon || '/images/icon.png', // Cambia esto si tienes otro icono
      badge: '/images/badge.png', // Cambia esto si tienes otro badge
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  // Manejo de la acción al hacer clic en la notificación
  self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;
    console.log('Notificación clickeada', notification);
  
    // Cierra la notificación
    notification.close();
  
    // Puedes redirigir al usuario a una página específica
    event.waitUntil(
      clients.openWindow('/perfil')  // Redirigir a "/perfil" o a la página que desees
    );
  });


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registrado con éxito: ', registration);
      })
      .catch(function(error) {
        console.log('Error al registrar el Service Worker: ', error);
      });
  }
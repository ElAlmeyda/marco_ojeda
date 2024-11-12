import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';

admin.initializeApp();
const firestore = admin.firestore();

export const nuevaCita = functions.firestore.onDocumentUpdated(
    '/Usuarios/{userId}/Cita/{citaId}',
    async (event: FirestoreEvent) => {
      const userId = event.params.userId;
      const cita = event.data?.after.data(); // Datos después de la actualización
  
      const dataFcm = {
        enlace: '/perfil'
      };
  
      const path = `/Usuarios/${userId}`;
      const docInfo = await firestore.doc(path).get();
      const dataUser = docInfo.data() as any;
      const token = dataUser?.token;
  
      if (!token) {
        console.error("Token no encontrado para el usuario:", userId);
        return null;
      }
  
      const notification: INotification = {
        data: dataFcm,
        tokens: [token],
        notification: {
          title: 'Consulta el estado de tu cita ahora',
          body: `Su cita del día ${cita.dia} ha sido ${cita.estado}`
        },
      };
      return sendNotification(notification);
    }
  );

// Notificación para cambio de hora de la cita
export const retrasoAdelanto = functions.firestore.onDocumentUpdated(
    '/Usuarios/{userId}/Cita/{citaId}',
    async (event: FirestoreEvent) => {
      const userId = event.params.userId;
      const citaBefore = event.data?.before.data(); // Datos antes de la actualización
      const citaAfter = event.data?.after.data();  // Datos después de la actualización
  
      if (citaBefore.hora !== citaAfter.hora) {
        const dataFcm = {
          enlace: '/perfil'
        };
  
        const path = `/Usuarios/${userId}`;
        const docInfo = await firestore.doc(path).get();
        const dataUser = docInfo.data() as any;
        const token = dataUser?.token;
  
        if (!token) {
          console.error("Token no encontrado para el usuario:", userId);
          return null;
        }
  
        const notification: INotification = {
          data: dataFcm,
          tokens: [token],
          notification: {
            title: '¡Importante!',
            body: `Su cita para el día ${citaAfter.dia} ha sido modificada. La nueva hora es ${citaAfter.hora}.`
          },
        };
        return sendNotification(notification);
      } else {
        return null;
      }
    }
  );
  
// Notificación al actualizar un carrito de compras

export const entregProducto = functions.firestore.onDocumentUpdated(
    '/Usuarios/{userId}/Carrito/{carritoId}',
    async (event: FirestoreEvent) => {
      const userId = event.params.userId;
      const pedido = event.data?.after.data(); // Accedemos a los datos después de la actualización
  
      const dataFcm = {
        enlace: '/folder'
      };
  
      const path = `/Usuarios/${userId}`;
      const docInfo = await firestore.doc(path).get();
      const dataUser = docInfo.data() as any;
      const token = dataUser?.token;
  
      if (!token) {
        console.error("Token no encontrado para el usuario:", userId);
        return null;
      }
  
      const notification: INotification = {
        data: dataFcm,
        tokens: [token],
        notification: {
          title: 'Su pedido ha llegado a la tienda',
          body: `Su pedido lo puede recoger en la clínica.`,
        },
      };
      return sendNotification(notification);
    }
  );

    const sendNotification = (notification: INotification) => {
        const message: admin.messaging.MulticastMessage = {
          data: notification.data,
          tokens: notification.tokens,
          notification: notification.notification,
          android: {
            notification: {
              icon: 'ic_stat_name',
              color: '#EB9234'
            }
          },
          apns: {
            payload: {
              aps: {
                sound: {
                  critical: true,
                  name: 'default',
                  volume: 1.0,
                }
              }
            }
          }
        };
      
        return admin.messaging().sendMulticast(message)
          .then((response) => {
            if (response.failureCount > 0) {
              const failedTokens: any[] = [];
              response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  failedTokens.push(notification.tokens[idx]);
                }
              });
              console.error('Failed tokens:', failedTokens);
            }
            console.log('Notificación enviada con éxito.');
            return true;
          })
          .catch((error) => {
            console.error('Error al enviar la notificación:', error);
            return false;
          });
      };

interface INotification {
    data: any;
    tokens: string[];
    notification: admin.messaging.Notification;
}
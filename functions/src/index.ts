import * as admin from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

admin.initializeApp();

const firestore = admin.firestore();


// Función para enviar notificaciones push
const sendNotificacionPush = async (
  tokens: string[],
  message: { title: string; content: string },
  data: any = {},
  tag: string = ''
) => {
  const messaging = admin.messaging();
  const multicast = {
    tokens,
    data,
    notification: {
      title: message.title,
      body: message.content,
    },
    android: {},
    apns: {},
  };

  try {
    await messaging.sendEachForMulticast(multicast);
    console.log('Notificación enviada exitosamente');
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
};

// Función para detectar cambios en las citas
export const notificarCambioCita = onDocumentWritten(
  'Usuarios/{usuarioId}/Cita/{citaId}',
  async (event: any) => {
    const afterData = event.data?.after.data(); 
    const beforeData = event.data?.before.data();
    const usuarioId = afterData?.usuarioId || event.params?.usuarioId;

    if (!afterData) {
      console.error('Datos inválidos en el evento');
      return;
    }
    if(beforeData.estado === "pendiente"){
      if (afterData.estado) {
        const usuarioDoc = await firestore.collection('Usuarios').doc(usuarioId).get();
  
  
        if (!usuarioDoc.exists) {
          console.error(`Usuario ${usuarioId} no encontrado.`);
          return;
        }
  
        const tokens = usuarioDoc.data()?.token || []; // Obtener los tokens de notificación
  
        if (tokens.length === 0) {
          console.log(`No hay tokens registrados para el usuario ${usuarioId}.`);
          return;
        }
  
        let formattedDate = '';
        if (afterData.dia) {
          const date = new Date(afterData.dia);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          formattedDate = `${day}/${month}/${year}`;
        }
  
        let message = {
          title: '',
          content: '',
        };
  
        switch (afterData.estado) {
          case 'aceptado':
            message.title = 'Cita Aceptada';
            message.content = `Tu cita del dia ` + formattedDate + ` a las ` +  afterData.hora + `H ha sido aceptada.`;
            break;
          case 'anulada':
            message.title = 'Cita Anulada';
            message.content = `Tu cita del dia ` + formattedDate + ` a las ` +  afterData.hora + `H ha sido anulada.`;
            break;
          case 'editada':
            message.title = 'Cita Reprogramada';
            message.content = `Tu cita ha sido reprogramada para el día ` + formattedDate + ` a las ` + afterData.hora + `H`;
            break;
          default:
            console.log('Estado desconocido, no se enviará notificación');
            return; // Si el estado es desconocido, no se envía notificación
        }
  
        // Enviar la notificación
        const data = { enlace: `/perfil` + usuarioId };
        await sendNotificacionPush(tokens, message, data);
      } else {
        console.log('El estado de la cita no ha sido actualizado correctamente.');
      }
    }
  }
);

// Función para notificar retraso o adelanto en la hora de la cita
export const notificarRetrasoAdelantoCita = onDocumentWritten(
  'Usuarios/{usuarioId}/Cita/{citaId}',
  async (event: any) => {
    const beforeData = event.data?.before.data(); 
    const afterData = event.data?.after.data(); 
    const usuarioId = afterData?.usuarioId || event.params?.usuarioId;


    // Si no hay datos antes o después, no procesamos el evento
    if (!beforeData || !afterData) {
      console.error('Datos inválidos en el evento (beforeData o afterData no encontrados)');
      return;
    }


    // Comprobar si la cita estaba "aceptada" antes del cambio
    if (beforeData.estado === 'aceptado') {
      const usuarioDoc = await firestore.collection('Usuarios').doc(usuarioId).get();
        if (!usuarioDoc.exists) {
          console.error(`Usuario ${usuarioId} no encontrado.`);
          return;
        }
        const tokens = usuarioDoc.data()?.token || [];
        if (tokens.length === 0) {
          console.log(`No hay tokens registrados para el usuario ${usuarioId}.`);
          return;
        }

        let message = {
          title: '',
          content: '',
        };

        if (afterData.hora !== beforeData.hora) {
          // Función para convertir "HH:mm" a un objeto Date
          const stringToTime = (timeString: string): Date => {
            const [hours, minutes] = timeString.split(':').map(Number);
            const date = new Date(); // Usamos la fecha actual como base
            date.setHours(hours, minutes, 0, 0); // Ajustamos solo la hora y los minutos
            return date;
          };
    
          const oldTime = stringToTime(beforeData.hora);
          const newTime = stringToTime(afterData.hora);
    
          // Calcular la diferencia en minutos
          const differenceInMinutes = (newTime.getTime() - oldTime.getTime()) / (1000 * 60);
    
          // Generar texto amigable
          const differenceText =
            differenceInMinutes > 0
              ? `Tu cita ha sufrido un retraso de ${differenceInMinutes} minutos.`
              : `Tu cita ha sido adelantada ${Math.abs(differenceInMinutes)} minutos.`;

          message = {
            title: 'Cambio de Hora en tu Cita',
            content: `${differenceText} La nueva hora es ${afterData.hora}.`,
         };
        }
        const data = { enlace: `/perfil` + usuarioId }; // Puedes personalizar el enlace
        await sendNotificacionPush(tokens, message, data);
    }
  }
);

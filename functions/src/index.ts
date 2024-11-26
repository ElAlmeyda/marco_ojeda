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

let message = {
  title: '',
  content: '',
};

// Función para detectar cambios en las citas
export const notificarCambioCita = onDocumentWritten(
  'Usuarios/{usuarioId}/Cita/{citaId}',
  async (event: any) => {
    const beforeData = event.data?.before.data(); // Estado antes de la actualización
    const afterData = event.data?.after.data(); // Estado después de la actualización
    const usuarioId = afterData.usuarioId || event.params?.usuarioId;

    if (!beforeData || !afterData) {
      console.error('Datos inválidos en el evento');
      return;
    }

    const citaId = event.params.citaId;

    // Verificar si el estado o la hora han cambiado
    if (beforeData.estado !== afterData.estado) {
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

      // Crear mensaje basado en el nuevo estado
      switch (afterData.estado) {
        case 'aceptado':
          message.title = 'Cita Aceptada';
          message.content = `Tu cita ha sido aceptada.`;
          break;
        case 'anulada':
          message.title = 'Cita Anulada';
          message.content = `Tu cita ha sido anulada.`;
          break;
        case 'editada':
          message.title = 'Cita Reprogramada';
          message.content = `Tu cita ha sido reprogramada para el ${new Date(
            afterData.hora
          ).toLocaleString()}.`;
          break;
      }

      // Enviar notificación
      const data = { enlace: `/perfil` }; // Puedes personalizar el enlace
      await sendNotificacionPush(tokens, message, data);
      console.log(`Notificación enviada a usuario ${usuarioId} para la cita ${citaId}.`);
    }
  }
);

// Función para notificar retraso o adelanto en la hora de la cita
export const notificarRetrasoAdelantoCita = onDocumentWritten(
  'Usuarios/{usuarioId}/Cita/{citaId}',
  async (event: any) => {
    const beforeData = event.data?.before.data(); // Estado antes de la actualización
    const afterData = event.data?.after.data(); // Estado después de la actualización

    if (!beforeData || !afterData) {
      console.error('Datos inválidos en el evento');
      return;
    }

    const citaId = event.params.citaId;

    // Verificar si la cita está aceptada y si la hora ha cambiado
    if (afterData.estado === 'aceptada' && beforeData.hora !== afterData.hora) {
      const beforeHora = new Date(beforeData.hora);
      const afterHora = new Date(afterData.hora);

      // Comparar si la cita se adelantó o se retrasó
      let timeDifference = afterHora.getTime() - beforeHora.getTime();
      let timeString = '';

      if (timeDifference > 0) {
        // La cita fue retrasada
        timeString = `Tu cita ha sido retrasada. Nueva hora: ${afterHora.toLocaleString()}.`;
      } else if (timeDifference < 0) {
        // La cita fue adelantada
        timeString = `Tu cita ha sido adelantada. Nueva hora: ${afterHora.toLocaleString()}.`;
      }

      if (timeString) {
        // Enviar notificación de cambio de hora
        const usuarioId = afterData.usuarioId; // ID del usuario asociado a la cita
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

        // Enviar la notificación de cambio de hora
        const horaChangeMessage = {
          title: 'Cambio en la hora de tu cita',
          content: timeString,
        };

        const data = { enlace: `/perfil` }; // Puedes personalizar el enlace
        await sendNotificacionPush(tokens, horaChangeMessage, data);
        console.log(`Notificación de cambio de hora enviada a usuario ${usuarioId} para la cita ${citaId}.`);
      }
    }
  }
);

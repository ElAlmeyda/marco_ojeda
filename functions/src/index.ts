import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { logger } from "firebase-functions";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as crypto from "crypto";
import { onRequest } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";


// Inicializa Firebase Admin
initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Función reutilizable para enviar notificaciones push
const sendNotificacionPush = async (
  tokens: string[],
  message: { title: string; content: string },
  data: any = {}
) => {
  if (tokens.length === 0) return;

  const multicast = {
    tokens,
    notification: {
      title: message.title,
      body: message.content,
    },
    data,
  };

  try {
    await messaging.sendEachForMulticast(multicast);
    logger.info("Notificación enviada con éxito");
  } catch (error) {
    logger.error("Error al enviar la notificación:", error);
  }
};

export const notificarCambioCita = onDocumentUpdated(
  "/Usuarios/{userId}/citas/{citaId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    // Validar que existan datos
    if (!before || !after) return;

    // Solo si el estado cambió
    if (before.estado !== after.estado) {
      const estadoNuevo = after.estado;
      const uidCliente = after.uidCliente;

      // Obtener tokens del cliente
      const userDoc = await db.collection("Usuarios").doc(uidCliente).get();
      if (!userDoc.exists) return;
      const tokens: string[] = userDoc.data()?.token || [];

      // Obtener detalles de la cita para la notificación
      const nombreTatuador = after.nombreTatuador || "tu tatuador";
      let fechaCita = after.dia;
      let horaCita = after.hora;
      let fechaFormateada = fechaCita;

      // Si la fecha viene como Timestamp de Firestore, convertir a string
      if (fechaCita?.toDate) {
        // Si es un Timestamp de Firestore
        fechaFormateada = fechaCita.toDate();
      } else {
        // Si es un string "2025-08-25", convertir a Date
        fechaFormateada = new Date(fechaCita);
      }
      const dia = fechaFormateada.getDate().toString().padStart(2, '0');
      const mes = (fechaFormateada.getMonth() + 1).toString().padStart(2, '0');
      const año = fechaFormateada.getFullYear();

      const fechaParaNotificacion = `${dia}-${mes}-${año}`;
      // Construir mensaje dinámico
      let mensaje = { title: "", content: "" };

      if (estadoNuevo === "Aceptado") {
        mensaje = {
          title: "Cita aceptada ✅",
          content: `Tu cita con ${nombreTatuador} ha sido aceptada para el ${fechaParaNotificacion} a las ${horaCita}.`
        };
      } else if (estadoNuevo === "rechazada") {
        mensaje = {
          title: "Cita rechazada ❌",
          content: `Tu cita con ${nombreTatuador} el ${fechaParaNotificacion} a las ${horaCita} ha sido rechazada.`
        };
      } else if (estadoNuevo === "Editada") {
        mensaje = {
          title: "Cita editada ✏️",
          content: `Tu cita con ${nombreTatuador} ha sido modificada. Nueva fecha: ${fechaCita} a las ${horaCita}.`
        };
      } else {
        mensaje = {
          title: "Actualización de cita",
          content: `Tu cita con ${nombreTatuador} ha cambiado de estado.`
        };
      }

      // Obtener ID del documento seguro
      const citaId = event.data?.after?.id || "";

      // Enviar notificación push
      await sendNotificacionPush(tokens, mensaje, { citaId });
    }
  }
);


export const notificarCitaEliminada = onDocumentDeleted(
  "/Usuarios/{userId}/citas/{citaId}",
  async (event) => {
    console.log("📌 Evento de eliminación recibido:", event.params);

    const data = event.data?.data();
    console.log("📄 Datos del documento eliminado:", data);

    if (!data) {
      console.log("⚠ No hay datos en el documento eliminado");
      return;
    }

    const uidCliente = data.uidCliente;
    const nombreTatuador = data.nombreTatuador || "tu tatuador";
    let fechaCita = data.dia;
    const horaCita = data.hora;

    console.log("👤 UID Cliente:", uidCliente);
    console.log("🧑‍🎨 Tatuador:", nombreTatuador);
    console.log("⏰ Hora:", horaCita);
    console.log("📅 Fecha raw:", fechaCita);

    // Formatear fecha si es timestamp
    let fechaParaNotificacion = "";
    if (fechaCita?.toDate) {
      const fecha = fechaCita.toDate();
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getFullYear();
      fechaParaNotificacion = `${dia}-${mes}-${año}`;
    } else {
      console.log("⚠ La fecha no es un Timestamp válido:", fechaCita);
      fechaParaNotificacion = "fecha desconocida";
    }

    // Buscar usuario
    const userDoc = await db.collection("Usuarios").doc(uidCliente).get();
    if (!userDoc.exists) {
      console.log("⚠ Usuario no encontrado en la colección Usuarios:", uidCliente);
      return;
    }

    const tokens: string[] = userDoc.data()?.token || [];
    console.log("📲 Tokens obtenidos:", tokens);

    if (!tokens.length) {
      console.log("⚠ El usuario no tiene tokens registrados, no se envía notificación");
      return;
    }

    const mensaje = {
      title: "Cita eliminada ❌",
      content: `Tu cita con ${nombreTatuador} para el ${fechaParaNotificacion} a las ${horaCita} ha sido eliminada.`
    };

    console.log("📤 Enviando notificación con mensaje:", mensaje);

    try {
      await sendNotificacionPush(tokens, mensaje, { citaId: event.data?.id });
      console.log("✅ Notificación enviada correctamente");
    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
    }
  }
);

export const notificarCitaAceptada = onDocumentCreated(
  "/Usuarios/{userId}/citas/{citaId}",
  async (event) => {
    console.log("📌 Evento de creación recibido:", event.params);

    const data = event.data?.data();
    console.log("📄 Datos del nuevo documento:", data);

    if (!data) {
      console.log("⚠ No hay datos en el documento creado");
      return;
    }

    const estado = data.estado;
    if (estado !== "Aceptado") {
      console.log(`ℹ Estado actual: ${estado}. No se enviará notificación.`);
      return;
    }

    const uidCliente = data.uidCliente;
    const nombreTatuador = data.nombreTatuador || "tu tatuador";
    let fechaCita = data.dia;
    const horaCita = data.hora;

    console.log("👤 UID Cliente:", uidCliente);
    console.log("🧑‍🎨 Tatuador:", nombreTatuador);
    console.log("⏰ Hora:", horaCita);
    console.log("📅 Fecha raw:", fechaCita);

    // Formatear fecha si es timestamp
    let fechaParaNotificacion = "";
    if (fechaCita?.toDate) {
      const fecha = fechaCita.toDate();
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getFullYear();
      fechaParaNotificacion = `${dia}-${mes}-${año}`;
    } else {
      console.log("⚠ La fecha no es un Timestamp válido:", fechaCita);
      fechaParaNotificacion = "fecha desconocida";
    }

    // Buscar usuario
    const userDoc = await db.collection("Usuarios").doc(uidCliente).get();
    if (!userDoc.exists) {
      console.log("⚠ Usuario no encontrado en la colección Usuarios:", uidCliente);
      return;
    }

    const tokens: string[] = userDoc.data()?.token || [];
    console.log("📲 Tokens obtenidos:", tokens);

    if (!tokens.length) {
      console.log("⚠ El usuario no tiene tokens registrados, no se envía notificación");
      return;
    }

    const mensaje = {
      title: "¡Consulta aceptada! 🎉",
      content: `Tu consulta previa con ${nombreTatuador} para el ${fechaParaNotificacion} a las ${horaCita} ha sido aceptada.`
    };

    console.log("📤 Enviando notificación con mensaje:", mensaje);

    try {
      await sendNotificacionPush(tokens, mensaje, { citaId: event.data?.id });
      console.log("✅ Notificación enviada correctamente");
    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
    }
  }
);



export const registrarUsuario = onRequest(async (req, res) => {
  try {
    // Solo aceptamos POST
    if (req.method !== "POST") {
      res.status(405).send({ ok: false, message: "Método no permitido" });
      return;
    }

    const body: { email?: string } = req.body;

    if (!body.email) {
      res.status(400).send({ ok: false, message: "Faltan campos obligatorios" });
      return;
    }

    const auth = getAuth();

    // Verificar si el usuario ya existe en Firebase Auth
    let existingUser = null;
    try {
      existingUser = await auth.getUserByEmail(body.email);
    } catch (e: any) {
      if (e.code !== "auth/user-not-found") {
        throw e;
      }
    }

    if (existingUser) {
      // Usuario ya registrado
      res.status(200).send({
        ok: true,
        registrado: false,
        message: "Usuario ya existe"
      });
      return;
    }

    // Generar contraseña aleatoria segura
    const password = crypto.randomBytes(8).toString("hex"); // 16 caracteres hex

    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email: body.email,
      password,
      displayName: body.email,
      emailVerified: false,
    });

    // Crear usuario en Firestore
    const userRef = db.collection("Usuarios").doc(userRecord.uid);
    await userRef.set({
      email: body.email,
      nombre: body.email,
      token: [],
      creadoEn: new Date().toISOString(),
      aceptaCondiciones: true,
    });

    // Respondemos a n8n con datos del usuario creado
    res.status(200).send({
      ok: true,
      registrado: true,
      message: "Usuario registrado exitosamente",
      email: body.email,
      password, // Opcional: puedes enviarlo por correo desde n8n
    });

    // Generar link para que el usuario establezca contraseña
    const resetLink = await auth.generatePasswordResetLink(body.email);

    res.status(200).send({
      ok: true,
      registrado: true,
      message: "Usuario registrado exitosamente",
      email: body.email,
      resetLink
    });

  } catch (error: any) {
    console.error("❌ Error en registrarUsuario:", error);
    res.status(500).send({
      ok: false,
      registrado: false,
      message: "Error interno",
      error: error.message || JSON.stringify(error)
    });
  }
});



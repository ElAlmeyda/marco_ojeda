"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();
const firestore = admin.firestore();
exports.nuevaCita = functions.firestore
    .document('/Usuarios/{userId}/Cita/{citaId}')
    .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const cita = change.after.data();
    const dataFcm = {
        enlace: '/perfil'
    };
    const path = `/Usuarios/${userId}`;
    const docInfo = await firestore.doc(path).get();
    const dataUser = docInfo.data();
    const token = dataUser.token;
    const registroToken = [token];
    const notification = {
        data: dataFcm,
        tokens: registroToken,
        notification: {
            title: 'Consulta el estado de tu cita ahora',
            body: `Su cita del dia ${cita.dia} ha sido ${cita.estado}`
        },
    };
    return sendNotification(notification);
});
exports.retrasoAdelanto = functions.firestore
    .document('/Usuarios/{userId}/Cita/{citaId}')
    .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const citaBefore = change.before.data();
    const citaAfter = change.after.data();
    // Verificar si la hora de la cita ha sido modificada
    if (citaBefore.hora !== citaAfter.hora) {
        const dataFcm = {
            enlace: '/perfil'
        };
        const path = `/Usuarios/${userId}`;
        const docInfo = await firestore.doc(path).get();
        const dataUser = docInfo.data();
        const token = dataUser.token;
        const registroToken = [token];
        const notification = {
            data: dataFcm,
            tokens: registroToken,
            notification: {
                title: '¡Importante!',
                body: `Su cita para el día ${citaAfter.dia} ha sido modificada. La nueva hora es ${citaAfter.hora}.`
            },
        };
        return sendNotification(notification);
    }
    else {
        // La hora de la cita no ha sido modificada
        return null;
    }
});
exports.entregProducto = functions.firestore
    .document('/Usuarios/{userId}/Carrito/{carritoId}')
    .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const pedido = change.after.data();
    const dataFcm = {
        enlace: '/folder'
    };
    const path = `/Usuarios/${userId}`;
    const docInfo = await firestore.doc(path).get();
    const dataUser = docInfo.data();
    const token = dataUser.token;
    const registroToken = [token];
    const notification = {
        data: dataFcm,
        tokens: registroToken,
        notification: {
            title: 'Su pedido ha llegado a la tienda',
            body: `Su pedido lo puede recoger en la clinica` + pedido,
        },
    };
    return sendNotification(notification);
});
const sendNotification = (notification) => {
    return new Promise((resolve, reject) => {
        const message = {
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
                            volume: 1,
                        }
                    }
                }
            }
        };
        admin.messaging().sendMulticast(message).then((response) => {
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(notification.tokens[idx]);
                    }
                });
                console.error('Failed tokens:', failedTokens);
            }
            resolve(true);
        }).catch(error => {
            console.error('Error sending notification:', error);
            reject(error);
        });
    });
};
//# sourceMappingURL=index.js.map
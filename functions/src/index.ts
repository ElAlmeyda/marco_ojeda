import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions'

admin.initializeApp();
const firestore = admin.firestore();

exports.nuevaCita = functions.firestore
    .document('/Usuarios/{userId}/Cita/{citaId}')
    .onUpdate(async (change, context) => {
        
        const userId = context.params.userId;
        const cita = change.after.data();

        const dataFcm = {
            enlace: '/perfil'
        }

        const path = '/Usuarios' + userId;
        const docInfo = await firestore.doc(path).get();
        const dataUser = docInfo.data() as any;
        const token = dataUser.token;
        const registroToken = [token];

        const notification: INotification = {
            data: dataFcm,
            tokens: registroToken,
            notification: {
                title: 'Consulta el estado de tu cita ahora',
                body: 'Su cita del dia ' + cita.dia + ' ha sido ' + cita.estado
            },
        }
        return sendNotification(notification);
    });

    const sendNotification = (notification: INotification) => {
        return new Promise((resolve, reject) => {
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
                                volume: 1,
                            }
                        }
                    }
                }
            };
    
            admin.messaging().sendMulticast(message).then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens: any[] = [];
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
    
    interface INotification {
        data: any;
        tokens: string[];
        notification: admin.messaging.Notification;
    }
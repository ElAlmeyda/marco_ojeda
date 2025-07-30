import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const stripe = require('stripe')('sk_test_51QS06lKujQS3YPoUBkLtllPARE2HucnvgX9itK5T1Xg0Uotm6RM5z8LDJSg8d1x5VpxkhCBilUs8nWe2NMN18QKG00WWCyomTE');
const cors = require('cors')({ origin: '*' });

exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Validar el método de solicitud
      if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
      }

      // Validar y extraer los productos del cuerpo de la solicitud
      const { products, pedido_id } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).send('Los productos son requeridos y deben ser un arreglo no vacío');
      }

      // Validación de cada producto
      const line_items = products.map((product) => {
        if (!product.name || typeof product.price !== 'number' || typeof product.quantity !== 'number' || product.price <= 0 || product.quantity <= 0) {
          throw new Error('Cada producto debe tener nombre, precio y cantidad válidos');
        }

        return {
          price_data: {
            currency: 'eur',
            product_data: { name: product.name },
            unit_amount: product.price, // Stripe espera el precio en centavos
          },
          quantity: product.quantity,
        };
      });

      // Crear la sesión de pago con Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `https://servicio-4f831.web.app/redirect?status=success&orderId=${pedido_id}`,
        cancel_url: `https://servicio-4f831.web.app/redirect?status=cancel&orderId=${pedido_id}`,
      });

      // Responder con el ID de la sesión
      return res.status(200).json({ id: session.id, orderId: pedido_id });
    } catch (error) {
      console.error('Error al crear la sesión:', error);

      // Errores generales
      return res.status(500).send('Hubo un error al crear la sesión de pago');
    }
  });
});


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

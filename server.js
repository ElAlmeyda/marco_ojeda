const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51QS06lKujQS3YPoUBkLtllPARE2HucnvgX9itK5T1Xg0Uotm6RM5z8LDJSg8d1x5VpxkhCBilUs8nWe2NMN18QKG00WWCyomTE'); // Sustituye por tu clave secreta de Stripe

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:8100', 'https://servicio-4f831.web.app'], // Sustituye con los dominios permitidos
  }));
app.use(bodyParser.json()); // Para procesar solicitudes JSON

// Endpoint para crear una sesión de pago
app.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body; // Productos enviados desde la app móvil

    try {
        // Crear una sesión de pago en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Métodos de pago admitidos
            line_items: products.map(product => ({
                price_data: {
                    currency: 'usd', // Cambia según tu moneda
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100, // Stripe trabaja con cantidades en centavos
                },
                quantity: product.quantity,
            })),
            mode: 'payment', // Modo de pago
            success_url: 'https://servicio-4f831.web.app/success', // URL de éxito
            cancel_url: 'https://servicio-4f831.web.app/cancel', // URL de cancelación
        });

        // Enviar el ID de la sesión de pago de vuelta al cliente
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error al crear la sesión de pago:', error);
        res.status(500).send('Error al crear la sesión de pago');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

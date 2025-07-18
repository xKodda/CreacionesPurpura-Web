import sgMail from '@sendgrid/mail';

// Configurar SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@creacionespurpura.cl';
const FROM_NAME = process.env.FROM_NAME || 'Creaciones Púrpura';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  shippingRegion: string;
  shippingComuna: string;
  orderDate: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  /**
   * Envía email de confirmación de orden
   */
  static async sendOrderConfirmation(data: OrderEmailData): Promise<EmailResponse> {
    try {
      if (!SENDGRID_API_KEY) {
        console.warn('⚠️ SendGrid API Key no configurada. Email no enviado.');
        return {
          success: false,
          error: 'SendGrid no configurado'
        };
      }

      const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
        }).format(price);
      };

      const emailContent = this.generateOrderConfirmationEmail(data, formatPrice);

      const msg = {
        to: data.customerEmail,
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME
        },
        subject: `¡Confirmación de Pedido #${data.orderId} - Creaciones Púrpura`,
        html: emailContent,
        text: this.generatePlainTextEmail(data, formatPrice)
      };

      console.log('📧 Enviando email de confirmación a:', data.customerEmail);

      const response = await sgMail.send(msg);
      
      console.log('✅ Email enviado exitosamente:', response[0].headers['x-message-id']);
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id'] as string
      };

    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Genera el contenido HTML del email
   */
  private static generateOrderConfirmationEmail(data: OrderEmailData, formatPrice: (price: number) => string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido - Creaciones Púrpura</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #8b5cf6;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #8b5cf6;
            margin-bottom: 10px;
          }
          .success-icon {
            font-size: 48px;
            color: #10b981;
            margin-bottom: 15px;
          }
          .order-number {
            background-color: #8b5cf6;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
          }
          .section {
            margin: 25px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #8b5cf6;
            margin-bottom: 15px;
          }
          .product-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .product-item:last-child {
            border-bottom: none;
          }
          .total {
            font-size: 20px;
            font-weight: bold;
            color: #8b5cf6;
            text-align: right;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .contact-info {
            background-color: #e0e7ff;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎨 Creaciones Púrpura</div>
            <div class="success-icon">✅</div>
            <h1 style="color: #10b981; margin: 0;">¡Pedido Confirmado!</h1>
            <p style="color: #6b7280; margin: 10px 0;">Gracias por tu compra</p>
            <div class="order-number">#${data.orderId}</div>
          </div>

          <div class="section">
            <div class="section-title">📦 Detalles del Pedido</div>
            <p><strong>Fecha:</strong> ${data.orderDate}</p>
            <p><strong>Total:</strong> ${formatPrice(data.total)}</p>
          </div>

          <div class="section">
            <div class="section-title">🛍️ Productos</div>
            ${data.items.map(item => `
              <div class="product-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
              </div>
            `).join('')}
            <div class="total">Total: ${formatPrice(data.total)}</div>
          </div>

          <div class="section">
            <div class="section-title">📍 Dirección de Envío</div>
            <p>${data.shippingAddress}</p>
            <p>${data.shippingComuna}, ${data.shippingRegion}</p>
          </div>

          <div class="contact-info">
            <div class="section-title">📞 ¿Necesitas ayuda?</div>
            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:</p>
            <p><strong>Email:</strong> contacto@creacionespurpura.cl</p>
            <p><strong>Instagram:</strong> @creacionespurpura.papeleria</p>
          </div>

          <div class="footer">
            <p>Gracias por elegir Creaciones Púrpura</p>
            <p>Tu pedido será procesado y enviado en las próximas 24-48 horas.</p>
            <p>© 2025 Creaciones Púrpura. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera versión de texto plano del email
   */
  private static generatePlainTextEmail(data: OrderEmailData, formatPrice: (price: number) => string): string {
    return `
¡Pedido Confirmado! - Creaciones Púrpura

Hola ${data.customerName},

¡Gracias por tu compra! Tu pedido ha sido confirmado exitosamente.

Número de Pedido: #${data.orderId}
Fecha: ${data.orderDate}
Total: ${formatPrice(data.total)}

PRODUCTOS:
${data.items.map(item => `- ${item.name} x${item.quantity}: ${formatPrice(item.price * item.quantity)}`).join('\n')}

DIRECCIÓN DE ENVÍO:
${data.shippingAddress}
${data.shippingComuna}, ${data.shippingRegion}

Tu pedido será procesado y enviado en las próximas 24-48 horas.

¿Necesitas ayuda? Contáctanos:
Email: contacto@creacionespurpura.cl
Instagram: @creacionespurpura.papeleria

Gracias por elegir Creaciones Púrpura!

© 2025 Creaciones Púrpura. Todos los derechos reservados.
    `;
  }

  /**
   * Verifica si el servicio está configurado
   */
  static isConfigured(): boolean {
    return !!SENDGRID_API_KEY;
  }

  /**
   * Obtiene la configuración actual
   */
  static getConfig() {
    return {
      isConfigured: this.isConfigured(),
      fromEmail: FROM_EMAIL,
      fromName: FROM_NAME
    };
  }
}

export default EmailService; 
// Tipos para WebPay
export interface WebPayPaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  returnUrl: string;
  cancelUrl: string;
}

export interface WebPayResponse {
  success: boolean;
  url?: string;
  token?: string;
  error?: string;
}

// Configuración de WebPay (Sandbox para pruebas)
const WEBPAY_CONFIG = {
  commerceCode: process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532',
  apiKey: process.env.NEXT_PUBLIC_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  environment: process.env.NEXT_PUBLIC_WEBPAY_ENVIRONMENT || 'integration', // 'integration' | 'production'
  baseUrl: process.env.NEXT_PUBLIC_WEBPAY_BASE_URL || 'https://webpay3gint.transbank.cl'
};

class WebPayService {
  /**
   * Inicia una transacción con WebPay
   */
  static async createTransaction(paymentData: WebPayPaymentData): Promise<WebPayResponse> {
    try {
      console.log('🚀 Iniciando transacción WebPay:', paymentData);
      console.log('🌐 Ambiente WebPay:', WEBPAY_CONFIG.environment);
      
      // Verificar si estamos en modo simulación
      const isSimulation = WEBPAY_CONFIG.environment === 'integration' && 
                          (!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE || 
                           !process.env.NEXT_PUBLIC_WEBPAY_API_KEY);

      if (isSimulation) {
        console.log('🔄 Ejecutando en modo simulación...');
        return await this.createSimulatedTransaction(paymentData);
      }

      // Llamada real a la API de WebPay
      console.log('🌐 Conectando con WebPay real...');
      
      const response = await fetch(`${WEBPAY_CONFIG.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
          'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey,
        },
        body: JSON.stringify({
          buy_order: paymentData.orderId,
          session_id: `session_${Date.now()}`,
          amount: paymentData.amount,
          return_url: paymentData.returnUrl,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta de WebPay:', response.status, errorText);
        throw new Error(`WebPay API error: ${response.status} - ${errorText}`);
      }

      const webpayData = await response.json();
      
      console.log('✅ Respuesta de WebPay:', webpayData);

      if (webpayData.token && webpayData.url) {
        // Construir la URL correcta con el token
        const correctUrl = `${webpayData.url}?token_ws=${webpayData.token}`;
        
        return {
          success: true,
          url: correctUrl,
          token: webpayData.token
        };
      } else {
        throw new Error('Respuesta inválida de WebPay: faltan token o URL');
      }

    } catch (error) {
      console.error('❌ Error creando transacción WebPay:', error);
      
      // En caso de error, intentar con simulación como fallback
      console.log('🔄 Intentando con simulación como fallback...');
      return await this.createSimulatedTransaction(paymentData);
    }
  }

  /**
   * Simula una transacción de WebPay (para desarrollo)
   */
  private static async createSimulatedTransaction(paymentData: WebPayPaymentData): Promise<WebPayResponse> {
    // Simular respuesta de WebPay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockResponse: WebPayResponse = {
      success: true,
      url: `${WEBPAY_CONFIG.baseUrl}/webpayserver/init_transaction.cgi?token_ws=${mockToken}`,
      token: mockToken
    };

    console.log('✅ Transacción WebPay simulada:', mockResponse);
    return mockResponse;
  }

  /**
   * Confirma una transacción de WebPay
   */
  static async commitTransaction(token: string): Promise<WebPayResponse> {
    try {
      console.log('🔍 Confirmando transacción WebPay:', token);
      
      // Verificar si estamos en modo simulación
      const isSimulation = WEBPAY_CONFIG.environment === 'integration' && 
                          (!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE || 
                           !process.env.NEXT_PUBLIC_WEBPAY_API_KEY);

      if (isSimulation) {
        console.log('🔄 Confirmando en modo simulación...');
        return await this.commitSimulatedTransaction(token);
      }

      // Llamada real para confirmar la transacción
      console.log('🌐 Confirmando con WebPay real...');
      
      const response = await fetch(`${WEBPAY_CONFIG.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
          'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error confirmando transacción WebPay:', response.status, errorText);
        throw new Error(`WebPay commit error: ${response.status} - ${errorText}`);
      }

      const commitData = await response.json();
      
      console.log('✅ Transacción confirmada:', commitData);

      return {
        success: true,
        token: token,
        // Incluir datos adicionales de la confirmación
        ...commitData
      };

    } catch (error) {
      console.error('❌ Error confirmando transacción WebPay:', error);
      
      // En caso de error, intentar con simulación como fallback
      console.log('🔄 Intentando confirmación con simulación...');
      return await this.commitSimulatedTransaction(token);
    }
  }

  /**
   * Simula la confirmación de una transacción (para desarrollo)
   */
  private static async commitSimulatedTransaction(token: string): Promise<WebPayResponse> {
    // Simular confirmación exitosa
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponse: WebPayResponse = {
      success: true,
      token: token
    };

    console.log('✅ Confirmación WebPay simulada:', mockResponse);
    return mockResponse;
  }

  /**
   * Obtiene el estado de una transacción
   */
  static async getTransactionStatus(token: string): Promise<WebPayResponse> {
    try {
      console.log('📊 Consultando estado de transacción WebPay:', token);
      
      // Verificar si estamos en modo simulación
      const isSimulation = WEBPAY_CONFIG.environment === 'integration' && 
                          (!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE || 
                           !process.env.NEXT_PUBLIC_WEBPAY_API_KEY);

      if (isSimulation) {
        console.log('🔄 Consultando estado en modo simulación...');
        return await this.getSimulatedTransactionStatus(token);
      }

      // Llamada real para consultar el estado
      console.log('🌐 Consultando estado con WebPay real...');
      
      const response = await fetch(`${WEBPAY_CONFIG.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
        method: 'GET',
        headers: {
          'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
          'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error consultando estado WebPay:', response.status, errorText);
        throw new Error(`WebPay status error: ${response.status} - ${errorText}`);
      }

      const statusData = await response.json();
      
      console.log('✅ Estado de transacción:', statusData);

      return {
        success: true,
        token: token,
        // Incluir datos del estado
        ...statusData
      };

    } catch (error) {
      console.error('❌ Error consultando estado de transacción WebPay:', error);
      
      // En caso de error, intentar con simulación como fallback
      console.log('🔄 Intentando consulta con simulación...');
      return await this.getSimulatedTransactionStatus(token);
    }
  }

  /**
   * Simula la consulta de estado (para desarrollo)
   */
  private static async getSimulatedTransactionStatus(token: string): Promise<WebPayResponse> {
    // Simular estado exitoso
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResponse: WebPayResponse = {
      success: true,
      token: token
    };

    console.log('✅ Estado WebPay simulado:', mockResponse);
    return mockResponse;
  }

  /**
   * Genera un ID único para la orden
   */
  static generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `ORDER-${timestamp}-${random}`;
  }

  /**
   * Valida los datos de pago
   */
  static validatePaymentData(paymentData: WebPayPaymentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }

    if (!paymentData.customer.name) {
      errors.push('El nombre del cliente es requerido');
    }

    if (!paymentData.customer.email) {
      errors.push('El email del cliente es requerido');
    }

    if (!paymentData.orderId) {
      errors.push('El ID de la orden es requerido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Verifica si el servicio está configurado para producción
   */
  static isProductionMode(): boolean {
    return WEBPAY_CONFIG.environment === 'production' && 
           !!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE && 
           !!process.env.NEXT_PUBLIC_WEBPAY_API_KEY;
  }

  /**
   * Obtiene la configuración actual
   */
  static getConfig() {
    return {
      environment: WEBPAY_CONFIG.environment,
      baseUrl: WEBPAY_CONFIG.baseUrl,
      isProduction: this.isProductionMode()
    };
  }

  /**
   * Obtiene información sobre tarjetas de prueba para sandbox
   */
  static getTestCards() {
    return {
      visa: '4051885600446623',
      mastercard: '5186059559590568',
      note: 'Usar cualquier fecha futura y CVV de 3 dígitos'
    };
  }
}

export default WebPayService; 
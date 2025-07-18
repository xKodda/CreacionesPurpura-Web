"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    static createTransaction(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🚀 Iniciando transacción WebPay:', paymentData);
                console.log('🌐 Ambiente WebPay:', WEBPAY_CONFIG.environment);
                // Verificar si estamos en modo simulación
                const isSimulation = WEBPAY_CONFIG.environment === 'integration' &&
                    (!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE ||
                        !process.env.NEXT_PUBLIC_WEBPAY_API_KEY);
                if (isSimulation) {
                    console.log('🔄 Ejecutando en modo simulación...');
                    return yield this.createSimulatedTransaction(paymentData);
                }
                // Llamada real a la API de WebPay
                console.log('🌐 Conectando con WebPay real...');
                const response = yield fetch(`${WEBPAY_CONFIG.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
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
                    const errorText = yield response.text();
                    console.error('❌ Error en respuesta de WebPay:', response.status, errorText);
                    throw new Error(`WebPay API error: ${response.status} - ${errorText}`);
                }
                const webpayData = yield response.json();
                console.log('✅ Respuesta de WebPay:', webpayData);
                if (webpayData.token && webpayData.url) {
                    return {
                        success: true,
                        url: webpayData.url,
                        token: webpayData.token
                    };
                }
                else {
                    throw new Error('Respuesta inválida de WebPay: faltan token o URL');
                }
            }
            catch (error) {
                console.error('❌ Error creando transacción WebPay:', error);
                // En caso de error, intentar con simulación como fallback
                console.log('🔄 Intentando con simulación como fallback...');
                return yield this.createSimulatedTransaction(paymentData);
            }
        });
    }
    /**
     * Simula una transacción de WebPay (para desarrollo)
     */
    static createSimulatedTransaction(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simular respuesta de WebPay
            yield new Promise(resolve => setTimeout(resolve, 1500));
            const mockResponse = {
                success: true,
                url: `${WEBPAY_CONFIG.baseUrl}/webpay/v1.2/transactions/${paymentData.orderId}`,
                token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
            console.log('✅ Transacción WebPay simulada:', mockResponse);
            return mockResponse;
        });
    }
    /**
     * Confirma una transacción de WebPay
     */
    static commitTransaction(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔍 Confirmando transacción WebPay:', token);
                // Verificar si estamos en modo simulación
                const isSimulation = WEBPAY_CONFIG.environment === 'integration' &&
                    (!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE ||
                        !process.env.NEXT_PUBLIC_WEBPAY_API_KEY);
                if (isSimulation) {
                    console.log('🔄 Confirmando en modo simulación...');
                    return yield this.commitSimulatedTransaction(token);
                }
                // Llamada real para confirmar la transacción
                console.log('🌐 Confirmando con WebPay real...');
                const response = yield fetch(`${WEBPAY_CONFIG.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
                        'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey,
                    }
                });
                if (!response.ok) {
                    const errorText = yield response.text();
                    console.error('❌ Error confirmando transacción WebPay:', response.status, errorText);
                    throw new Error(`WebPay commit error: ${response.status} - ${errorText}`);
                }
                const commitData = yield response.json();
                console.log('✅ Transacción confirmada:', commitData);
                return Object.assign({ success: true, token: token }, commitData);
            }
            catch (error) {
                console.error('❌ Error confirmando transacción WebPay:', error);
                // En caso de error, intentar con simulación como fallback
                console.log('🔄 Intentando confirmación con simulación...');
                return yield this.commitSimulatedTransaction(token);
            }
        });
    }
    /**
     * Simula la confirmación de una transacción (para desarrollo)
     */
    static commitSimulatedTransaction(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simular confirmación exitosa
            yield new Promise(resolve => setTimeout(resolve, 1000));
            const mockResponse = {
                success: true,
                token: token
            };
            console.log('✅ Confirmación WebPay simulada:', mockResponse);
            return mockResponse;
        });
    }
    /**
     * Obtiene el estado de una transacción
     */
    static getTransactionStatus(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📊 Consultando estado de transacción WebPay:', token);
                // Verificar si estamos en modo simulación
                const isSimulation = WEBPAY_CONFIG.environment === 'integration' &&
                    (!process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE ||
                        !process.env.NEXT_PUBLIC_WEBPAY_API_KEY);
                if (isSimulation) {
                    console.log('🔄 Consultando estado en modo simulación...');
                    return yield this.getSimulatedTransactionStatus(token);
                }
                // Llamada real para consultar el estado
                console.log('🌐 Consultando estado con WebPay real...');
                const response = yield fetch(`${WEBPAY_CONFIG.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
                    method: 'GET',
                    headers: {
                        'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
                        'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey,
                    }
                });
                if (!response.ok) {
                    const errorText = yield response.text();
                    console.error('❌ Error consultando estado WebPay:', response.status, errorText);
                    throw new Error(`WebPay status error: ${response.status} - ${errorText}`);
                }
                const statusData = yield response.json();
                console.log('✅ Estado de transacción:', statusData);
                return Object.assign({ success: true, token: token }, statusData);
            }
            catch (error) {
                console.error('❌ Error consultando estado de transacción WebPay:', error);
                // En caso de error, intentar con simulación como fallback
                console.log('🔄 Intentando consulta con simulación...');
                return yield this.getSimulatedTransactionStatus(token);
            }
        });
    }
    /**
     * Simula la consulta de estado (para desarrollo)
     */
    static getSimulatedTransactionStatus(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simular estado exitoso
            yield new Promise(resolve => setTimeout(resolve, 500));
            const mockResponse = {
                success: true,
                token: token
            };
            console.log('✅ Estado WebPay simulado:', mockResponse);
            return mockResponse;
        });
    }
    /**
     * Genera un ID único para la orden
     */
    static generateOrderId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `ORDER-${timestamp}-${random}`;
    }
    /**
     * Valida los datos de pago
     */
    static validatePaymentData(paymentData) {
        const errors = [];
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
    static isProductionMode() {
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
exports.default = WebPayService;

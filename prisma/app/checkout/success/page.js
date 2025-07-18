"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CheckoutSuccessPage;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const webpay_1 = __importDefault(require("@/services/webpay"));
function CheckoutSuccessPage() {
    var _a;
    const searchParams = (0, navigation_1.useSearchParams)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [orderDetails, setOrderDetails] = (0, react_1.useState)(null);
    const [webpayDetails, setWebpayDetails] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const handleSuccess = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener parámetros de WebPay
                const token = searchParams.get('token_ws');
                const orderId = searchParams.get('buy_order');
                if (token && orderId) {
                    console.log('🔍 Confirmando transacción WebPay:', token);
                    // Confirmar la transacción con WebPay
                    const response = yield webpay_1.default.commitTransaction(token);
                    if (response.success) {
                        console.log('✅ Transacción confirmada exitosamente');
                        setWebpayDetails(response);
                        // Actualizar el estado de la orden en la base de datos
                        yield fetch(`/api/orders/${orderId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                status: 'paid',
                                webpayToken: token,
                                webpayStatus: 'AUTHORIZED',
                                webpayResponseCode: 0
                            })
                        });
                    }
                    else {
                        console.error('❌ Error confirmando transacción:', response.error);
                    }
                }
                // Obtener detalles de la orden desde la base de datos
                if (orderId) {
                    const orderResponse = yield fetch(`/api/orders/${orderId}`);
                    if (orderResponse.ok) {
                        const orderData = yield orderResponse.json();
                        setOrderDetails(orderData.order);
                    }
                }
            }
            catch (error) {
                console.error('❌ Error procesando éxito:', error);
            }
            finally {
                setIsLoading(false);
            }
        });
        handleSuccess();
    }, [searchParams]);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };
    if (isLoading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu pago...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          {/* Icono de éxito */}
          <div className="mb-8">
            <lucide_react_1.CheckCircle className="w-20 h-20 text-green-500 mx-auto"/>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Tu pedido ha sido procesado correctamente
          </p>

          {/* Detalles del pedido */}
          {orderDetails && (<div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles del Pedido
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-gray-600 text-sm">Número de Orden:</span>
                    <p className="font-medium">{orderDetails.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Estado:</span>
                    <p className="text-green-600 font-medium">Pagado</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Total:</span>
                    <p className="font-medium">{formatPrice(orderDetails.total)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Fecha:</span>
                    <p className="font-medium">
                      {new Date(orderDetails.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>

                {/* Productos */}
                <div className="border-t pt-4">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Productos:</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item) => (<div key={item.id} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.product.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>))}
                  </div>
                </div>

                {/* Información de WebPay */}
                {webpayDetails && (<div className="border-t pt-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Información de Pago:</h3>
                    <div className="grid grid-cols-2 gap-4 text-left text-sm">
                      <div>
                        <span className="text-gray-600">Token WebPay:</span>
                        <p className="font-mono text-gray-500">
                          {(_a = webpayDetails.token) === null || _a === void 0 ? void 0 : _a.substring(0, 8)}...
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Método:</span>
                        <p className="font-medium">WebPay</p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>)}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              ¿Qué sigue?
            </h3>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <lucide_react_1.Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-blue-800 font-medium">Email de confirmación</p>
                  <p className="text-blue-700 text-sm">
                    Recibirás un email con los detalles de tu compra y el número de seguimiento.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <lucide_react_1.Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-blue-800 font-medium">Preparación del pedido</p>
                  <p className="text-blue-700 text-sm">
                    Tu pedido será preparado y enviado en las próximas 24-48 horas.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <lucide_react_1.Home className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-blue-800 font-medium">Seguimiento</p>
                  <p className="text-blue-700 text-sm">
                    Recibirás actualizaciones sobre el estado de tu envío por email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <link_1.default href="/productos" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <lucide_react_1.Home className="w-5 h-5 mr-2"/>
              Seguir Comprando
            </link_1.default>
            
            <link_1.default href="/contacto" className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              <lucide_react_1.Mail className="w-5 h-5 mr-2"/>
              Contactar Soporte
            </link_1.default>
          </div>

          {/* Información de ayuda */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">
              ¿Tienes alguna pregunta sobre tu pedido?
            </p>
            <link_1.default href="/contacto" className="text-purple-600 hover:text-purple-700 font-medium">
              Contáctanos
            </link_1.default>
          </div>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}

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
exports.default = CheckoutPage;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const CartContext_1 = require("@/contexts/CartContext");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const webpay_1 = __importDefault(require("@/services/webpay"));
function CheckoutPage() {
    const { state, clearCart } = (0, CartContext_1.useCart)();
    const [currentStep, setCurrentStep] = (0, react_1.useState)(1);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        region: '',
        comuna: '',
        postalCode: ''
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [orderId, setOrderId] = (0, react_1.useState)(null);
    const [regiones, setRegiones] = (0, react_1.useState)([]);
    const [comunas, setComunas] = (0, react_1.useState)([]);
    const [loadingRegiones, setLoadingRegiones] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        function fetchRegiones() {
            return __awaiter(this, void 0, void 0, function* () {
                setLoadingRegiones(true);
                try {
                    const res = yield fetch('/api/regiones');
                    const data = yield res.json();
                    setRegiones(data.regiones || []);
                }
                catch (e) {
                    setRegiones([]);
                }
                finally {
                    setLoadingRegiones(false);
                }
            });
        }
        fetchRegiones();
    }, []);
    // Actualizar comunas cuando cambia la región
    (0, react_1.useEffect)(() => {
        const region = regiones.find(r => r.name === formData.region);
        setComunas(region ? region.comunas.map((c) => c.name) : []);
        // Limpiar comuna si la región cambia
        setFormData(prev => (Object.assign(Object.assign({}, prev), { comuna: '' })));
        // eslint-disable-next-line
    }, [formData.region, regiones]);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
        setErrors(prev => (Object.assign(Object.assign({}, prev), { [name]: '' }))); // Limpiar error al escribir
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim())
            newErrors.firstName = 'El nombre es requerido';
        if (!formData.lastName.trim())
            newErrors.lastName = 'El apellido es requerido';
        if (!formData.email.trim())
            newErrors.email = 'El email es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Ingresa un email válido';
        if (!formData.phone.trim())
            newErrors.phone = 'El teléfono es requerido';
        if (!formData.address.trim())
            newErrors.address = 'La dirección es requerida';
        if (!formData.region)
            newErrors.region = 'Selecciona una región';
        if (!formData.comuna)
            newErrors.comuna = 'Selecciona una comuna';
        if (!formData.postalCode.trim())
            newErrors.postalCode = 'El código postal es requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!validateForm()) {
            const firstError = Object.keys(errors)[0];
            if (firstError) {
                const el = document.getElementsByName(firstError)[0];
                if (el)
                    el.focus();
            }
            return;
        }
        setIsProcessing(true);
        try {
            // Crear la orden en la base de datos
            const orderData = {
                items: state.items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                    name: item.product.name
                })),
                total: state.total,
                customerData: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    region: formData.region,
                    comuna: formData.comuna,
                    postalCode: formData.postalCode
                },
                status: 'pending'
            };
            console.log('📦 Creando orden en base de datos:', orderData);
            const orderResponse = yield fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            if (!orderResponse.ok) {
                const errorData = yield orderResponse.json();
                throw new Error(errorData.error || 'Error al crear la orden');
            }
            const orderResult = yield orderResponse.json();
            setOrderId(orderResult.order.id);
            console.log('✅ Orden creada:', orderResult.order.id);
            // Avanzar al siguiente paso
            setCurrentStep(2);
        }
        catch (error) {
            console.error('❌ Error creando orden:', error);
            alert(`Error al procesar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
        finally {
            setIsProcessing(false);
        }
    });
    const initiateWebPayPayment = () => __awaiter(this, void 0, void 0, function* () {
        if (!orderId) {
            alert('Error: No se pudo crear la orden. Intenta nuevamente.');
            return;
        }
        setIsProcessing(true);
        try {
            const paymentData = {
                amount: state.total,
                currency: 'CLP',
                orderId: orderId, // Usar el ID de la orden creada
                customer: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone
                },
                items: state.items.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                returnUrl: `${window.location.origin}/checkout/success`,
                cancelUrl: `${window.location.origin}/checkout/cancel`
            };
            // Validar datos de pago
            const validation = webpay_1.default.validatePaymentData(paymentData);
            if (!validation.valid) {
                alert(`Errores de validación: ${validation.errors.join(', ')}`);
                return;
            }
            console.log('🚀 Iniciando pago con WebPay:', paymentData);
            // Crear transacción en WebPay
            const webpayResponse = yield webpay_1.default.createTransaction(paymentData);
            if (webpayResponse.success && webpayResponse.url) {
                console.log('✅ Redirigiendo a WebPay:', webpayResponse.url);
                // Actualizar la orden con el token de WebPay
                if (webpayResponse.token) {
                    yield fetch(`/api/orders/${orderId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: 'pending',
                            webpayToken: webpayResponse.token,
                            webpayOrderId: orderId
                        })
                    });
                }
                // Redirigir a WebPay
                window.location.href = webpayResponse.url;
                clearCart();
            }
            else {
                alert(`Error al conectar con WebPay: ${webpayResponse.error}`);
            }
        }
        catch (error) {
            console.error('❌ Error iniciando WebPay:', error);
            alert('Error al procesar el pago. Inténtalo de nuevo.');
        }
        finally {
            setIsProcessing(false);
        }
    });
    if (state.items.length === 0) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito Vacío</h1>
          <p className="text-gray-600 mb-6">No hay productos en tu carrito para procesar.</p>
          <link_1.default href="/productos" className="inline-flex items-center px-6 py-3 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors">
            Ir a Productos
          </link_1.default>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Formulario de checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <link_1.default href="/carrito" className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <lucide_react_1.ArrowLeft className="w-5 h-5"/>
                </link_1.default>
                <h1 className="text-2xl font-bold text-brand-principal">
                  {currentStep === 1 && 'Información de Envío'}
                  {currentStep === 2 && 'Método de Pago'}
                  {currentStep === 3 && 'Confirmación'}
                </h1>
              </div>

              {/* Indicador de pasos */}
              <div className="flex items-center mb-8">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-brand-acento' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-brand-acento text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2 text-sm">Envío</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-brand-acento' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-brand-acento' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-brand-acento text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm">Pago</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-brand-acento' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-brand-acento' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3 ? 'bg-brand-acento text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="ml-2 text-sm">Confirmación</span>
                </div>
              </div>

              {/* Paso 1: Información de envío */}
              {currentStep === 1 && (<framer_motion_1.motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-brand-principal mb-2">
                          Nombre *
                        </label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.firstName ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} placeholder="Tu nombre"/>
                        {errors.firstName && (<p className="text-red-500 text-sm mt-1">{errors.firstName}</p>)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-principal mb-2">
                          Apellido *
                        </label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.lastName ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} placeholder="Tu apellido"/>
                        {errors.lastName && (<p className="text-red-500 text-sm mt-1">{errors.lastName}</p>)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-principal mb-2">
                        Email *
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.email ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} placeholder="tu@email.com"/>
                      {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-principal mb-2">
                        Teléfono *
                      </label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.phone ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} placeholder="+56 9 1234 5678"/>
                      {errors.phone && (<p className="text-red-500 text-sm mt-1">{errors.phone}</p>)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-brand-principal mb-2">
                          Región *
                        </label>
                        <select name="region" value={formData.region} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.region ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} disabled={loadingRegiones}>
                          <option value="">Selecciona una región</option>
                          {regiones.map((region) => (<option key={region.id} value={region.name}>
                              {region.name}
                            </option>))}
                        </select>
                        {errors.region && (<p className="text-red-500 text-sm mt-1">{errors.region}</p>)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-principal mb-2">
                          Comuna *
                        </label>
                        <select name="comuna" value={formData.comuna} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.comuna ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} disabled={!formData.region || comunas.length === 0}>
                          <option value="">Selecciona una comuna</option>
                          {comunas.map((comuna) => (<option key={comuna} value={comuna}>
                              {comuna}
                            </option>))}
                        </select>
                        {errors.comuna && (<p className="text-red-500 text-sm mt-1">{errors.comuna}</p>)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-principal mb-2">
                        Dirección *
                      </label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.address ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} placeholder="Calle, número, departamento"/>
                      {errors.address && (<p className="text-red-500 text-sm mt-1">{errors.address}</p>)}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-principal mb-2">
                        Código Postal *
                      </label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} text-brand-principal`} placeholder="1234567"/>
                      {errors.postalCode && (<p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>)}
                    </div>

                    <div className="flex justify-end pt-6">
                      <framer_motion_1.motion.button type="submit" className="px-8 py-3 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isProcessing}>
                        {isProcessing ? 'Procesando...' : 'Continuar al Pago'}
                      </framer_motion_1.motion.button>
                    </div>
                  </form>
                </framer_motion_1.motion.div>)}

              {/* Paso 2: Método de pago */}
              {currentStep === 2 && (<framer_motion_1.motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className="text-2xl font-bold text-brand-principal mb-6">Método de Pago</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-brand-fondoSec rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <lucide_react_1.CreditCard className="h-6 w-6 text-brand-acento mr-3"/>
                        <h3 className="text-lg font-semibold text-brand-principal">WebPay</h3>
                      </div>
                      <p className="text-brand-principal mb-4">
                        Paga de forma segura con WebPay. Aceptamos tarjetas de crédito, débito y transferencias bancarias.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <lucide_react_1.Shield className="h-4 w-4"/>
                        <span>Pago 100% seguro</span>
                        <lucide_react_1.Truck className="h-4 w-4"/>
                        <span>Envío incluido</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button onClick={() => setCurrentStep(1)} className="px-6 py-3 border border-gray-300 text-brand-principal rounded-lg hover:bg-gray-50 transition-colors">
                        Volver
                      </button>
                      <framer_motion_1.motion.button onClick={initiateWebPayPayment} className="px-8 py-3 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isProcessing}>
                        {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                      </framer_motion_1.motion.button>
                    </div>
                  </div>
                </framer_motion_1.motion.div>)}

              {/* Paso 3: Confirmación */}
              {currentStep === 3 && (<framer_motion_1.motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-center">
                  <lucide_react_1.CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                  <h2 className="text-2xl font-bold text-brand-principal mb-4">¡Pago Exitoso!</h2>
                  <p className="text-brand-principal mb-6">
                    Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación con los detalles de tu compra.
                  </p>
                  {orderId && (<p className="text-sm text-gray-600 mb-6">
                      Número de orden: <span className="font-mono">{orderId}</span>
                    </p>)}
                  <link_1.default href="/productos" className="inline-flex items-center px-6 py-3 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors shadow-sm">
                    Continuar Comprando
                  </link_1.default>
                </framer_motion_1.motion.div>)}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-brand-fondoSec rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-brand-principal mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (<div key={item.product.id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <image_1.default src={item.product.image} alt={item.product.name} fill className="object-cover rounded-lg"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-brand-principal truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-brand-principal">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-brand-principal">{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-brand-principal">Total</span>
                  <span className="text-brand-principal">{formatPrice(state.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

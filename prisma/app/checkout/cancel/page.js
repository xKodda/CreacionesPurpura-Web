"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CheckoutCancelPage;
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function CheckoutCancelPage() {
    return (<div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          {/* Icono de cancelación */}
          <div className="mb-8">
            <lucide_react_1.XCircle className="w-20 h-20 text-red-500 mx-auto"/>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pago Cancelado
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            El proceso de pago ha sido cancelado. No se ha realizado ningún cargo.
          </p>

          {/* Información */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">
              ¿Qué pasó?
            </h3>
            
            <div className="space-y-3 text-left">
              <p className="text-yellow-800">
                • El pago fue cancelado antes de completarse
              </p>
              <p className="text-yellow-800">
                • No se ha realizado ningún cargo a tu tarjeta
              </p>
              <p className="text-yellow-800">
                • Tu carrito de compras sigue intacto
              </p>
              <p className="text-yellow-800">
                • Puedes intentar el pago nuevamente cuando quieras
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <link_1.default href="/carrito" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <lucide_react_1.ArrowLeft className="w-5 h-5 mr-2"/>
              Volver al Carrito
            </link_1.default>
            
            <link_1.default href="/productos" className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              <lucide_react_1.ShoppingBag className="w-5 h-5 mr-2"/>
              Seguir Comprando
            </link_1.default>
          </div>

          {/* Información de ayuda */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">
              ¿Necesitas ayuda con el proceso de pago?
            </p>
            <link_1.default href="/contacto" className="text-purple-600 hover:text-purple-700 font-medium">
              Contáctanos
            </link_1.default>
          </div>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}

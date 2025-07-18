"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function NotFound() {
    return (<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-purple-200">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <lucide_react_1.Search className="h-16 w-16 text-purple-400"/>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <link_1.default href="/" className="inline-flex items-center justify-center w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            <lucide_react_1.Home className="h-5 w-5 mr-2"/>
            Ir al inicio
          </link_1.default>
          
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            <lucide_react_1.ArrowLeft className="h-5 w-5 mr-2"/>
            Volver atrás
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">¿Buscas algo específico?</p>
          <div className="grid grid-cols-2 gap-3">
            <link_1.default href="/productos" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Ver productos
            </link_1.default>
            <link_1.default href="/categorias" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Explorar categorías
            </link_1.default>
            <link_1.default href="/contacto" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Contacto
            </link_1.default>
            <link_1.default href="/carrito" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Carrito
            </link_1.default>
          </div>
        </div>
      </div>
    </div>);
}

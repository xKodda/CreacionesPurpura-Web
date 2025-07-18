'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-purple-200">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-purple-400" />
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
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Ir al inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver atrás
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">¿Buscas algo específico?</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/productos"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Ver productos
            </Link>
            <Link
              href="/categorias"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Explorar categorías
            </Link>
            <Link
              href="/contacto"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Contacto
            </Link>
            <Link
              href="/carrito"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
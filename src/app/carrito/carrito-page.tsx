'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CarritoPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-fondo py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-brand-acento mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-brand-principal mb-2">Tu carrito está vacío</h2>
              <p className="text-brand-principal mb-6">
                Parece que aún no has agregado productos a tu carrito.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center px-6 py-3 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors shadow-sm"
              >
                Continuar Comprando
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-fondo py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-brand-principal">Carrito de Compras</h1>
            <motion.button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vaciar Carrito
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl shadow-lg">
                <AnimatePresence>
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center p-6 border-b border-brand-detalle last:border-b-0"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-brand-principal">
                          {item.product.name}
                        </h3>
                        <p className="text-brand-principal text-sm">{item.product.category}</p>
                        <p className="text-brand-principal font-semibold mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-brand-fondo text-brand-principal"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        
                        <span className="w-12 text-center font-semibold text-brand-principal">{item.quantity}</span>
                        
                        <motion.button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-brand-fondo text-brand-principal"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="ml-4 text-right">
                        <p className="text-lg font-semibold text-brand-principal">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <motion.button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-300 mt-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-brand-fondoSec border border-brand-detalle rounded-2xl shadow-lg p-6 sticky top-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-brand-principal mb-4">Resumen del Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-brand-principal">Subtotal ({state.itemCount} items)</span>
                    <span className="font-semibold text-brand-principal">{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-principal">Envío</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="border-t border-brand-detalle pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-brand-principal">Total</span>
                      <span className="text-lg font-bold text-brand-principal">
                        {formatPrice(state.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <motion.button
                    className="w-full bg-brand-acento text-white py-3 font-semibold rounded-lg hover:bg-brand-principal transition-colors shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceder al Pago
                  </motion.button>
                </Link>

                <Link
                  href="/productos"
                  className="block text-center text-brand-acento hover:text-brand-principal mt-4 font-medium"
                >
                  Continuar Comprando
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
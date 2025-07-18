'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useState, useRef } from 'react';
import { Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import Toast from './Toast';

interface AnimatedProductCardProps {
  product: Product;
}

export default function AnimatedProductCard({ product }: AnimatedProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties | null>(null);
  const [showFly, setShowFly] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showToast, setShowToast] = useState(false);

  // Determinar si es un producto nuevo (creado en los últimos 7 días)
  const isNew = () => {
    const createdAt = new Date(product.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      setAdded(true);
      addItem({
        ...product,
        image: product.imageUrl || '/placeholder-product.jpg',
        category: product.category?.name || 'Sin categoría',
        inStock: product.stock > 0,
        rating: 4.5,
        reviews: 0,
        isNew: isNew(),
        isOnSale: false,
      });
      // Vuelo realista
      const btn = buttonRef.current;
      const cart = document.getElementById('cart-icon');
      if (btn && cart) {
        const btnRect = btn.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();
        const startX = btnRect.left + btnRect.width / 2;
        const startY = btnRect.top + btnRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;
        setFlyStyle({
          left: startX,
          top: startY,
          transform: 'translate(-50%, -50%) scale(1)',
        });
        setShowFly(true);
        setTimeout(() => {
          setFlyStyle({
            left: endX,
            top: endY,
            transform: 'translate(-50%, -50%) scale(0.5)',
            transition: 'all 0.8s cubic-bezier(.4,2,.6,1)',
            opacity: 0,
          });
        }, 20);
        setTimeout(() => {
          setShowFly(false);
          // Bump en el badge del carrito
          const badge = cart.querySelector('span');
          if (badge) {
            badge.classList.add('animate-bump');
            setTimeout(() => badge.classList.remove('animate-bump'), 400);
          }
        }, 900);
      }
      setTimeout(() => setAdded(false), 400);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Link href={`/producto/${product.id}`}>
        <div className="relative overflow-hidden group">
          <motion.div
            className="relative h-56 w-full"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-2 p-5">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">{product.category?.name || 'Sin categoría'}</span>
            {isNew() && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-2">Nuevo</span>
            )}
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-lg font-bold text-purple-700">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="relative">
              <button
                ref={buttonRef}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm relative overflow-hidden ${
                  product.stock > 0 
                    ? added
                      ? 'bg-purple-700 text-white scale-105 animate-pulse'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={product.stock === 0 || added}
                onClick={handleAddToCart}
                style={{ minWidth: 90 }}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Agregado</span>
                  </>
                ) : (
                  <>
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
                  </>
                )}
                {/* Vuelo realista */}
                {showFly && typeof window !== 'undefined' && createPortal(
                  <span
                    style={{
                      position: 'fixed',
                      zIndex: 9999,
                      pointerEvents: 'none',
                      ...flyStyle,
                    }}
                  >
                    <svg className="w-7 h-7 text-purple-600 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </span>,
                  document.body
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
      <Toast message="Producto agregado al carrito" show={showToast} onClose={() => setShowToast(false)} />
    </motion.div>
  );
} 
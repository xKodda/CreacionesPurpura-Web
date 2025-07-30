'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Check } from 'lucide-react';
import Toast from '@/components/Toast';
import { useProducts } from '@/hooks/useProducts';
import { Product as ProductType } from '@/types/product';

export default function ProductDetailPage({ params }: any) {
  const { getProduct } = useProducts();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(params.id);
        if (!productData) {
          setError('Producto no encontrado');
        } else {
          setProduct(productData);
          
          // Incrementar vistas del producto
          try {
            await fetch(`/api/productos/${params.id}/view`, {
              method: 'POST',
            });
          } catch (err) {
            console.error('Error incrementando vistas:', err);
          }
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id, getProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (product) {
      // Convertir el producto al tipo esperado por el carrito
      const cartProduct: ProductType = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.imageUrl || '/placeholder-product.jpg',
        category: product.category?.name || 'Sin categoría',
        rating: 4.5,
        reviews: 0,
        inStock: product.stock > 0,
        stock: product.stock,
        isNew: false,
        isOnSale: false,
      };
      
      addItem(cartProduct);
      setAdded(true);
      setShowToast(true);
      setTimeout(() => setAdded(false), 800);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full h-80 relative mb-4">
            <Image
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-contain rounded-lg bg-gray-100"
              priority
            />
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-lg text-purple-700 font-semibold mb-4">
            ${product.price.toLocaleString('es-CL')}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <p className="text-sm text-gray-500 mb-2">Stock disponible: {product.stock} unidades</p>
          <p className="text-sm text-gray-500 mb-2">Categoría: {product.category?.name || 'Sin categoría'}</p>
          <button
            className={`mt-6 w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-white ${
              added ? 'bg-purple-700 scale-105 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'
            }`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {added ? <Check className="h-5 w-5" /> : null}
            {product.stock === 0
              ? 'Sin stock'
              : added
              ? 'Agregado'
              : 'Agregar al carrito'}
          </button>
        </div>
      </div>
      <Toast message="Producto agregado al carrito" show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
} 
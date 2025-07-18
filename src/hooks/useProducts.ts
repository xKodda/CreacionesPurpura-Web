import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
  featured: boolean;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar categorías
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categorias');
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  // Función para obtener un producto específico
  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/productos/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('Error obteniendo producto:', err);
      return null;
    }
  };

  // Función para actualizar productos (después de cambios en el dashboard)
  const refreshProducts = () => {
    fetchProducts();
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Productos activos (para mostrar en el frontend)
  const activeProducts = products.filter(product => product.active);

  // Productos por categoría
  const getProductsByCategory = (categoryId: string) => {
    return activeProducts.filter(product => product.category?.id === categoryId);
  };

  // Productos destacados (solo los que tienen featured: true)
  const featuredProducts = activeProducts.filter(product => product.featured);

  // Productos nuevos (creados en los últimos 7 días)
  const newProducts = activeProducts.filter(product => {
    const createdAt = new Date(product.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  });

  return {
    products: activeProducts,
    allProducts: products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    getProduct,
    refreshProducts,
    getProductsByCategory,
    featuredProducts,
    newProducts,
  };
} 
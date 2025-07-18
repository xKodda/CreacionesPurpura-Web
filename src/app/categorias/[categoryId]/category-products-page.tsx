'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Grid, List, Search, X, SlidersHorizontal } from 'lucide-react';
import AnimatedProductCard from '@/components/AnimatedProductCard';
import { Product } from '@/hooks/useProducts';

interface CategoryProductsPageProps {
  category: {
    id: string;
    name: string;
    count: number;
  };
  products: Product[];
}

interface FilterState {
  priceRange: [number, number];
  searchQuery: string;
  showNew: boolean;
  showOnSale: boolean;
  inStock: boolean;
}

export default function CategoryProductsPage({ category, products }: CategoryProductsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    searchQuery: '',
    showNew: false,
    showOnSale: false,
    inStock: false,
  });

  // Get price range for slider
  const priceRange = useMemo(() => {
    const prices = products.map(p => p.price);
    return prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 50000];
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // New products filter (creados en los últimos 7 días)
      if (filters.showNew) {
        const createdAt = new Date(product.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (createdAt <= weekAgo) return false;
      }

      // In stock filter
      if (filters.inStock && product.stock === 0) {
        return false;
      }

      return true;
    });

    // Sort products
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [products, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      searchQuery: '',
      showNew: false,
      showOnSale: false,
      inStock: false,
    });
  };

  const activeFiltersCount = [
    filters.searchQuery !== '',
    filters.showNew,
    filters.showOnSale,
    filters.inStock,
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000,
  ].filter(Boolean).length;

  // Calculate category statistics
  const categoryStats = {
    totalProducts: products.length,
    averageRating: 4.5, // Rating fijo por ahora
    newProducts: products.filter(p => {
      const createdAt = new Date(p.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    }).length,
    onSaleProducts: 0, // No hay productos en oferta por ahora
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
  };

  // Mostrar mensaje amigable si no hay productos
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-brand-fondo flex flex-col items-center justify-center py-24">
        <div className="bg-brand-fondoSec rounded-2xl shadow-lg p-12 max-w-md text-center">
          <h2 className="text-2xl font-bold text-brand-principal mb-4">No hay productos en esta categoría</h2>
          <p className="text-brand-principal mb-6">Pronto agregaremos productos aquí. Mientras tanto, puedes explorar otras categorías o ver todos los productos.</p>
          <div className="flex flex-col gap-4">
            <Link href="/categorias" className="px-6 py-3 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors font-semibold">Volver a categorías</Link>
            <Link href="/productos" className="px-6 py-3 border border-brand-acento text-brand-acento rounded-lg hover:bg-brand-acento hover:text-white transition-colors font-semibold">Ver todos los productos</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-fondo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/categorias" 
            className="inline-flex items-center text-brand-acento hover:text-brand-principal mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a categorías
          </Link>
          <div className="bg-gradient-to-r from-brand-acento to-brand-principal rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-white mb-4">
              Explora nuestra colección de productos de {category.name.toLowerCase()}
            </p>
            {/* Category Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{categoryStats.totalProducts}</p>
                <p className="text-white text-sm">Productos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{categoryStats.averageRating.toFixed(1)}</p>
                <p className="text-white text-sm">Valoración</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{categoryStats.newProducts}</p>
                <p className="text-white text-sm">Nuevos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{categoryStats.onSaleProducts}</p>
                <p className="text-white text-sm">En oferta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Buscar en ${category.name.toLowerCase()}...`}
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle and Active Filters */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-purple-600 rounded-full px-2 py-1 text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Ordenar por nombre</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="newest">Más recientes</option>
                <option value="rating">Mejor valorados</option>
              </select>

              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de precio: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                      }))}
                      className="w-full"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] 
                        }))}
                        className="w-1/2 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: [prev.priceRange[0], parseInt(e.target.value) || 50000] 
                        }))}
                        className="w-1/2 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.showNew}
                        onChange={(e) => setFilters(prev => ({ ...prev, showNew: e.target.checked }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Productos nuevos</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.showOnSale}
                        onChange={(e) => setFilters(prev => ({ ...prev, showOnSale: e.target.checked }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">En oferta</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Solo en stock</span>
                    </label>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estadísticas</label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total: {products.length} productos</p>
                    <p>Mostrando: {filteredAndSortedProducts.length}</p>
                    <p>Nuevos: {categoryStats.newProducts}</p>
                    <p>En oferta: {categoryStats.onSaleProducts}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredAndSortedProducts.length} de {products.length} productos en {category.name}
          </p>
        </div>

        {/* Products Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedProducts.map((product) => (
            <AnimatedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No se encontraron productos en {category.name}</p>
            <p className="text-gray-400">Intenta ajustar los filtros o la búsqueda</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Otras categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/categorias"
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Ver todas las categorías</h3>
              <p className="text-gray-600 text-sm">Explora nuestra colección completa</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductosPage;
const react_1 = require("react");
const AnimatedProductCard_1 = __importDefault(require("@/components/AnimatedProductCard"));
const useProducts_1 = require("@/hooks/useProducts");
const lucide_react_1 = require("lucide-react");
function ProductosPage() {
    const { products, categories, loading, error } = (0, useProducts_1.useProducts)();
    const [viewMode, setViewMode] = (0, react_1.useState)('grid');
    const [sortBy, setSortBy] = (0, react_1.useState)('name');
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const [filters, setFilters] = (0, react_1.useState)({
        category: 'all',
        priceRange: [0, 50000],
        searchQuery: '',
        showNew: false,
        showOnSale: false,
        inStock: false,
    });
    // Get price range for slider
    const priceRange = (0, react_1.useMemo)(() => {
        const prices = products.map(p => p.price);
        return prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 50000];
    }, [products]);
    // Filter and sort products
    const filteredAndSortedProducts = (0, react_1.useMemo)(() => {
        const filtered = products.filter(product => {
            var _a;
            // Category filter
            if (filters.category !== 'all' && ((_a = product.category) === null || _a === void 0 ? void 0 : _a.id) !== filters.category) {
                return false;
            }
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
                if (createdAt <= weekAgo)
                    return false;
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
    }, [filters, sortBy, products]);
    const clearFilters = () => {
        setFilters({
            category: 'all',
            priceRange: [0, 50000],
            searchQuery: '',
            showNew: false,
            showOnSale: false,
            inStock: false,
        });
    };
    const activeFiltersCount = [
        filters.category !== 'all',
        filters.searchQuery !== '',
        filters.showNew,
        filters.showOnSale,
        filters.inStock,
        filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000,
    ].filter(Boolean).length;
    return (<div className="min-h-screen bg-brand-fondo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-principal mb-4">Nuestros Productos</h1>
          <p className="text-lg text-brand-principal mb-8">Descubre nuestra colección de productos de papelería escolar y cotillón para fiestas</p>
        </div>

        {/* Search Bar */}
        <div className="bg-brand-fondoSec rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-acento"/>
            <input type="text" placeholder="Buscar productos..." value={filters.searchQuery} onChange={(e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { searchQuery: e.target.value })))} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento focus:border-brand-acento text-brand-principal"/>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle and Active Filters */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors shadow-sm">
                <lucide_react_1.SlidersHorizontal className="h-4 w-4"/>
                <span>Filtros</span>
                {activeFiltersCount > 0 && (<span className="bg-white text-brand-acento rounded-full px-2 py-1 text-xs font-bold">
                    {activeFiltersCount}
                  </span>)}
              </button>
              
              {activeFiltersCount > 0 && (<button onClick={clearFilters} className="flex items-center space-x-1 text-brand-principal hover:text-brand-acento transition-colors">
                  <lucide_react_1.X className="h-4 w-4"/>
                  <span>Limpiar filtros</span>
                </button>)}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-2 border-brand-acento rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-acento bg-white text-brand-principal shadow-sm">
                <option value="name">Ordenar por nombre</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="newest">Más recientes</option>
                <option value="rating">Mejor valorados</option>
              </select>

              <div className="flex border-2 border-brand-acento rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-brand-acento text-white' : 'text-brand-principal hover:text-brand-acento'}`}>
                  <lucide_react_1.Grid className="h-4 w-4"/>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-brand-acento text-white' : 'text-brand-principal hover:text-brand-acento'}`}>
                  <lucide_react_1.List className="h-4 w-4"/>
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (<div className="mt-6 pt-6 border-t border-brand-detalle">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-brand-principal mb-2">Categoría</label>
                  <select value={filters.category} onChange={(e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { category: e.target.value })))} className="w-full border-2 border-brand-acento rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-acento bg-white text-brand-principal shadow-sm">
                    <option value="all">Todas las categorías</option>
                    {categories.map((category) => (<option key={category.id} value={category.id}>
                        {category.name}
                      </option>))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-brand-principal mb-2">
                    Rango de precio: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input type="range" min={priceRange[0]} max={priceRange[1]} value={filters.priceRange[1]} onChange={(e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { priceRange: [prev.priceRange[0], parseInt(e.target.value)] })))} className="w-full h-2 bg-brand-acento rounded-lg appearance-none cursor-pointer"/>
                    <div className="flex justify-between text-xs text-brand-principal">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkbox Filters */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-brand-principal mb-2">Filtros</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" checked={filters.showNew} onChange={(e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { showNew: e.target.checked })))} className="rounded border-brand-acento text-brand-acento focus:ring-brand-acento"/>
                      <span className="ml-2 text-sm text-brand-principal">Productos nuevos</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" checked={filters.showOnSale} onChange={(e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { showOnSale: e.target.checked })))} className="rounded border-brand-acento text-brand-acento focus:ring-brand-acento"/>
                      <span className="ml-2 text-sm text-brand-principal">En oferta</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { inStock: e.target.checked })))} className="rounded border-brand-acento text-brand-acento focus:ring-brand-acento"/>
                      <span className="ml-2 text-sm text-brand-principal">Solo en stock</span>
                    </label>
                  </div>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="bg-brand-acento text-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium">
                      {filteredAndSortedProducts.length} productos encontrados
                    </span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        {/* Loading State */}
        {loading && (<div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-acento border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-brand-principal mb-2">Cargando productos...</h3>
              <p className="text-brand-principal">Espera un momento mientras cargamos los productos.</p>
            </div>
          </div>)}

        {/* Error State */}
        {error && (<div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-brand-principal mb-2">Error al cargar productos</h3>
              <p className="text-brand-principal mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors">
                Reintentar
              </button>
            </div>
          </div>)}

        {/* Products Grid/List */}
        {!loading && !error && filteredAndSortedProducts.length > 0 ? (<div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "space-y-4"}>
            {filteredAndSortedProducts.map((product) => (<div key={product.id} className="bg-brand-fondoSec rounded-2xl shadow-lg overflow-hidden">
                <AnimatedProductCard_1.default product={product}/>
              </div>))}
          </div>) : !loading && !error && (<div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <lucide_react_1.Search className="w-12 h-12 text-brand-acento mx-auto mb-4"/>
              <h3 className="text-lg font-semibold text-brand-principal mb-2">No se encontraron productos</h3>
              <p className="text-brand-principal mb-4">
                Intenta ajustar los filtros o buscar con otros términos.
              </p>
              <button onClick={clearFilters} className="px-4 py-2 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>)}
      </div>
    </div>);
}

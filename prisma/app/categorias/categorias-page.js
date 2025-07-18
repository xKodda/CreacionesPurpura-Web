"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoriasPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const useProducts_1 = require("@/hooks/useProducts");
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
const navigation_1 = require("next/navigation");
function CategoriasPage() {
    const { categories, products, loading, error } = (0, useProducts_1.useProducts)();
    const [hoveredCategory, setHoveredCategory] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    // Calculate category statistics
    const categoryStats = categories.map(category => {
        const categoryProducts = products.filter(product => { var _a; return ((_a = product.category) === null || _a === void 0 ? void 0 : _a.id) === category.id; });
        const averageRating = 4.5; // Rating fijo por ahora
        const newProducts = categoryProducts.filter(product => {
            const createdAt = new Date(product.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdAt > weekAgo;
        }).length;
        const onSaleProducts = 0; // No hay productos en oferta por ahora
        return Object.assign(Object.assign({}, category), { products: categoryProducts, averageRating,
            newProducts,
            onSaleProducts, featuredProduct: categoryProducts[0] });
    });
    // Get overall statistics
    const totalProducts = products.length;
    const averageRating = 4.5; // Rating fijo por ahora
    const newProducts = products.filter(product => {
        const createdAt = new Date(product.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
    }).length;
    const onSaleProducts = 0; // No hay productos en oferta por ahora
    return (<div className="min-h-screen bg-brand-fondo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-principal mb-4">Categorías</h1>
          <p className="text-lg text-brand-principal mb-8">
            Explora nuestros productos organizados por categorías. Todo lo que necesitas para el colegio y las fiestas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <lucide_react_1.Package className="h-8 w-8 text-brand-acento"/>
              <div className="ml-3">
                <p className="text-sm text-brand-principal">Total Productos</p>
                <p className="text-xl font-bold text-brand-principal">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <lucide_react_1.Star className="h-8 w-8 text-yellow-500"/>
              <div className="ml-3">
                <p className="text-sm text-brand-principal">Valoración Promedio</p>
                <p className="text-xl font-bold text-brand-principal">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <lucide_react_1.Sparkles className="h-8 w-8 text-green-500"/>
              <div className="ml-3">
                <p className="text-sm text-brand-principal">Productos Nuevos</p>
                <p className="text-xl font-bold text-brand-principal">{newProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand-fondoSec border border-brand-detalle rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <lucide_react_1.TrendingUp className="h-8 w-8 text-red-500"/>
              <div className="ml-3">
                <p className="text-sm text-brand-principal">En Oferta</p>
                <p className="text-xl font-bold text-brand-principal">{onSaleProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card especial 'Ver todo' */}
          <link_1.default href="/productos" className="group bg-brand-fondoSec border border-brand-detalle rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center py-12 cursor-pointer">
            <div className="flex flex-col items-center">
              <lucide_react_1.Package className="h-12 w-12 text-brand-acento mb-4"/>
              <h3 className="text-xl font-semibold text-brand-principal mb-2">Ver todo</h3>
              <p className="text-brand-principal text-sm mb-4">Explora todos los productos</p>
              <span className="inline-flex items-center text-brand-acento group-hover:text-brand-principal font-medium">
                Ir a productos <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
              </span>
            </div>
          </link_1.default>
          {categoryStats.map((category) => (<link_1.default key={category.id} href={`/categorias/${category.id}`} className="group bg-brand-fondoSec border border-brand-detalle rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-brand-fondo to-brand-fondoSec flex items-center justify-center relative overflow-hidden">
                {category.featuredProduct ? (<image_1.default src={category.featuredProduct.imageUrl || '/placeholder-product.jpg'} alt={category.name} width={100} height={100} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>) : (<div className="text-brand-acento text-4xl font-bold">
                    {category.name.charAt(0)}
                  </div>)}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-brand-principal mb-2 group-hover:text-brand-acento transition-colors">
                  {category.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-brand-principal text-sm">
                    {category.products.length} productos
                  </p>
                  {category.averageRating > 0 && (<div className="flex items-center text-sm">
                      <lucide_react_1.Star className="h-4 w-4 text-yellow-500 fill-current"/>
                      <span className="ml-1 text-brand-principal">{category.averageRating.toFixed(1)}</span>
                    </div>)}
                  {category.newProducts > 0 && (<p className="text-green-600 text-sm font-medium">
                      {category.newProducts} nuevos
                    </p>)}
                  {category.onSaleProducts > 0 && (<p className="text-red-600 text-sm font-medium">
                      {category.onSaleProducts} en oferta
                    </p>)}
                </div>
                <span className="inline-flex items-center text-brand-acento group-hover:text-brand-principal font-medium cursor-pointer underline-offset-4 transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-acento after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-brand-acento after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:origin-left" role="link" tabIndex={0} onClick={e => { e.stopPropagation(); e.preventDefault(); router.push(`/categorias/${category.id}`); }} onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/categorias/${category.id}`);
                }
            }}>
                  Explorar categoría <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
                </span>
              </div>
            </link_1.default>))}
        </div>
      </div>
    </div>);
}

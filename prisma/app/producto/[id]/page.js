"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductDetailPage;
const navigation_1 = require("next/navigation");
const image_1 = __importDefault(require("next/image"));
const react_1 = require("react");
const CartContext_1 = require("@/contexts/CartContext");
const lucide_react_1 = require("lucide-react");
const Toast_1 = __importDefault(require("@/components/Toast"));
const useProducts_1 = require("@/hooks/useProducts");
function ProductDetailPage({ params }) {
    var _a;
    const { getProduct } = (0, useProducts_1.useProducts)();
    const { addItem } = (0, CartContext_1.useCart)();
    const [product, setProduct] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [added, setAdded] = (0, react_1.useState)(false);
    const [showToast, setShowToast] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const loadProduct = () => __awaiter(this, void 0, void 0, function* () {
            try {
                setLoading(true);
                const productData = yield getProduct(params.id);
                if (!productData) {
                    setError('Producto no encontrado');
                }
                else {
                    setProduct(productData);
                    // Incrementar vistas del producto
                    try {
                        yield fetch(`/api/productos/${params.id}/view`, {
                            method: 'POST',
                        });
                    }
                    catch (err) {
                        console.error('Error incrementando vistas:', err);
                    }
                }
            }
            catch (err) {
                setError('Error al cargar el producto');
            }
            finally {
                setLoading(false);
            }
        });
        loadProduct();
    }, [params.id, getProduct]);
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>);
    }
    if (error || !product) {
        (0, navigation_1.notFound)();
    }
    const handleAddToCart = () => {
        var _a;
        if (product) {
            addItem(Object.assign(Object.assign({}, product), { image: product.imageUrl || '/placeholder-product.jpg', category: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Sin categoría', inStock: product.stock > 0, rating: 4.5, reviews: 0, isNew: false, isOnSale: false }));
            setAdded(true);
            setShowToast(true);
            setTimeout(() => setAdded(false), 800);
            setTimeout(() => setShowToast(false), 2000);
        }
    };
    return (<div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full h-80 relative mb-4">
            <image_1.default src={product.imageUrl || '/placeholder-product.jpg'} alt={product.name} fill className="object-contain rounded-lg bg-gray-100" priority/>
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-lg text-purple-700 font-semibold mb-4">
            ${product.price.toLocaleString('es-CL')}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <p className="text-sm text-gray-500 mb-2">Stock disponible: {product.stock} unidades</p>
          <p className="text-sm text-gray-500 mb-2">Categoría: {((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Sin categoría'}</p>
          <button className={`mt-6 w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-white ${added ? 'bg-purple-700 scale-105 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'}`} onClick={handleAddToCart} disabled={product.stock === 0}>
            {added ? <lucide_react_1.Check className="h-5 w-5"/> : null}
            {product.stock === 0
            ? 'Sin stock'
            : added
                ? 'Agregado'
                : 'Agregar al carrito'}
          </button>
        </div>
      </div>
      <Toast_1.default message="Producto agregado al carrito" show={showToast} onClose={() => setShowToast(false)}/>
    </div>);
}

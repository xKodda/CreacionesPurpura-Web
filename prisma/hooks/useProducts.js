"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProducts = useProducts;
const react_1 = require("react");
function useProducts() {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // Función para cargar productos
    const fetchProducts = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const res = yield fetch('/api/productos');
            if (!res.ok)
                throw new Error('Error al cargar productos');
            const data = yield res.json();
            setProducts(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
        finally {
            setLoading(false);
        }
    });
    // Función para cargar categorías
    const fetchCategories = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch('/api/categorias');
            if (!res.ok)
                throw new Error('Error al cargar categorías');
            const data = yield res.json();
            setCategories(data);
        }
        catch (err) {
            console.error('Error cargando categorías:', err);
        }
    });
    // Función para obtener un producto específico
    const getProduct = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`/api/productos/${id}`);
            if (!res.ok)
                return null;
            return yield res.json();
        }
        catch (err) {
            console.error('Error obteniendo producto:', err);
            return null;
        }
    });
    // Función para actualizar productos (después de cambios en el dashboard)
    const refreshProducts = () => {
        fetchProducts();
    };
    // Cargar datos iniciales
    (0, react_1.useEffect)(() => {
        fetchProducts();
        fetchCategories();
    }, []);
    // Productos activos (para mostrar en el frontend)
    const activeProducts = products.filter(product => product.active);
    // Productos por categoría
    const getProductsByCategory = (categoryId) => {
        return activeProducts.filter(product => { var _a; return ((_a = product.category) === null || _a === void 0 ? void 0 : _a.id) === categoryId; });
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

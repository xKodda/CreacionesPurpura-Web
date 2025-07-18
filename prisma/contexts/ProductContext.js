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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductProvider = ProductProvider;
exports.useProductContext = useProductContext;
const react_1 = require("react");
const ProductContext = (0, react_1.createContext)(undefined);
function ProductProvider({ children }) {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
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
    const refreshProducts = () => {
        fetchProducts();
    };
    const refreshCategories = () => {
        fetchCategories();
    };
    (0, react_1.useEffect)(() => {
        fetchProducts();
        fetchCategories();
    }, []);
    return (<ProductContext.Provider value={{
            products,
            categories,
            loading,
            error,
            refreshProducts,
            refreshCategories,
        }}>
      {children}
    </ProductContext.Provider>);
}
function useProductContext() {
    const context = (0, react_1.useContext)(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
}

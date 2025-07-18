"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartProvider = CartProvider;
exports.useCart = useCart;
const react_1 = __importStar(require("react"));
const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
};
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.product.id === action.payload.id);
            if (existingItem) {
                const updatedItems = state.items.map(item => item.product.id === action.payload.id
                    ? Object.assign(Object.assign({}, item), { quantity: item.quantity + 1 }) : item);
                return Object.assign(Object.assign({}, state), { items: updatedItems, total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0) });
            }
            else {
                const newItems = [...state.items, { product: action.payload, quantity: 1 }];
                return Object.assign(Object.assign({}, state), { items: newItems, total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0) });
            }
        }
        case 'REMOVE_ITEM': {
            const updatedItems = state.items.filter(item => item.product.id !== action.payload);
            return Object.assign(Object.assign({}, state), { items: updatedItems, total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0) });
        }
        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item => item.product.id === action.payload.productId
                ? Object.assign(Object.assign({}, item), { quantity: Math.max(0, action.payload.quantity) }) : item).filter(item => item.quantity > 0);
            return Object.assign(Object.assign({}, state), { items: updatedItems, total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0) });
        }
        case 'CLEAR_CART':
            return initialState;
        case 'LOAD_CART':
            return action.payload;
        default:
            return state;
    }
}
const CartContext = (0, react_1.createContext)(undefined);
function CartProvider({ children }) {
    const [state, dispatch] = (0, react_1.useReducer)(cartReducer, initialState);
    // Cargar carrito desde localStorage al inicializar
    (0, react_1.useEffect)(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            }
            catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);
    // Guardar carrito en localStorage cuando cambie
    (0, react_1.useEffect)(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);
    const addItem = (product) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    };
    const removeItem = (productId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    };
    const updateQuantity = (productId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    };
    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };
    return (<CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>);
}
function useCart() {
    const context = (0, react_1.useContext)(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  // Asegurar que state.items siempre sea un array
  const currentItems = state.items || [];
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = currentItems.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = currentItems.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItems = [...currentItems, { product: action.payload, quantity: 1 }];
        
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = currentItems.filter(item => item.product.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = currentItems.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    case 'LOAD_CART':
      // Validar que el payload tenga la estructura correcta
      if (action.payload && typeof action.payload === 'object') {
        return {
          items: Array.isArray(action.payload.items) ? action.payload.items : [],
          total: typeof action.payload.total === 'number' ? action.payload.total : 0,
          itemCount: typeof action.payload.itemCount === 'number' ? action.payload.itemCount : 0,
        };
      }
      return initialState;
      
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validar que el carrito tenga la estructura correcta
        if (parsedCart && typeof parsedCart === 'object') {
          const validCart: CartState = {
            items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
            total: typeof parsedCart.total === 'number' ? parsedCart.total : 0,
            itemCount: typeof parsedCart.itemCount === 'number' ? parsedCart.itemCount : 0,
          };
          dispatch({ type: 'LOAD_CART', payload: validCart });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Si hay error, limpiar el localStorage corrupto
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 
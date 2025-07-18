"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductCard;
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
function ProductCard({ id, name, price, originalPrice, image, category, isNew = false, isOnSale = false }) {
    const [isLiked, setIsLiked] = (0, react_1.useState)(false);
    const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    return (<div className="group relative bg-brand-fondoSec rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-brand-detalle">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <image_1.default src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (<span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Nuevo
            </span>)}
          {isOnSale && (<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>)}
        </div>

        {/* Wishlist Button */}
        <button onClick={() => setIsLiked(!isLiked)} className="absolute top-2 right-2 p-2 bg-brand-fondo rounded-full shadow-md hover:bg-brand-fondoDest transition-colors">
          <lucide_react_1.Heart className={`h-4 w-4 ${isLiked ? 'fill-brand-principal text-brand-principal' : 'text-brand-detalle'}`}/>
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute inset-0 bg-brand-principal bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-brand-acento text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-brand-principal transition-all duration-300">
            <lucide_react_1.ShoppingCart className="h-4 w-4"/>
            <span>Agregar</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm text-brand-detalle mb-1">{category}</div>
        <link_1.default href={`/producto/${id}`} className="block">
          <h3 className="font-semibold text-brand-principal mb-2 hover:text-brand-acento transition-colors line-clamp-2">
            {name}
          </h3>
        </link_1.default>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-brand-principal">
            ${price.toLocaleString()}
          </span>
          {originalPrice && (<span className="text-sm text-brand-detalle line-through">
              ${originalPrice.toLocaleString()}
            </span>)}
        </div>
      </div>
    </div>);
}

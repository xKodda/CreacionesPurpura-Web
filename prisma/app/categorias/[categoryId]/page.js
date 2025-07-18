"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
const navigation_1 = require("next/navigation");
const useProducts_1 = require("@/hooks/useProducts");
const category_products_page_1 = __importDefault(require("./category-products-page"));
'use client';
function Page({ params }) {
    const { categories, getProductsByCategory } = (0, useProducts_1.useProducts)();
    const category = categories.find(cat => cat.id === params.categoryId);
    if (!category) {
        (0, navigation_1.notFound)();
    }
    const categoryProducts = getProductsByCategory(params.categoryId);
    return (<category_products_page_1.default category={{
            id: category.id,
            name: category.name,
            count: categoryProducts.length,
        }} products={categoryProducts}/>);
}

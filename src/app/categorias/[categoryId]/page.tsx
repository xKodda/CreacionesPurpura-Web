import { notFound } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import CategoryProductsPage from './category-products-page';

'use client';

export default function Page({ params }: any) {
  const { categories, getProductsByCategory } = useProducts();
  
  const category = categories.find(cat => cat.id === params.categoryId);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(params.categoryId);

  return (
    <CategoryProductsPage 
      category={{
        id: category.id,
        name: category.name,
        count: categoryProducts.length,
      }} 
      products={categoryProducts} 
    />
  );
} 
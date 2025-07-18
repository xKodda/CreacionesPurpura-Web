export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock?: boolean;
  tags?: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  variants?: Array<{ color: string; stock: number; image?: string; }>;
}

// Función para calcular si un producto está en stock
const calculateInStock = (stock: number): boolean => stock > 0;

export const products: Product[] = [
  {
    id: '1',
    name: 'Set de Plumones Faber-Castell',
    description: 'Set de 24 plumones de colores vibrantes para manualidades y arte. Ideal para escolares y artistas.',
    price: 15990,
    originalPrice: 19990,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    category: 'Papelería',
    isOnSale: true,
    rating: 4.8,
    reviews: 23,
    inStock: calculateInStock(15)
  },
  {
    id: '2',
    name: 'Cuadernos Oxford Decorativos',
    description: 'Pack de 3 cuadernos universitarios con diseños únicos y papel de alta calidad. 100 hojas cada uno.',
    price: 12990,
    image: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=500&h=500&fit=crop',
    category: 'Papelería',
    isNew: true,
    rating: 4.9,
    reviews: 12,
    inStock: calculateInStock(8)
  },
  {
    id: '3',
    name: 'Set de Globos de Fiesta',
    description: 'Pack de 50 globos multicolor para decoración de fiestas y eventos. Incluye inflador manual.',
    price: 8990,
    originalPrice: 11990,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop',
    category: 'Cotillón',
    isOnSale: true,
    rating: 4.7,
    reviews: 18,
    inStock: calculateInStock(25)
  },
  {
    id: '4',
    name: 'Cinta Decorativa Washi',
    description: 'Set de 10 rollos de cinta washi con diseños variados para manualidades y scrapbooking.',
    price: 7990,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop',
    category: 'Papelería',
    rating: 4.6,
    reviews: 31,
    inStock: calculateInStock(20)
  },
  {
    id: '5',
    name: 'Confeti Metálico Brillante',
    description: 'Confeti dorado y plateado para celebraciones especiales. Ideal para 18 de septiembre.',
    price: 3990,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
    category: 'Cotillón',
    isNew: true,
    rating: 4.8,
    reviews: 9,
    inStock: calculateInStock(12)
  },
  {
    id: '6',
    name: 'Set de Tijeras Decorativas',
    description: 'Pack de 5 tijeras con bordes decorativos para manualidades y scrapbooking.',
    price: 15990,
    originalPrice: 19990,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop',
    category: 'Papelería',
    isOnSale: true,
    rating: 5.0,
    reviews: 7,
    inStock: calculateInStock(3)
  },
  {
    id: '7',
    name: 'Serpentinas de Colores',
    description: 'Pack de 20 serpentinas multicolor para fiestas y celebraciones. Incluye colores patrios.',
    price: 5990,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
    category: 'Cotillón',
    rating: 4.7,
    reviews: 15,
    inStock: calculateInStock(7)
  },
  {
    id: '8',
    name: 'Set de Pegamentos Especiales',
    description: 'Pack de 6 tipos diferentes de pegamento para manualidades. Incluye pegamento en barra y líquido.',
    price: 12990,
    originalPrice: 15990,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    category: 'Papelería',
    isOnSale: true,
    rating: 4.5,
    reviews: 22,
    inStock: calculateInStock(10)
  },
  {
    id: '9',
    name: 'Piñata Tradicional Chilena',
    description: 'Piñata colorida de 7 picos para fiestas infantiles. Incluye dulces y confites chilenos.',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop',
    category: 'Cotillón',
    rating: 4.9,
    reviews: 18,
    inStock: calculateInStock(5)
  },
  {
    id: '10',
    name: 'Set de Papel de Regalo',
    description: 'Pack de 10 hojas de papel de regalo con diseños festivos. Incluye moños decorativos.',
    price: 9990,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop',
    category: 'Papelería',
    rating: 4.4,
    reviews: 11,
    inStock: calculateInStock(15)
  },
  {
    id: '11',
    name: 'Sombreros de Fiesta',
    description: 'Pack de 12 sombreros de fiesta multicolor para celebraciones. Incluye gorros de cumpleaños.',
    price: 8990,
    originalPrice: 11990,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
    category: 'Cotillón',
    isOnSale: true,
    rating: 4.6,
    reviews: 14,
    inStock: calculateInStock(8)
  },
  {
    id: '12',
    name: 'Set de Lápices de Colores Faber-Castell',
    description: 'Pack de 36 lápices de colores profesionales para arte y dibujo. Ideal para escolares.',
    price: 19990,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    category: 'Papelería',
    rating: 4.8,
    reviews: 19,
    inStock: calculateInStock(12)
  },
  {
    id: '13',
    name: 'Set de Pinturas Acrílicas',
    description: 'Pack de 12 pinturas acrílicas de colores vibrantes para manualidades y arte.',
    price: 15990,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    category: 'Manualidades',
    isNew: true,
    rating: 4.7,
    reviews: 15,
    inStock: calculateInStock(8)
  },
  {
    id: '14',
    name: 'Papel Crepe de Colores',
    description: 'Pack de 20 hojas de papel crepe multicolor para manualidades y decoración.',
    price: 7990,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop',
    category: 'Manualidades',
    rating: 4.5,
    reviews: 12,
    inStock: calculateInStock(18)
  },
  {
    id: '15',
    name: 'Set de Pinceles Profesionales',
    description: 'Pack de 8 pinceles de diferentes tamaños para pintura y manualidades.',
    price: 12990,
    originalPrice: 15990,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    category: 'Manualidades',
    isOnSale: true,
    rating: 4.9,
    reviews: 8,
    inStock: calculateInStock(6)
  },
  {
    id: '16',
    name: 'Guirnalda de Luces LED',
    description: 'Guirnalda de 50 luces LED para decoración de fiestas y eventos.',
    price: 18990,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
    category: 'Decoración',
    isNew: true,
    rating: 4.8,
    reviews: 11,
    inStock: calculateInStock(10)
  },
  {
    id: '17',
    name: 'Set de Velas Decorativas',
    description: 'Pack de 12 velas aromáticas para decoración y ambientación.',
    price: 14990,
    originalPrice: 18990,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
    category: 'Decoración',
    isOnSale: true,
    rating: 4.6,
    reviews: 9,
    inStock: calculateInStock(7)
  },
  {
    id: '18',
    name: 'Marco de Fotos Decorativo',
    description: 'Marco de fotos con diseño elegante para decoración del hogar.',
    price: 8990,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop',
    category: 'Decoración',
    rating: 4.7,
    reviews: 6,
    inStock: calculateInStock(4)
  },
  {
    id: '19',
    name: 'Cuaderno Universitario',
    description: 'Cuaderno universitario con 100 hojas, tapa dura. Disponible en varios colores.',
    price: 3990,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    category: 'Papelería',
    rating: 4.7,
    reviews: 8,
    inStock: true,
    variants: [
      { color: 'Rojo', stock: 10, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop' },
      { color: 'Azul', stock: 5, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop' },
      { color: 'Verde', stock: 0, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop' }
    ]
  }
];

export const categories = [
  { id: 'papeleria', name: 'Papelería Escolar', count: 7 },
  { id: 'cotillon', name: 'Cotillón y Fiestas', count: 5 },
  { id: 'manualidades', name: 'Manualidades', count: 3 },
  { id: 'decoracion', name: 'Decoración', count: 3 }
];

// Helper function to match product category with category ID
export const matchProductToCategory = (productCategory: string, categoryId: string): boolean => {
  const productCategoryLower = productCategory.toLowerCase();
  
  // Map category names to IDs
  const categoryMapping: { [key: string]: string } = {
    'papelería': 'papeleria',
    'cotillón': 'cotillon',
    'manualidades': 'manualidades',
    'decoración': 'decoracion'
  };
  
  const mappedCategoryId = categoryMapping[productCategoryLower] || productCategoryLower;
  return mappedCategoryId === categoryId;
};

// Helper function to get category ID from category name
export const getCategoryIdFromName = (categoryName: string): string => {
  const categoryNameLower = categoryName.toLowerCase();
  
  if (categoryNameLower === 'papelería') return 'papeleria';
  if (categoryNameLower === 'cotillón') return 'cotillon';
  if (categoryNameLower === 'manualidades') return 'manualidades';
  if (categoryNameLower === 'decoración') return 'decoracion';
  
  return categoryNameLower;
}; 
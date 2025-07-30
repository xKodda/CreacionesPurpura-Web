const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías
  console.log('📂 Creando categorías...');
  const categorias = [
    { name: 'Papelería Escolar', description: 'Todo para el colegio y oficina' },
    { name: 'Cotillón y Fiestas', description: 'Artículos para celebraciones y eventos' },
    { name: 'Manualidades', description: 'Materiales para crear y decorar' },
    { name: 'Decoración', description: 'Accesorios y adornos para tu espacio' }
  ];

  for (const cat of categorias) {
    try {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: { description: cat.description },
        create: { name: cat.name, description: cat.description }
      });
      console.log(`✅ Categoría creada: ${cat.name}`);
    } catch (err) {
      console.error(`❌ Error con categoría ${cat.name}:`, err.message);
    }
  }

  // Crear productos
  console.log('📦 Creando productos...');
  const productos = [
    {
      name: 'Set de Plumones Faber-Castell',
      description: 'Set de 24 plumones de colores vibrantes para manualidades y arte. Ideal para escolares y artistas.',
      price: 15990,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
      categoryName: 'Papelería Escolar',
      stock: 15
    },
    {
      name: 'Cuadernos Oxford Decorativos',
      description: 'Pack de 3 cuadernos universitarios con diseños únicos y papel de alta calidad. 100 hojas cada uno.',
      price: 12990,
      imageUrl: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=500&h=500&fit=crop',
      categoryName: 'Papelería Escolar',
      stock: 8
    },
    {
      name: 'Set de Globos de Fiesta',
      description: 'Pack de 50 globos multicolor para decoración de fiestas y eventos. Incluye inflador manual.',
      price: 8990,
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop',
      categoryName: 'Cotillón y Fiestas',
      stock: 25
    },
    {
      name: 'Set de Pinturas Acrílicas',
      description: 'Pack de 12 pinturas acrílicas de colores vibrantes para manualidades y arte.',
      price: 15990,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
      categoryName: 'Manualidades',
      stock: 8
    },
    {
      name: 'Guirnalda de Luces LED',
      description: 'Guirnalda de 50 luces LED para decoración de fiestas y eventos.',
      price: 18990,
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
      categoryName: 'Decoración',
      stock: 10
    },
    {
      name: 'Lápices de Colores Profesionales',
      description: 'Set de 36 lápices de colores de alta calidad para artistas y estudiantes.',
      price: 22990,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
      categoryName: 'Papelería Escolar',
      stock: 12
    },
    {
      name: 'Papel Crepe Decorativo',
      description: 'Rollos de papel crepe en múltiples colores para manualidades y decoración.',
      price: 5990,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
      categoryName: 'Manualidades',
      stock: 20
    },
    {
      name: 'Centro de Mesa Floral',
      description: 'Centro de mesa artificial con flores coloridas para decoración de eventos.',
      price: 24990,
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
      categoryName: 'Decoración',
      stock: 5
    }
  ];

  for (const prod of productos) {
    try {
      const categoria = await prisma.category.findFirst({ 
        where: { name: prod.categoryName } 
      });
      
      if (!categoria) {
        console.error(`❌ No se encontró la categoría: ${prod.categoryName}`);
        continue;
      }

      await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          imageUrl: prod.imageUrl,
          stock: prod.stock,
          categoryId: categoria.id
        }
      });
      console.log(`✅ Producto creado: ${prod.name}`);
    } catch (err) {
      console.error(`❌ Error con producto ${prod.name}:`, err.message);
    }
  }

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
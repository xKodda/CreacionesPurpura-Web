import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'Papelería',
      description: 'Productos de papelería escolar y de oficina'
    },
    {
      name: 'Cotillón',
      description: 'Productos para fiestas y celebraciones'
    },
    {
      name: 'Manualidades',
      description: 'Materiales para manualidades y arte'
    },
    {
      name: 'Decoración',
      description: 'Productos decorativos para el hogar'
    },
    {
      name: 'Regalos',
      description: 'Productos para regalar en ocasiones especiales'
    }
  ];

  console.log('🌱 Iniciando creación de categorías...');

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { name: category.name }
    });

    if (existing) {
      console.log(`✅ Categoría "${category.name}" ya existe`);
    } else {
      const created = await prisma.category.create({
        data: category
      });
      console.log(`✅ Categoría creada: ${created.name}`);
    }
  }

  console.log('🎉 Proceso de creación de categorías completado');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
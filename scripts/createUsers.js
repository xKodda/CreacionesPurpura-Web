const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('👥 Iniciando creación de usuarios...');

  // Hash de las contraseñas
  const adminPassword = await bcrypt.hash('Emilia310626', 10);
  const clientPassword = await bcrypt.hash('christofer1', 10);

  // Crear usuario admin
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: 'creacionespurpura.papeleria@gmail.com' },
      update: {
        name: 'Karen Andrea',
        password: adminPassword,
        role: 'admin'
      },
      create: {
        name: 'Karen Andrea',
        email: 'creacionespurpura.papeleria@gmail.com',
        password: adminPassword,
        role: 'admin'
      }
    });
    console.log('✅ Usuario admin creado:', adminUser.email);
  } catch (err) {
    console.error('❌ Error creando usuario admin:', err.message);
  }

  // Crear usuario cliente
  try {
    const clientUser = await prisma.user.upsert({
      where: { email: 'christofergodcer@gmail.com' },
      update: {
        name: 'Christofer',
        password: clientPassword,
        role: 'cliente'
      },
      create: {
        name: 'Christofer',
        email: 'christofergodcer@gmail.com',
        password: clientPassword,
        role: 'cliente'
      }
    });
    console.log('✅ Usuario cliente creado:', clientUser.email);
  } catch (err) {
    console.error('❌ Error creando usuario cliente:', err.message);
  }

  console.log('🎉 Usuarios creados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la creación de usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
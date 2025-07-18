import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'christofergodcer@gmail.com';
  const name = 'Cliente de Prueba';
  const password = '12345';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: 'cliente',
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: 'cliente',
    },
  });

  console.log('✅ Usuario cliente creado o actualizado:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
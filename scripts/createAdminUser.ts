import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'creacionespurpura.papeleria@gmail.com';
  const name = 'Karen Andrea';
  const password = 'Emilia310626';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Super usuario creado o actualizado:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
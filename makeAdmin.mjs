import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.updateMany({
    data: { role: 'Administrator' }
  });
  console.log(`Updated ${users.count} users to Administrator.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

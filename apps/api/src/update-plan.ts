import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const res = await prisma.organization.updateMany({
    data: { plan: 'PRO' },
  });
  console.log('Successfully updated organization plans to PRO:', res);
  await prisma.$disconnect();
}

main();

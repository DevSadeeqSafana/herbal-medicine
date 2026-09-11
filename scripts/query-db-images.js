const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();

  const team = await prisma.teamMember.findMany({
    select: { name: true, imageUrl: true },
  });

  const programmes = await prisma.programme.findMany({
    select: { name: true, imageUrl: true },
  });

  console.log('TEAM');
  console.log(JSON.stringify(team, null, 2));

  console.log('PROGRAMMES');
  console.log(JSON.stringify(programmes, null, 2));

  await prisma.$disconnect();
})();

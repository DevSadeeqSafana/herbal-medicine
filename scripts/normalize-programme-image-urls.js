const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  const programmes = await prisma.programme.findMany({
    select: { id: true, imageUrl: true, name: true },
  });

  for (const programme of programmes) {
    if (!programme.imageUrl) continue;

    const nextImageUrl = programme.imageUrl.replace(/\.jpg$/i, '.webp');
    if (nextImageUrl !== programme.imageUrl) {
      await prisma.programme.update({
        where: { id: programme.id },
        data: { imageUrl: nextImageUrl },
      });
      console.log(`updated ${programme.name} -> ${nextImageUrl}`);
    }
  }

  await prisma.$disconnect();
})();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
  try {
    console.log('Fetching most recent memories...\n');
    
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    memories.forEach((memory, idx) => {
      console.log(`\n=== Memory ${idx + 1} ===`);
      console.log(`ID: ${memory.id}`);
      console.log(`Title: ${memory.title}`);
      console.log(`Created: ${memory.createdAt}`);
      console.log(`imageUrl (single): ${memory.imageUrl}`);
      console.log(`images array length: ${memory.images?.length || 0}`);
      console.log(`images array:`, memory.images);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages();

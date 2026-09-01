import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearTables() {
  try {
    console.log('Starting to clear tables...');

    // Delete in correct order due to foreign key constraints
    // 1. Delete payments first (references registrations)
    const paymentsDeleted = await prisma.payment.deleteMany({});
    console.log(`✓ Deleted ${paymentsDeleted.count} payments`);

    // 2. Delete registrations
    const registrationsDeleted = await prisma.registration.deleteMany({});
    console.log(`✓ Deleted ${registrationsDeleted.count} registrations`);

    // 3. Delete email verifications
    const emailVerificationsDeleted = await prisma.emailVerification.deleteMany({});
    console.log(`✓ Deleted ${emailVerificationsDeleted.count} email verifications`);

    console.log('\n✅ All tables cleared successfully!');
  } catch (error) {
    console.error('Error clearing tables:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearTables();

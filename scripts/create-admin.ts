import { PrismaClient } from '@prisma/client';
import { hashCode } from '../lib/crypto';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Admin credentials
    const email = 'admin@cosmopolitan.edu.ng';
    const password = 'Admin@2025';
    const name = 'System Administrator';

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', email);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = hashCode(password);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'superadmin',
        isActive: true,
      },
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════════');
    console.log('📧 Email:    ', email);
    console.log('🔑 Password: ', password);
    console.log('👤 Name:     ', name);
    console.log('🎯 Role:     ', admin.role);
    console.log('═══════════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    console.log('🌐 Login at: http://localhost:3003/admin\n');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

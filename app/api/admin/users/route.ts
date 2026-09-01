import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashCode } from '@/lib/crypto';

// GET - Fetch all admin users (superadmin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = {};

    if (isActive !== null && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const admins = await prisma.admin.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const stats = {
      total: await prisma.admin.count(),
      active: await prisma.admin.count({ where: { isActive: true } }),
      inactive: await prisma.admin.count({ where: { isActive: false } }),
      superadmins: await prisma.admin.count({ where: { role: 'superadmin' } }),
      admins: await prisma.admin.count({ where: { role: 'admin' } }),
    };

    return NextResponse.json({
      success: true,
      data: admins,
      stats,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch admins',
      },
      { status: 500 }
    );
  }
}

// POST - Create new admin user (superadmin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password, name, role, isActive } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, password, and name are required',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: 'An admin with this email already exists',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = hashCode(password);

    const admin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: role || 'admin',
        isActive: isActive ?? true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: admin,
      message: 'Admin created successfully',
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create admin',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashCode } from '@/lib/crypto';

// GET - Fetch single admin
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch admin',
      },
      { status: 500 }
    );
  }
}

// PUT - Update admin
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const existing = await prisma.admin.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin not found',
        },
        { status: 404 }
      );
    }

    const { email, name, role, isActive } = body;

    // If email is being changed, check for duplicates
    if (email && email.toLowerCase() !== existing.email) {
      const emailExists = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            message: 'An admin with this email already exists',
          },
          { status: 400 }
        );
      }
    }

    const admin = await prisma.admin.update({
      where: { id: params.id },
      data: {
        email: email ? email.toLowerCase() : existing.email,
        name: name ?? existing.name,
        role: role ?? existing.role,
        isActive: isActive ?? existing.isActive,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: admin,
      message: 'Admin updated successfully',
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update admin',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.admin.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin not found',
        },
        { status: 404 }
      );
    }

    // Check if this is the last superadmin
    if (existing.role === 'superadmin') {
      const superadminCount = await prisma.admin.count({
        where: { role: 'superadmin' },
      });

      if (superadminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            message: 'Cannot delete the last superadmin. Create another superadmin first.',
          },
          { status: 400 }
        );
      }
    }

    await prisma.admin.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete admin',
      },
      { status: 500 }
    );
  }
}

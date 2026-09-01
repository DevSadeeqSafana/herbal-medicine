import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashCode } from '@/lib/crypto';

// PUT - Change admin password
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters',
        },
        { status: 400 }
      );
    }

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

    // Hash and update password
    const hashedPassword = hashCode(newPassword);

    await prisma.admin.update({
      where: { id: params.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update password',
      },
      { status: 500 }
    );
  }
}

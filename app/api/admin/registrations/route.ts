import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // Verify admin token from headers or cookies

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const programme = searchParams.get('programme');
    const search = searchParams.get('search');

    // Build filter conditions
    const where: any = {};

    if (status && status !== 'all') {
      where.paymentStatus = status.toUpperCase();
    }

    if (programme && programme !== 'all') {
      where.programmeId = programme;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Fetch registrations with programme details
    const registrations = await prisma.registration.findMany({
      where,
      include: {
        programme: {
          select: {
            name: true,
            price: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const stats = {
      total: registrations.length,
      pending: registrations.filter((r) => r.paymentStatus === 'PENDING').length,
      completed: registrations.filter((r) => r.paymentStatus === 'COMPLETED').length,
      failed: registrations.filter((r) => r.paymentStatus === 'FAILED').length,
    };

    return NextResponse.json({
      success: true,
      data: registrations,
      stats,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch registrations',
      },
      { status: 500 }
    );
  }
}

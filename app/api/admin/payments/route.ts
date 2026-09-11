import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/payments - Fetch all payments with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const programmeId = searchParams.get('programmeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: Prisma.PaymentWhereInput = {};

    // Filter by payment status
    if (status && status !== 'all') {
      where.status = status;
    }

    // Filter by programme
    if (programmeId && programmeId !== 'all') {
      where.registration = {
        programmeId,
      };
    }

    // Search by transaction reference, student name, or email
    if (search) {
      where.OR = [
        { transactionRef: { contains: search } },
        { credoRef: { contains: search } },
        {
          registration: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ],
          },
        },
      ];
    }

    // Filter by date range
    const createdAtFilter: Prisma.DateTimeFilter = {};

    if (startDate) {
      createdAtFilter.gte = new Date(startDate);
    }
    if (endDate) {
      createdAtFilter.lte = new Date(endDate);
    }

    if (startDate || endDate) {
      where.createdAt = createdAtFilter;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        registration: {
          include: {
            programme: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const stats = {
      total: payments.length,
      pending: payments.filter((p) => p.status === 'PENDING').length,
      successful: payments.filter((p) => p.status === 'COMPLETED').length,
      failed: payments.filter((p) => p.status === 'FAILED').length,
      totalAmount: payments
        .filter((p) => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0),
      totalPendingAmount: payments
        .filter((p) => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0),
    };

    return NextResponse.json({
      success: true,
      data: payments,
      stats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch payments';
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch payments',
        error: message,
      },
      { status: 500 }
    );
  }
}

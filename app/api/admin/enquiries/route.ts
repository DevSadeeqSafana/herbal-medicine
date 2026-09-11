import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch all enquiries with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get stats
    const stats = await prisma.enquiry.groupBy({
      by: ['status'],
      _count: true,
    });

    const statsMap = {
      total: 0,
      new: 0,
      read: 0,
      replied: 0,
      archived: 0,
    };

    stats.forEach((s) => {
      statsMap[s.status as keyof typeof statsMap] = s._count;
      statsMap.total += s._count;
    });

    return NextResponse.json({
      success: true,
      data: enquiries,
      stats: statsMap,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

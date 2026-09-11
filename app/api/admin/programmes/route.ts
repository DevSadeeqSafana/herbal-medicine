import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // Verify admin token from headers or cookies

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    // Build filter conditions
    const where: Prisma.ProgrammeWhereInput = {};

    if (isActive !== null && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Fetch programmes with registration count
    const programmes = await prisma.programme.findMany({
      where,
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const stats = {
      total: programmes.length,
      active: programmes.filter((p) => p.isActive).length,
      inactive: programmes.filter((p) => !p.isActive).length,
    };

    return NextResponse.json({
      success: true,
      data: programmes,
      stats,
    });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch programmes',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // Verify admin token from headers or cookies

    const body = await request.json();
    const {
      name,
      description,
      duration,
      price,
      curriculum,
      startDate,
      endDate,
      imageUrl,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !description || !duration || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Create programme
    const programme = await prisma.programme.create({
      data: {
        name,
        description,
        duration,
        price: parseFloat(price),
        curriculum: JSON.stringify(curriculum || []),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: programme,
      message: 'Programme created successfully',
    });
  } catch (error) {
    console.error('Error creating programme:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create programme',
      },
      { status: 500 }
    );
  }
}

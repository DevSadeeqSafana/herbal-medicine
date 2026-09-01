import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check here
    const { id } = params;

    const programme = await prisma.programme.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!programme) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: programme,
    });
  } catch (error) {
    console.error('Error fetching programme:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch programme',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check here
    const { id } = params;
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

    const programme = await prisma.programme.update({
      where: { id },
      data: {
        name,
        description,
        duration,
        price: price ? parseFloat(price) : undefined,
        curriculum: curriculum ? JSON.stringify(curriculum) : undefined,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: programme,
      message: 'Programme updated successfully',
    });
  } catch (error) {
    console.error('Error updating programme:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update programme',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check here
    const { id } = params;

    // Check if programme has registrations
    const programme = await prisma.programme.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!programme) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme not found',
        },
        { status: 404 }
      );
    }

    if (programme._count.registrations > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete programme with ${programme._count.registrations} registration(s). Please deactivate instead.`,
        },
        { status: 400 }
      );
    }

    await prisma.programme.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Programme deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting programme:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete programme',
      },
      { status: 500 }
    );
  }
}

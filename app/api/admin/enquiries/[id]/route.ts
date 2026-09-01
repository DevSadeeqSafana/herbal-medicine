import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch single enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
    });

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiry' },
      { status: 500 }
    );
  }
}

// PUT - Update enquiry (status, notes)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, repliedBy } = body;

    const existing = await prisma.enquiry.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      // If marking as replied, set the repliedAt timestamp
      if (status === 'replied' && existing.status !== 'replied') {
        updateData.repliedAt = new Date();
        if (repliedBy) {
          updateData.repliedBy = repliedBy;
        }
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const enquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: enquiry,
      message: 'Enquiry updated successfully',
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete enquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.enquiry.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    await prisma.enquiry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}

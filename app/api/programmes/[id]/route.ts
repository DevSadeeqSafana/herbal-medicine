import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const programme = await prisma.programme.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(programme);
  } catch (error) {
    console.error('Error fetching programme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programme' },
      { status: 500 }
    );
  }
}

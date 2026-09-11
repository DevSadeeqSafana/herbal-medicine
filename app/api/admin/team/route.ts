import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET - Fetch all team members (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: Prisma.TeamMemberWhereInput = {};

    if (isActive !== null && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { title: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
    });

    const stats = {
      total: await prisma.teamMember.count(),
      active: await prisma.teamMember.count({ where: { isActive: true } }),
      inactive: await prisma.teamMember.count({ where: { isActive: false } }),
    };

    return NextResponse.json({
      success: true,
      data: teamMembers,
      stats,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch team members',
      },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, title, bio, imageUrl, email, phone, department, linkedin, twitter, facebook, order, isActive } = body;

    if (!name || !title) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and title are required',
        },
        { status: 400 }
      );
    }

    // Get the max order value if not provided
    let memberOrder = order;
    if (memberOrder === undefined || memberOrder === null) {
      const maxOrder = await prisma.teamMember.aggregate({
        _max: { order: true },
      });
      memberOrder = (maxOrder._max.order ?? -1) + 1;
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        title,
        bio: bio || null,
        imageUrl: imageUrl || null,
        email: email || null,
        phone: phone || null,
        department: department || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        facebook: facebook || null,
        order: memberOrder,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: teamMember,
      message: 'Team member created successfully',
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create team member',
      },
      { status: 500 }
    );
  }
}

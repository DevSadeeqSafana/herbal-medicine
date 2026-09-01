import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch single team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!teamMember) {
      return NextResponse.json(
        {
          success: false,
          message: 'Team member not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch team member',
      },
      { status: 500 }
    );
  }
}

// PUT - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const existing = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Team member not found',
        },
        { status: 404 }
      );
    }

    const { name, title, bio, imageUrl, email, phone, department, linkedin, twitter, facebook, order, isActive } = body;

    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name: name ?? existing.name,
        title: title ?? existing.title,
        bio: bio !== undefined ? bio : existing.bio,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        email: email !== undefined ? email : existing.email,
        phone: phone !== undefined ? phone : existing.phone,
        department: department !== undefined ? department : existing.department,
        linkedin: linkedin !== undefined ? linkedin : existing.linkedin,
        twitter: twitter !== undefined ? twitter : existing.twitter,
        facebook: facebook !== undefined ? facebook : existing.facebook,
        order: order ?? existing.order,
        isActive: isActive ?? existing.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: teamMember,
      message: 'Team member updated successfully',
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update team member',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Team member not found',
        },
        { status: 404 }
      );
    }

    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete team member',
      },
      { status: 500 }
    );
  }
}

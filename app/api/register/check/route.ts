import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, programmeId } = body;

    if (!email || !programmeId) {
      return NextResponse.json(
        { error: 'Email and programme ID are required' },
        { status: 400 }
      );
    }

    // Check if email is already registered for this programme
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        email: email,
        programmeId: programmeId,
      },
      include: {
        programme: true,
      },
    });

    if (!existingRegistration) {
      return NextResponse.json({
        exists: false,
      });
    }

    // If user has already paid (COMPLETED status), return error
    if (existingRegistration.paymentStatus === 'COMPLETED') {
      return NextResponse.json({
        exists: true,
        paid: true,
        message: 'You have already registered and paid for this programme',
      });
    }

    // If user hasn't paid yet, return user data for prepopulation
    const existingPayment = await prisma.payment.findFirst({
      where: {
        registrationId: existingRegistration.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      exists: true,
      paid: false,
      userData: {
        programmeId: existingRegistration.programmeId,
        firstName: existingRegistration.firstName,
        lastName: existingRegistration.lastName,
        email: existingRegistration.email,
        phone: existingRegistration.phone,
        dateOfBirth: existingRegistration.dateOfBirth ? existingRegistration.dateOfBirth.toISOString().split('T')[0] : '',
        address: existingRegistration.address,
        city: existingRegistration.city,
        state: existingRegistration.state,
        country: existingRegistration.country,
        qualification: existingRegistration.qualification,
        institution: existingRegistration.institution || '',
      },
      paymentData: existingPayment
        ? {
            registrationId: existingRegistration.id,
            paymentId: existingPayment.id,
            transactionRef: existingPayment.transactionRef,
            amount: existingPayment.amount,
            programmeName: existingRegistration.programme.name,
            paymentStatus: existingPayment.status,
          }
        : null,
    });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json(
      { error: 'Failed to check registration. Please try again.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registrationSchema } from '@/lib/validations';
import { generateTransactionRef } from '@/lib/credo';
import { sendApplicationReceivedEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validationResult = registrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if programme exists
    const programme = await prisma.programme.findUnique({
      where: { id: data.programmeId },
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme not found' },
        { status: 404 }
      );
    }

    if (!programme.isActive) {
      return NextResponse.json(
        { error: 'This programme is not currently accepting registrations' },
        { status: 400 }
      );
    }

    // Check if email is already registered for this programme
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        email: data.email,
        programmeId: data.programmeId,
      },
      include: {
        programme: true,
      },
    });

    if (existingRegistration) {
      // If user has already paid (COMPLETED status), show error
      if (existingRegistration.paymentStatus === 'COMPLETED') {
        return NextResponse.json(
          { error: 'You have already registered and paid for this programme' },
          { status: 400 }
        );
      }

      // If user hasn't paid yet, get their payment record and return payment details
      const existingPayment = await prisma.payment.findFirst({
        where: {
          registrationId: existingRegistration.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingPayment) {
        return NextResponse.json({
          success: true,
          message: 'Registration already exists. Please complete your payment.',
          existingRegistration: true,
          data: {
            registrationId: existingRegistration.id,
            paymentId: existingPayment.id,
            transactionRef: existingPayment.transactionRef,
            amount: existingPayment.amount,
            programmeName: existingRegistration.programme.name,
            paymentStatus: existingPayment.status,
          },
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
        });
      }
    }

    // Determine current session (you can customize this logic)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const session = currentMonth >= 9
      ? `${currentYear}/${currentYear + 1}`
      : `${currentYear - 1}/${currentYear}`;

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        programmeId: data.programmeId,
        session: session,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        qualification: data.qualification,
        institution: data.institution || null,
        paymentStatus: 'PENDING',
        amountPaid: 0,
      },
      include: {
        programme: true,
      },
    });

    // Create payment record
    const transactionRef = generateTransactionRef();

    const payment = await prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount: programme.price,
        currency: 'NGN',
        status: 'PENDING',
        transactionRef: transactionRef,
      },
    });

    // Send application received confirmation email
    try {
      await sendApplicationReceivedEmail(
        registration.email,
        registration.firstName,
        programme.name,
        session,
        transactionRef
      );
      console.log('Application confirmation email sent to:', registration.email);
    } catch (emailError) {
      // Log error but don't fail the registration
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Registration created successfully',
      data: {
        registrationId: registration.id,
        paymentId: payment.id,
        transactionRef: transactionRef,
        amount: programme.price,
        programmeName: programme.name,
      },
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration. Please try again.' },
      { status: 500 }
    );
  }
}

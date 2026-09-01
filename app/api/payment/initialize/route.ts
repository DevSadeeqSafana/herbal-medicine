import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initializeCredoPayment } from '@/lib/credo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, transactionRef } = body;

    if (!registrationId || !transactionRef) {
      return NextResponse.json(
        { error: 'Registration ID and transaction reference are required' },
        { status: 400 }
      );
    }

    // Get registration with programme details
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { programme: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Get payment record
    const payment = await prisma.payment.findFirst({
      where: {
        registrationId: registrationId,
        transactionRef: transactionRef,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'This payment has already been completed' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Initialize payment with Credo
    const paymentResult = await initializeCredoPayment({
      amount: payment.amount,
      currency: payment.currency,
      transactionRef: payment.transactionRef,
      email: registration.email,
      callbackUrl: `${appUrl}/payment/verify?ref=${payment.transactionRef}`,
      metadata: {
        registrationId: registration.id,
        programmeName: registration.programme.name,
        studentName: `${registration.firstName} ${registration.lastName}`,
      },
    });

    if (!paymentResult.status || !paymentResult.data) {
      return NextResponse.json(
        { error: paymentResult.message || 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    // Update payment status to PROCESSING
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PROCESSING' },
    });

    // Store Credo reference in database
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        credoRef: paymentResult.data.credoReference,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        authorizationUrl: paymentResult.data.authorizationUrl,
        reference: paymentResult.data.reference,
        credoReference: paymentResult.data.credoReference,
        crn: paymentResult.data.crn,
      },
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    );
  }
}

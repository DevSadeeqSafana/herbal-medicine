import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyCredoPayment } from '@/lib/credo';
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionRef = searchParams.get('ref');

    if (!transactionRef) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { transactionRef },
      include: {
        registration: {
          include: {
            programme: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // If already completed, return success
    if (payment.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
        data: {
          status: 'COMPLETED',
          amount: payment.amount,
          transactionRef: payment.transactionRef,
          programmeName: payment.registration.programme.name,
          studentName: `${payment.registration.firstName} ${payment.registration.lastName}`,
        },
      });
    }

    // Verify payment with Credo
    const verificationResult = await verifyCredoPayment(transactionRef);

    if (!verificationResult.status) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      // Send payment failed email
      try {
        await sendPaymentFailedEmail(
          payment.registration.email,
          payment.registration.firstName,
          payment.registration.programme.name,
          payment.amount,
          payment.transactionRef,
          verificationResult.message
        );
        console.log('Payment failed email sent to:', payment.registration.email);
      } catch (emailError) {
        console.error('Failed to send payment failed email:', emailError);
      }

      return NextResponse.json(
        { error: verificationResult.message || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update payment and registration status
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          credoRef: verificationResult.data?.reference || null,
          paymentMethod: verificationResult.data?.paymentMethod || null,
        },
      }),
      prisma.registration.update({
        where: { id: payment.registrationId },
        data: {
          paymentStatus: 'COMPLETED',
          amountPaid: payment.amount,
        },
      }),
    ]);

    // Send payment success email
    try {
      await sendPaymentSuccessEmail(
        payment.registration.email,
        payment.registration.firstName,
        payment.registration.programme.name,
        payment.amount,
        payment.transactionRef
      );
      console.log('Payment success email sent to:', payment.registration.email);
    } catch (emailError) {
      console.error('Failed to send payment success email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        status: 'COMPLETED',
        amount: payment.amount,
        transactionRef: payment.transactionRef,
        programmeName: payment.registration.programme.name,
        studentName: `${payment.registration.firstName} ${payment.registration.lastName}`,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment. Please try again.' },
      { status: 500 }
    );
  }
}

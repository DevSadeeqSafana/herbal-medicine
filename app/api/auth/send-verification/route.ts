import { NextRequest, NextResponse } from 'next/server';
import { createEmailVerification } from '@/lib/verification';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    const validation = emailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Create verification and send email
    const result = await createEmailVerification(email);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error: unknown) {
    console.error('Send verification error:', error);

    const message = error instanceof Error ? error.message : 'An error occurred. Please try again.';
    const databaseMessage = message.includes("Can't reach database") || message.includes('P1001');

    if (databaseMessage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured. Please update DATABASE_URL in .env.local and run: npx prisma db push',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

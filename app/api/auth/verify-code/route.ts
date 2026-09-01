import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailCode } from '@/lib/verification';
import { encrypt } from '@/lib/crypto';
import { z } from 'zod';

const verifySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { email, code } = validation.data;

    // Verify the code
    const result = await verifyEmailCode(email, code);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          attemptsRemaining: result.attemptsRemaining,
        },
        { status: 400 }
      );
    }

    // Code verified successfully - create encrypted cookie
    const cookieSalt = process.env.COOKIE_SALT;
    if (!cookieSalt) {
      console.error('COOKIE_SALT not configured');
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    // Create cookie data with email and timestamp
    const cookieData = JSON.stringify({
      email: email.toLowerCase(),
      verifiedAt: new Date().toISOString(),
    });

    const encryptedCookie = encrypt(cookieData, cookieSalt);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });

    // Set secure cookie (expires in 1 hour)
    // Note: httpOnly is false to allow client-side reading for email verification flow
    response.cookies.set('email_verified', encryptedCookie, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

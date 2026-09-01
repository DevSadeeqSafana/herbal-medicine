import { prisma } from './prisma';
import { generateVerificationCode, hashCode } from './crypto';
import { sendVerificationEmail } from './email';

const VERIFICATION_CODE_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;

interface VerificationResult {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
}

/**
 * Creates a new email verification record and sends the code via email
 */
export async function createEmailVerification(
  email: string
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    // Generate 6-digit code
    const code = generateVerificationCode();
    const hashedCode = hashCode(code);

    // Set expiry time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + VERIFICATION_CODE_EXPIRY_MINUTES);

    // Delete any existing unverified codes for this email
    await prisma.emailVerification.deleteMany({
      where: {
        email: email.toLowerCase(),
        verified: false,
      },
    });

    // Create new verification record
    await prisma.emailVerification.create({
      data: {
        email: email.toLowerCase(),
        code: hashedCode,
        expiresAt,
        verified: false,
        attempts: 0,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, code);

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.error || 'Failed to send verification email',
      };
    }

    return {
      success: true,
      message: 'Verification code sent successfully',
      code, // For development/testing - remove in production
    };
  } catch (error) {
    console.error('Error creating email verification:', error);
    return {
      success: false,
      message: 'Failed to create verification. Please try again.',
    };
  }
}

/**
 * Verifies the provided code against the stored hashed code
 */
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<VerificationResult> {
  try {
    // Find the verification record
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return {
        success: false,
        message: 'No verification request found. Please request a new code.',
      };
    }

    // Check if code has expired
    if (new Date() > verification.expiresAt) {
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    // Check if max attempts exceeded
    if (verification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new code.',
      };
    }

    // Hash the provided code and compare
    const hashedCode = hashCode(code);

    if (hashedCode !== verification.code) {
      // Increment attempts
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { attempts: verification.attempts + 1 },
      });

      const attemptsRemaining = MAX_VERIFICATION_ATTEMPTS - (verification.attempts + 1);

      return {
        success: false,
        message: 'Invalid verification code. Please try again.',
        attemptsRemaining: Math.max(0, attemptsRemaining),
      };
    }

    // Code is correct - mark as verified
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    });

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch (error) {
    console.error('Error verifying email code:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.',
    };
  }
}

/**
 * Checks if an email has been verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        verified: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return false;
    }

    // Check if verification is still valid (within 24 hours)
    const validityPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isStillValid =
      new Date().getTime() - verification.createdAt.getTime() < validityPeriod;

    return isStillValid;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
}

/**
 * Resends verification code to the email address
 */
export async function resendVerificationCode(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check for existing recent verification
    const recentVerification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Rate limiting: Don't allow resend within 1 minute
    if (recentVerification) {
      const timeSinceCreation =
        new Date().getTime() - recentVerification.createdAt.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceCreation < oneMinute) {
        const secondsRemaining = Math.ceil((oneMinute - timeSinceCreation) / 1000);
        return {
          success: false,
          message: `Please wait ${secondsRemaining} seconds before requesting a new code.`,
        };
      }
    }

    // Create new verification
    const result = await createEmailVerification(email);

    return result;
  } catch (error) {
    console.error('Error resending verification code:', error);
    return {
      success: false,
      message: 'Failed to resend code. Please try again.',
    };
  }
}

/**
 * Cleans up expired verification records (call periodically)
 */
export async function cleanupExpiredVerifications(): Promise<void> {
  try {
    await prisma.emailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        verified: false,
      },
    });
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error);
  }
}

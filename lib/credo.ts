// Credo Payment Gateway Integration
// Documentation: https://developers.credocentral.com/

export interface CredoPaymentData {
  amount: number;
  currency: string;
  transactionRef: string;
  email: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface CredoPaymentResponse {
  status: boolean;
  message: string;
  data?: {
    authorizationUrl: string;
    reference: string;
    credoReference: string;
    crn: string;
  };
}

/**
 * Initialize Credo payment
 * This creates a payment session and returns an authorization URL
 */
export async function initializeCredoPayment(
  paymentData: CredoPaymentData
): Promise<CredoPaymentResponse> {
  try {
    const credoPublicKey = process.env.NEXT_PUBLIC_CREDO_PUBLIC_KEY;
    const credoApiUrl = process.env.CREDO_API_URL || 'https://api.credodemo.com';

    if (!credoPublicKey) {
      throw new Error('Credo public key not configured');
    }

    // Credo API endpoint for payment initialization
    const CREDO_API_URL = `${credoApiUrl}/transaction/initialize`;

    // Convert amount to kobo (lowest currency unit - multiply by 100)
    const amountInKobo = Math.round(paymentData.amount * 100);

    console.log('[CREDO] Initializing payment:', {
      amount: paymentData.amount,
      amountInKobo,
      email: paymentData.email,
      reference: paymentData.transactionRef,
    });

    const response = await fetch(CREDO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': credoPublicKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInKobo,
        currency: paymentData.currency,
        reference: paymentData.transactionRef,
        email: paymentData.email,
        callbackUrl: paymentData.callbackUrl,
        metadata: paymentData.metadata,
      }),
    });

    const data = await response.json();

    console.log('[CREDO] API Response:', {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      console.error('[CREDO] Payment initialization failed:', data);
      throw new Error(data.message || 'Failed to initialize payment');
    }

    return {
      status: true,
      message: 'Payment initialized successfully',
      data: {
        authorizationUrl: data.data.authorizationUrl,
        reference: data.data.reference,
        credoReference: data.data.credoReference,
        crn: data.data.Crn,
      },
    };
  } catch (error) {
    console.error('[CREDO] Payment initialization error:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Payment initialization failed',
    };
  }
}

/**
 * Verify Credo payment
 * This checks the status of a payment transaction
 */
export async function verifyCredoPayment(
  transactionRef: string
): Promise<{
  status: boolean;
  message: string;
  data?: any;
}> {
  try {
    const credoSecretKey = process.env.CREDO_SECRET_KEY;
    const credoApiUrl = process.env.CREDO_API_URL || 'https://api.credodemo.com';

    if (!credoSecretKey) {
      throw new Error('Credo secret key not configured');
    }

    // Credo API endpoint for payment verification
    const CREDO_API_URL = `${credoApiUrl}/transaction/${transactionRef}/verify`;

    console.log('[CREDO] Verifying payment:', {
      transactionRef,
      endpoint: CREDO_API_URL,
    });

    const response = await fetch(CREDO_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': credoSecretKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('[CREDO] Verification response:', {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      console.error('[CREDO] Payment verification failed:', data);
      throw new Error(data.message || 'Failed to verify payment');
    }

    return {
      status: true,
      message: 'Payment verified successfully',
      data: data.data,
    };
  } catch (error) {
    console.error('[CREDO] Payment verification error:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/**
 * Generate unique transaction reference
 */
export function generateTransactionRef(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `CU-HERBAL-${timestamp}-${random}`.toUpperCase();
}

'use client';

import MainLayout from '@/components/MainLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionRef = searchParams.get('ref');

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!transactionRef) {
      setStatus('failed');
      setErrorMessage('Invalid transaction reference');
      return;
    }

    // Verify payment
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify?ref=${transactionRef}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setPaymentData(data.data);
        } else {
          setStatus('failed');
          setErrorMessage(data.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
        setErrorMessage('An error occurred while verifying payment');
      }
    };

    verifyPayment();
  }, [transactionRef]);

  return (
    <MainLayout>
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {status === 'loading' && (
              <div className="card p-12 text-center">
                <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Verifying Payment...</h2>
                <p className="text-gray-600">Please wait while we confirm your payment</p>
              </div>
            )}

            {status === 'success' && (
              <div className="card p-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Payment Successful!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your registration. Your payment has been confirmed.
                </p>

                {paymentData && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Payment Details</h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span>Programme:</span>
                        <span className="font-medium">{paymentData.programmeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Student:</span>
                        <span className="font-medium">{paymentData.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Paid:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(paymentData.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction Ref:</span>
                        <span className="font-medium text-sm">{paymentData.transactionRef}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary-800">
                    <strong>What&apos;s Next?</strong><br />
                    You will receive a confirmation email with further instructions and programme details.
                    Our admissions team will contact you within 24-48 hours.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/programmes" className="btn-primary block">
                    View Other Programmes
                  </Link>
                  <Link href="/" className="btn-secondary block">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="card p-12 text-center">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Payment Failed</h2>
                <p className="text-lg text-gray-600 mb-6">
                  {errorMessage || 'We could not verify your payment. Please try again.'}
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Need Help?</strong><br />
                    If you have been charged but see this error, please contact our support team
                    with your transaction reference: <strong>{transactionRef}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/register" className="btn-primary block">
                    Try Again
                  </Link>
                  <Link href="/contact" className="btn-secondary block">
                    Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

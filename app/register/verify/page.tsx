'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Leaf, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function VerifyCodePage() {
  const router = useRouter();
  const params = typeof window === 'undefined' ? new URLSearchParams('') : new URLSearchParams(window.location.search);
  const email = params.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  // Refs for each input box
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Redirect to email page if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/register/email');
    }
  }, [email, router]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    // Handle left/right arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs[5].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setAttemptsRemaining(null);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Email verified successfully!');
        // Navigate to registration form
        router.push('/register');
      } else {
        toast.error(data.message || 'Invalid verification code');

        // Show attempts remaining if provided
        if (typeof data.attemptsRemaining === 'number') {
          setAttemptsRemaining(data.attemptsRemaining);
        }

        // Clear the code inputs
        setCode(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resending) return;

    setResending(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('New verification code sent!');
        setCode(['', '', '', '', '', '']);
        setAttemptsRemaining(null);
        inputRefs[0].current?.focus();
      } else {
        toast.error(data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Error resending code:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-green-700 to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <AnimatedSection direction="fade">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="bg-white p-3 rounded-lg group-hover:scale-105 transition-transform">
                <Leaf className="w-10 h-10 text-primary-700" />
              </div>
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-white drop-shadow-lg">
              Cosmopolitan University
            </h1>
            <p className="mt-2 text-primary-100 drop-shadow-md">
              Herbal Medicine Programmes
            </p>
          </div>
        </AnimatedSection>

        {/* Verification Card */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-primary-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit code sent to
            </p>
            <p className="mt-1 text-sm font-semibold text-primary-600">{email}</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Code Input Boxes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Verification Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Attempts Remaining Warning */}
            {attemptsRemaining !== null && attemptsRemaining > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>⚠️ {attemptsRemaining}</strong> attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                </p>
              </div>
            )}

            {/* Max Attempts Warning */}
            {attemptsRemaining === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 text-center">
                  Maximum attempts exceeded. Please request a new code.
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-xs text-primary-700 text-center">
                The code will expire in <strong>10 minutes</strong>. Didn&apos;t receive it?
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || code.join('').length !== 6}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>

            {/* Resend Code Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors inline-flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>
        </AnimatedSection>

        {/* Back to Email */}
        <AnimatedSection delay={0.3}>
          <div className="mt-6 text-center">
          <Link
            href="/register/email"
            className="text-sm text-white hover:text-primary-100 transition-colors inline-flex items-center"
          >
            <span className="mr-2">←</span>
            Change Email Address
          </Link>
        </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

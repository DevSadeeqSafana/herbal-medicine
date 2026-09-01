'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Leaf } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export default function EmailInputPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Verification code sent to your email!');
        // Navigate to verification page with email in query
        router.push(`/register/verify?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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

        {/* Email Input Card */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-primary-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Start Your Registration</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address to receive a verification code
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-sm text-primary-800">
                <strong>What happens next?</strong>
              </p>
              <ol className="mt-2 text-sm text-primary-700 space-y-1 list-decimal list-inside">
                <li>We&apos;ll send a 6-digit code to your email</li>
                <li>Enter the code to verify your email</li>
                <li>Complete your registration form</li>
                <li>Proceed to payment</li>
              </ol>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
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
                    Sending Code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have a verification code?{' '}
              <button
                onClick={() => {
                  if (email) {
                    router.push(`/register/verify?email=${encodeURIComponent(email)}`);
                  } else {
                    toast.error('Please enter your email address first');
                  }
                }}
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Enter code
              </button>
            </p>
          </div>
        </div>
        </AnimatedSection>

        {/* Back to Home */}
        <AnimatedSection delay={0.3}>
          <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white hover:text-primary-100 transition-colors inline-flex items-center"
          >
            <span className="mr-2">←</span>
            Back to Home
          </Link>
        </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

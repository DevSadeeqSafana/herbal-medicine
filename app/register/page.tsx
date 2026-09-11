'use client';

import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { Programme } from '@/types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { registrationSchema } from '@/lib/validations';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, UserCircle, MapPin, GraduationCap, ShieldAlert } from 'lucide-react';
import { decrypt } from '@/lib/crypto';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type ExistingUserData = {
  programmeId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  qualification?: string;
  institution?: string;
};

async function fetchProgrammes(): Promise<Programme[]> {
  const response = await fetch('/api/programmes');
  if (!response.ok) throw new Error('Failed to fetch programmes');
  return response.json();
}

export default function RegisterPage() {
  const router = useRouter();
  const params = typeof window === 'undefined' ? new URLSearchParams('') : new URLSearchParams(window.location.search);
  const preSelectedProgrammeId = params.get('programmeId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentStep = 1;
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const [existingUserData, setExistingUserData] = useState<ExistingUserData | null>(null);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(false);

  // Check for email verification cookie on mount
  useEffect(() => {
    const checkVerification = () => {
      try {
        // Get cookie value (client-side)
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('email_verified='))
          ?.split('=')[1];

        if (!cookieValue) {
          // No verification cookie found - silently redirect to email input
          router.push('/register/email');
          return;
        }

        // Decrypt the cookie
        const cookieSalt = process.env.NEXT_PUBLIC_COOKIE_SALT;
        if (!cookieSalt) {
          console.error('NEXT_PUBLIC_COOKIE_SALT not configured');
          router.push('/register/email');
          return;
        }

        const decryptedData = decrypt(decodeURIComponent(cookieValue), cookieSalt);
        const cookieData = JSON.parse(decryptedData);

        // Check if verification is still valid (within 1 hour)
        const verifiedAt = new Date(cookieData.verifiedAt);
        const oneHour = 60 * 60 * 1000;
        const isValid = new Date().getTime() - verifiedAt.getTime() < oneHour;

        if (!isValid) {
          // Verification expired - silently redirect to email input
          router.push('/register/email');
          return;
        }

        // Verification valid - set email
        setVerifiedEmail(cookieData.email);
        setIsCheckingVerification(false);
      } catch (error) {
        console.error('Error checking verification:', error);
        // Invalid cookie - silently redirect to email input
        router.push('/register/email');
      }
    };

    checkVerification();
  }, [router]);

  // Check for existing registration data after email verification
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (!verifiedEmail || !preSelectedProgrammeId) return;

      setIsLoadingExistingData(true);
      try {
        const response = await fetch('/api/register/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: verifiedEmail,
            programmeId: preSelectedProgrammeId,
          }),
        });

        const data = await response.json();

        if (data.exists && !data.paid && data.userData) {
          setExistingUserData(data.userData);
          toast.info('We found your previous registration. Form has been prepopulated.');
        } else if (data.exists && data.paid) {
          toast.warning(data.message);
        }
      } catch (error) {
        console.error('Error checking existing registration:', error);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    checkExistingRegistration();
  }, [verifiedEmail, preSelectedProgrammeId]);

  const { data: programmes, isLoading } = useQuery<Programme[]>({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);

    try {
      // Step 1: Create registration
      const registrationResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const registrationData = await registrationResponse.json();

      if (!registrationResponse.ok) {
        toast.error(registrationData.error || 'Registration failed');
        setIsSubmitting(false);
        return;
      }

      toast.success('Registration successful! Initializing payment...');

      // Step 2: Initialize payment
      const paymentResponse = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registrationData.data.registrationId,
          transactionRef: registrationData.data.transactionRef,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        toast.error(paymentData.error || 'Payment initialization failed');
        setIsSubmitting(false);
        return;
      }

      // Redirect to Credo payment page
      if (paymentData.data?.authorizationUrl) {
        window.location.href = paymentData.data.authorizationUrl;
      } else {
        toast.error('Payment URL not received');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show loading while checking verification
  if (isCheckingVerification || isLoading || isLoadingExistingData) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="mt-4 text-gray-600">
            {isCheckingVerification ? 'Verifying your email...' : isLoadingExistingData ? 'Checking for existing registration...' : 'Loading programmes...'}
          </p>
        </div>
      </MainLayout>
    );
  }

  // If no verified email (shouldn't happen due to useEffect redirect, but safety check)
  if (!verifiedEmail) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center py-20">
          <ShieldAlert className="w-16 h-16 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification Required</h2>
          <p className="text-gray-600 mb-6">Please verify your email to continue registration</p>
          <button
            onClick={() => router.push('/register/email')}
            className="btn-primary"
          >
            Verify Email
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Register Now</h1>
            <p className="text-xl text-primary-100">
              Start your journey in herbal medicine education
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                    {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
                  </div>
                  <span className="ml-2 hidden md:inline font-medium">Personal Info</span>
                </div>
                <div className="w-16 h-1 bg-gray-300"></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                    {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
                  </div>
                  <span className="ml-2 hidden md:inline font-medium">Address & Education</span>
                </div>
                <div className="w-16 h-1 bg-gray-300"></div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                    3
                  </div>
                  <span className="ml-2 hidden md:inline font-medium">Payment</span>
                </div>
              </div>
            </div>

            {/* Email Verification Success Banner */}
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-semibold text-green-800">Email Verified Successfully</p>
                <p className="text-xs text-green-700">{verifiedEmail}</p>
              </div>
            </div>

            {/* Prepopulated Data Banner */}
            {existingUserData && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                <UserCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Previous Registration Found</p>
                  <p className="text-xs text-blue-700">Your form has been prepopulated with your previous information. Please review and proceed to payment.</p>
                </div>
              </div>
            )}

            <div className="card p-8">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  programmeId: existingUserData?.programmeId || preSelectedProgrammeId || '',
                  firstName: existingUserData?.firstName || '',
                  lastName: existingUserData?.lastName || '',
                  email: verifiedEmail || '',
                  phone: existingUserData?.phone || '',
                  dateOfBirth: existingUserData?.dateOfBirth || '',
                  address: existingUserData?.address || '',
                  city: existingUserData?.city || '',
                  state: existingUserData?.state || '',
                  country: existingUserData?.country || 'Nigeria',
                  qualification: existingUserData?.qualification || '',
                  institution: existingUserData?.institution || '',
                }}
                validationSchema={toFormikValidationSchema(registrationSchema)}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values }) => (
                  <Form className="space-y-6">
                    {/* Programme Selection */}
                    <div>
                      <label htmlFor="programmeId" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Programme *
                      </label>
                      <Field
                        as="select"
                        id="programmeId"
                        name="programmeId"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.programmeId && touched.programmeId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">-- Select a Programme --</option>
                        {programmes?.map((programme) => (
                          <option key={programme.id} value={programme.id}>
                            {programme.name} - {formatCurrency(programme.price)} ({programme.duration})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="programmeId" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Personal Information Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                        <UserCircle className="w-5 h-5 mr-2 text-primary-600" />
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <Field
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="John"
                          />
                          <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <Field
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Doe"
                          />
                          <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address * <span className="text-green-600 text-xs">(Verified)</span>
                          </label>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
                            placeholder="john@example.com"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <Field
                            type="tel"
                            id="phone"
                            name="phone"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="+234 XXX XXX XXXX"
                          />
                          <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth *
                          </label>
                          <Field
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.dateOfBirth && touched.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                        Address Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <Field
                            type="text"
                            id="address"
                            name="address"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123 Main Street"
                          />
                          <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <Field
                            type="text"
                            id="city"
                            name="city"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Abuja"
                          />
                          <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <Field
                            type="text"
                            id="state"
                            name="state"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="FCT"
                          />
                          <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <Field
                            type="text"
                            id="country"
                            name="country"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.country && touched.country ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nigeria"
                          />
                          <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Educational Background Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
                        Educational Background
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                            Highest Qualification *
                          </label>
                          <Field
                            type="text"
                            id="qualification"
                            name="qualification"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.qualification && touched.qualification ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., SSCE, BSc, HND"
                          />
                          <ErrorMessage name="qualification" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                            Institution (Optional)
                          </label>
                          <Field
                            type="text"
                            id="institution"
                            name="institution"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., University of Lagos"
                          />
                          <ErrorMessage name="institution" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Selected Programme Info */}
                    {values.programmeId && programmes && (
                      <div className="border-t pt-6">
                        <div className="bg-primary-50 rounded-lg p-6">
                          <h3 className="font-semibold text-lg mb-3 text-gray-800">Selected Programme</h3>
                          {(() => {
                            const selectedProgramme = programmes.find(p => p.id === values.programmeId);
                            if (selectedProgramme) {
                              return (
                                <div>
                                  <p className="text-gray-700 mb-2"><strong>{selectedProgramme.name}</strong></p>
                                  <p className="text-gray-600 mb-2">Duration: {selectedProgramme.duration}</p>
                                  <p className="text-primary-700 font-bold text-xl">
                                    Fee: {formatCurrency(selectedProgramme.price)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="border-t pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Proceed to Payment'
                        )}
                      </button>
                      <p className="text-sm text-gray-500 text-center mt-4">
                        By registering, you agree to our terms and conditions
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

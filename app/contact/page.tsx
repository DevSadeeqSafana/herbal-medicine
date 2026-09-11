'use client';

import MainLayout from '@/components/MainLayout';
import AnimatedSection from '@/components/AnimatedSection';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useState } from 'react';

const contactSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .min(10, 'Phone number must be at least 10 digits')
    .optional(),
  subject: Yup.string()
    .min(3, 'Subject must be at least 3 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Message sent successfully!');
        resetForm();
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="fade">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-primary-100">
                Get in touch with us. We&apos;re here to help and answer any questions you may have.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <AnimatedSection delay={0.1}>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Get In Touch</h2>
                  <p className="text-gray-600 mb-8">
                    Have questions about our herbal medicine programmes? Want to learn more about
                    Zee&apos;s Herbal Pharmacy partnership? Reach out to us using the contact information
                    below or fill out the contact form.
                  </p>
                </AnimatedSection>

                <div className="space-y-6">
                  {/* Address */}
                  <AnimatedSection delay={0.2}>
                    <div className="card p-6">
                      <div className="flex items-start">
                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                          <MapPin className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-gray-800">Address</h3>
                          <p className="text-gray-600">
                            Amma House, Plot 432, Yakubu J. Pam Street,
                            <br />
                            Opposite National Hospital, Central Business District,
                            <br />
                            Abuja, Nigeria
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Phone */}
                  <AnimatedSection delay={0.3}>
                    <div className="card p-6">
                      <div className="flex items-start">
                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                          <Phone className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-gray-800">Phone</h3>
                          <p className="text-gray-600">
                            +234 806 559 0444
                            <br />
                            +234 805 208 0828
                            <br />
                            +234 815 981 0601
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Email */}
                  <AnimatedSection delay={0.4}>
                    <div className="card p-6">
                      <div className="flex items-start">
                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                          <Mail className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-gray-800">Email</h3>
                          <p className="text-gray-600">
                            info@cosmopolitan.edu.ng
                            <br />
                            Website: www.cosmopolitan.edu.ng
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Office Hours */}
                  <AnimatedSection delay={0.5}>
                    <div className="card p-6">
                      <div className="flex items-start">
                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                          <Clock className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-gray-800">Office Hours</h3>
                          <p className="text-gray-600">
                            Monday - Friday: 8:00 AM - 5:00 PM
                            <br />
                            Saturday: 9:00 AM - 2:00 PM
                            <br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>

              {/* Contact Form */}
              <AnimatedSection delay={0.2}>
                <div className="card p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>

                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                  }}
                  validationSchema={contactSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="john@example.com"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number (Optional)
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
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject *
                        </label>
                        <Field
                          type="text"
                          id="subject"
                          name="subject"
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.subject && touched.subject ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Programme Inquiry"
                        />
                        <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message *
                        </label>
                        <Field
                          as="textarea"
                          id="message"
                          name="message"
                          rows={5}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.message && touched.message ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Tell us how we can help you..."
                        />
                        <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Find Us</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-primary-600" />
                  <p className="font-semibold">Map Location</p>
                  <p className="text-sm">Embed Google Maps or other map service here</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

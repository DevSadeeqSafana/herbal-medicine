'use client';

import MainLayout from '@/components/MainLayout';
import AnimatedSection from '@/components/AnimatedSection';
import { useQuery } from '@tanstack/react-query';
import { Programme } from '@/types';
import { Clock, DollarSign, BookOpen, Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';

async function fetchProgrammes(): Promise<Programme[]> {
  const response = await fetch('/api/programmes');
  if (!response.ok) {
    throw new Error('Failed to fetch programmes');
  }
  return response.json();
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  const curriculum = JSON.parse(programme.curriculum) as string[];

  return (
    <div className="card">
      <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
        <Leaf className="w-20 h-20 text-white opacity-80" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{programme.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{programme.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-sm">Duration: {programme.duration}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-sm font-semibold">
              ₦{programme.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-sm">{curriculum.length} Modules</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Curriculum Highlights:</h4>
          <ul className="space-y-1 mb-4">
            {curriculum.slice(0, 3).map((module, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>{module}</span>
              </li>
            ))}
            {curriculum.length > 3 && (
              <li className="text-sm text-gray-500 italic">
                +{curriculum.length - 3} more modules
              </li>
            )}
          </ul>
        </div>

        <Link
          href={`/programmes/${programme.id}`}
          className="block text-center btn-primary w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function ProgrammesPage() {
  const { data: programmes, isLoading, error } = useQuery<Programme[]>({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="fade">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programmes</h1>
              <p className="text-xl text-primary-100">
                Choose from our range of comprehensive herbal medicine programmes designed
                to fit your goals and schedule
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <p className="text-red-800 font-semibold mb-2">Error Loading Programmes</p>
                <p className="text-red-600">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
                <p className="text-sm text-red-500 mt-4">
                  Please ensure the database is properly configured and seeded.
                </p>
              </div>
            </div>
          )}

          {programmes && programmes.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
                <Leaf className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <p className="text-yellow-800 font-semibold mb-2">No Programmes Available</p>
                <p className="text-yellow-600">
                  Please check back later or contact us for more information.
                </p>
              </div>
            </div>
          )}

          {programmes && programmes.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programmes.map((programme, index) => (
                <AnimatedSection key={programme.id} delay={index * 0.1}>
                  <ProgrammeCard programme={programme} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection direction="fade">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step toward becoming a certified herbal medicine practitioner.
              Register for a programme today!
            </p>
            <Link href="/register/email" className="btn-primary inline-block">
              Register Now
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}

'use client';

import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { Programme } from '@/types';
import { Clock, DollarSign, BookOpen, Leaf, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

async function fetchProgramme(id: string): Promise<Programme> {
  const response = await fetch(`/api/programmes/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch programme');
  }
  return response.json();
}

export default function ProgrammeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: programme, isLoading, error } = useQuery<Programme>({
    queryKey: ['programme', id],
    queryFn: () => fetchProgramme(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !programme) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <p className="text-red-800 font-semibold mb-2">Programme Not Found</p>
              <p className="text-red-600 mb-4">
                The programme you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link href="/programmes" className="btn-primary inline-block">
                View All Programmes
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const curriculum = JSON.parse(programme.curriculum) as string[];

  return (
    <MainLayout>
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/programmes"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programmes
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Leaf className="w-16 h-16 text-primary-200" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              {programme.name}
            </h1>
            <p className="text-xl text-primary-100 text-center mb-8">
              {programme.description}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm text-primary-100">Duration</div>
                <div className="font-semibold text-lg">{programme.duration}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm text-primary-100">Programme Fee</div>
                <div className="font-semibold text-lg">₦{programme.price.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm text-primary-100">Modules</div>
                <div className="font-semibold text-lg">{curriculum.length} Modules</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Curriculum */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <BookOpen className="w-6 h-6 text-primary-600 mr-2" />
                  Curriculum
                </h2>
                <ul className="space-y-3">
                  {curriculum.map((module, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{module}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You'll Learn */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">What You&apos;ll Learn</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Comprehensive understanding of herbal medicine principles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Practical skills in plant identification and preparation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Patient assessment and treatment planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Safety protocols and contraindications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Professional ethics and practice management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Integration with modern healthcare systems</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Programme Features */}
            <div className="card p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Programme Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary-700">Learning Format</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• In-person lectures and workshops</li>
                    <li>• Hands-on laboratory sessions</li>
                    <li>• Field trips to botanical gardens</li>
                    <li>• Clinical observation opportunities</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary-700">Certification</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Recognized certificate upon completion</li>
                    <li>• Continuous assessment throughout</li>
                    <li>• Final examination and practical test</li>
                    <li>• Alumni network access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Entry Requirements */}
            <div className="card p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Entry Requirements</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Minimum of secondary school certificate (SSCE/GCE)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Interest in herbal medicine and natural healing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Proficiency in English language</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Commitment to complete the programme duration</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Enroll?</h2>
              <p className="text-lg text-primary-100 mb-6">
                Join this programme and start your journey toward becoming a certified herbal medicine practitioner.
              </p>
              <Link
                href={`/register?programmeId=${programme.id}`}
                className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 inline-block shadow-lg hover:shadow-xl"
              >
                Register for This Programme
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

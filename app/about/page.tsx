import MainLayout from '@/components/MainLayout';
import AnimatedSection from '@/components/AnimatedSection';
import Image from 'next/image';
import { GraduationCap, Target, Eye, Award, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/IMG-20260901-WA0008.webp"
            alt="MOU signing event"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection direction="fade">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">About Us</h1>
              <p className="text-xl text-primary-100 drop-shadow-md">
                Pioneering Excellence in Herbal Medicine Education
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cosmopolitan University Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="text-center mb-12">
                <GraduationCap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h2 className="section-title text-center inline-block">
                  Cosmopolitan University Abuja
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Cosmopolitan University Abuja is a university of higher learning focused on delivering
                  practical, research-informed education for African healthcare and community development.
                  Its partnership with Zee&apos;s Herbal Pharmacy expands the university&apos;s herbal medicine
                  capacity through blended delivery, practical field learning, and Nigerian medicinal plant
                  practice.
                </p>

                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  The herbal medicine courses emphasise indigenous knowledge systems, medicinal plant
                  identification, formulation, safety, herbal pharmacology, modern evidence-based practice,
                  and the integration of herbal medicine into primary healthcare and nursing practice.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <AnimatedSection delay={0.3}>
                <div className="card p-6 text-center flex flex-col h-full">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary-700" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Accredited</h3>
                  <p className="text-sm text-gray-600 flex-grow">
                    Fully accredited by Nigerian regulatory bodies
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="card p-6 text-center flex flex-col h-full">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-700" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Expert Faculty</h3>
                  <p className="text-sm text-gray-600 flex-grow">
                    Experienced lecturers and industry practitioners
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <div className="card p-6 text-center flex flex-col h-full">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-700" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Modern Facilities</h3>
                  <p className="text-sm text-gray-600 flex-grow">
                    State-of-the-art learning and research facilities
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection direction="left" delay={0.1}>
                <div className="card p-8 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Eye className="w-10 h-10 text-primary-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-grow">
                    To be Africa&apos;s leading institution for herbal medicine education, producing
                    world-class practitioners who integrate traditional healing wisdom with contemporary
                    scientific knowledge to advance global healthcare.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.2}>
                <div className="card p-8 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Target className="w-10 h-10 text-primary-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-grow">
                    To provide comprehensive, research-based herbal medicine education that empowers
                    students with practical skills, ethical practice standards, and deep understanding
                    of both traditional and modern healing approaches.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* The Partnership */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="section-title text-center inline-block">
                  Our Partnership with Zee&apos;s Herbal Pharmacy
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card p-8 border-t-4 border-primary-600">
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  The collaboration between Cosmopolitan University and Zee&apos;s Herbal Pharmacy creates
                  a unique educational ecosystem where academic rigor meets practical expertise. This
                  partnership brings together the university&apos;s educational infrastructure with
                  Zee&apos;s Herbal Pharmacy&apos;s three decades of industry experience.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-primary-700">What This Partnership Offers:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Hands-on Training:</strong> Direct access to Zee&apos;s Herbal Pharmacy facilities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Industry Mentorship:</strong> Learn from practicing herbalists</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Research Opportunities:</strong> Participate in ongoing herbal research</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Real Product Development:</strong> Experience in formulating herbal remedies</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Clinical Practice:</strong> Supervised patient interactions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Botanical Gardens:</strong> Hands-on plant identification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Quality Control Training:</strong> Learn pharmaceutical standards</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span><strong>Business Skills:</strong> Practice management insights</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="section-title text-center mb-12">Why Choose Our Programmes?</h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: '01', title: 'Comprehensive Curriculum', desc: 'Cover everything from basic principles to advanced clinical practice', delay: 0.1 },
                { num: '02', title: 'Practical Experience', desc: 'Extensive hands-on training in real pharmacy and clinical settings', delay: 0.15 },
                { num: '03', title: 'Recognized Certification', desc: 'Receive internationally recognized certificates upon completion', delay: 0.2 },
                { num: '04', title: 'Flexible Learning', desc: 'Multiple programme durations to fit your schedule and goals', delay: 0.25 },
                { num: '05', title: 'Career Support', desc: 'Guidance for starting your own practice or joining healthcare teams', delay: 0.3 },
                { num: '06', title: 'Ongoing Community', desc: 'Join a network of alumni and practitioners for continued learning', delay: 0.35 },
              ].map((item) => (
                <AnimatedSection key={item.num} delay={item.delay}>
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="text-primary-600 font-bold text-lg mb-2">{item.num}</div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection direction="fade">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-primary-100">
              Explore our programmes and take the first step toward becoming a certified herbal medicine practitioner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/programmes" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300">
                View Programmes
              </a>
              <a href="/register/email" className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white transition-all duration-300">
                Register Now
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}

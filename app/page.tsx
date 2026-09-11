'use client';

import MainLayout from '@/components/MainLayout';
import HeroSlider from '@/components/HeroSlider';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedCounter from '@/components/AnimatedCounter';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Award, BookOpen, Users, Heart, TrendingUp, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <MainLayout>
      <HeroSlider />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              Our Impact in Numbers
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <AnimatedSection delay={0.1}>
              <AnimatedCounter end={40} suffix="+" label="Certified Graduates" icon={<Users className="w-8 h-8 text-primary-700" />} />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <AnimatedCounter end={30} suffix="+" label="Years of Excellence" icon={<Award className="w-8 h-8 text-primary-700" />} />
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <AnimatedCounter end={5} suffix="" label="Certificate Programmes" icon={<GraduationCap className="w-8 h-8 text-primary-700" />} />
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <AnimatedCounter end={98} suffix="%" label="Student Satisfaction" icon={<Heart className="w-8 h-8 text-primary-700" />} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="py-16 bg-gradient-to-br from-primary-50 to-green-50 leaf-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="inline-block">
                  <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                </motion.div>
                <h2 className="section-title text-center inline-block">
                  Memorandum of Understanding (MOU)
                </h2>
                <p className="text-gray-600 mt-6">
                  Between Cosmopolitan University Abuja and Zee&apos;s Herbal Pharmacy
                </p>
              </div>

              <div className="card p-8 border-t-4 border-primary-600 hover-glow">
                <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
                    <Image src="/images/IMG-20260901-WA0008.jpg" alt="MOU signing ceremony" fill className="object-cover" />
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      This partnership represents a collaboration between Cosmopolitan University Abuja and Zee&apos;s Herbal Pharmacy for training in indigenous and herbal medicine through structured blended programmes, practical labs, and field engagement.
                    </p>
                    <h3 className="text-xl font-semibold text-primary-700 mt-6 mb-3">Partnership Objectives:</h3>
                    <ul className="space-y-2 text-gray-700 mb-6">
                      <li className="flex items-start transform transition-transform hover:translate-x-2"><span className="text-primary-600 mr-2">?</span><span>Provide world-class herbal medicine education grounded in both traditional wisdom and contemporary research</span></li>
                      <li className="flex items-start transform transition-transform hover:translate-x-2"><span className="text-primary-600 mr-2">?</span><span>Offer practical training through Zee&apos;s Herbal Pharmacy&apos;s state-of-the-art facilities</span></li>
                      <li className="flex items-start transform transition-transform hover:translate-x-2"><span className="text-primary-600 mr-2">?</span><span>Promote the integration of herbal medicine into mainstream healthcare</span></li>
                      <li className="flex items-start transform transition-transform hover:translate-x-2"><span className="text-primary-600 mr-2">?</span><span>Preserve and advance African traditional medicine knowledge</span></li>
                      <li className="flex items-start transform transition-transform hover:translate-x-2"><span className="text-primary-600 mr-2">?</span><span>Support research and development in phytotherapy and herbal pharmacology</span></li>
                    </ul>
                    <div className="bg-primary-50 p-6 rounded-lg mt-6 border-l-4 border-primary-600">
                      <p className="text-gray-800 font-medium">
                        This collaboration ensures that students receive comprehensive training from experienced practitioners, access to extensive herbal resources, and certifications recognized both nationally and internationally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                  <Leaf className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                </motion.div>
                <h2 className="section-title text-center inline-block">
                  About Zee&apos;s Herbal Pharmacy
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <AnimatedSection direction="left" delay={0.2}>
                  <div className="card p-0 hover-scale overflow-hidden">
                    <div className="relative h-64">
                      <Image src="/images/IMG-20260901-WA0009.jpg" alt="Herbal Medicine Event" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <Heart className="w-10 h-10 text-primary-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Heritage</h3>
                      <p className="text-gray-700">
                        Established over 30 years ago, Zee&apos;s Herbal Pharmacy has been at the forefront of herbal medicine in Nigeria. Founded by renowned herbalist Dr. Aziz &quot;Zee&quot; Okoye, our pharmacy combines generations of traditional knowledge with modern pharmaceutical standards.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection direction="right" delay={0.3}>
                  <div className="card p-0 hover-scale overflow-hidden">
                    <div className="relative h-64">
                      <Image src="/images/IMG-20260901-WA0007.jpg" alt="Herbal Research" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <TrendingUp className="w-10 h-10 text-primary-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Expertise</h3>
                      <p className="text-gray-700">
                        We specialize in formulating effective herbal remedies for various health conditions, from common ailments to chronic diseases. Our products are rigorously tested, quality-controlled, and comply with international standards.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection delay={0.4}>
                <div className="bg-white rounded-xl shadow-2xl p-8 hover-glow">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Why Choose Zee&apos;s Herbal Pharmacy?</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <motion.div whileHover={{ y: -10 }} className="text-center p-4">
                      <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                        <Award className="w-8 h-8 text-primary-700" />
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-800">Certified Excellence</h4>
                      <p className="text-sm text-gray-600">Accredited by national and international herbal medicine bodies</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="text-center p-4">
                      <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow animation-delay-1000">
                        <Users className="w-8 h-8 text-primary-700" />
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-800">Community Care</h4>
                      <p className="text-sm text-gray-600">Field mentoring, pharmacy access, and evidence-led herbal practice</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="text-center p-4">
                      <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow animation-delay-2000">
                        <BookOpen className="w-8 h-8 text-primary-700" />
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-800">Learning Network</h4>
                      <p className="text-sm text-gray-600">Blended education and practical herbal pharmacy learning environments</p>
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-16 bg-gradient-to-br from-green-50 to-primary-50 leaf-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="section-title text-center inline-block">The Importance of Herbal Medicine</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-lg hover-scale flex flex-col h-full">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Health Benefits</h3>
                  <ul className="space-y-4 text-gray-700 flex-grow">
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Natural Healing:</strong> Harnesses the body&apos;s innate healing capabilities</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Fewer Side Effects:</strong> Gentler on the body</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Holistic Approach:</strong> Treats the whole person</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Preventive Care:</strong> Maintains overall wellness</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Complementary Treatment:</strong> Works alongside conventional medicine</span></li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg hover-scale flex flex-col h-full">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Global Significance</h3>
                  <ul className="space-y-4 text-gray-700 flex-grow">
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>WHO Recognition:</strong> Vital role in healthcare</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Accessibility:</strong> Affordable for all communities</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Sustainability:</strong> Environmentally friendly</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Cultural Preservation:</strong> Maintains traditional knowledge</span></li>
                    <li className="flex items-start"><span className="text-primary-600 font-bold mr-2">?</span><span><strong>Economic Impact:</strong> Supports local communities</span></li>
                  </ul>
                </div>
              </div>

              <AnimatedSection delay={0.4}>
                <motion.div className="mt-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-8 text-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <p className="text-lg">
                    <strong>Did you know?</strong> According to WHO, approximately 80% of the world&apos;s population relies on herbal medicine for some aspect of their primary healthcare needs.
                  </p>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="section-title text-center inline-block">History &amp; Cultural Heritage</h2>
              </div>

              <div className="space-y-8">
                <div className="card p-8 hover-scale">
                  <h3 className="text-2xl font-semibold mb-4 text-primary-700">Ancient Roots</h3>
                  <p className="text-gray-700 mb-4">
                    Herbal medicine is humanity&apos;s oldest healthcare practice, dating back over 5,000 years. Ancient civilizations including Egyptian, Chinese, Indian, Greek, and African cultures developed sophisticated systems of herbal healing.
                  </p>
                  <p className="text-gray-700">
                    In Africa, traditional healers have served as the backbone of healthcare for millennia, passing down invaluable knowledge through oral traditions.
                  </p>
                </div>

                <div className="card p-8 hover-scale">
                  <h3 className="text-2xl font-semibold mb-4 text-primary-700">African Traditional Medicine</h3>
                  <p className="text-gray-700 mb-4">
                    Nigeria&apos;s rich biodiversity provides over 7,000 species of medicinal plants. Traditional healers have developed deep understanding of these plants&apos; therapeutic properties.
                  </p>
                  <div className="bg-primary-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Notable African Medicinal Plants:</h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <li>? Bitter Leaf (Vernonia amygdalina)</li>
                      <li>? Moringa (Moringa oleifera)</li>
                      <li>? African Mistletoe (Viscum album)</li>
                      <li>? Neem (Azadirachta indica)</li>
                      <li>? Ginger (Zingiber officinale)</li>
                      <li>? Turmeric (Curcuma longa)</li>
                    </ul>
                  </div>
                </div>

                <div className="card p-8 hover-scale">
                  <h3 className="text-2xl font-semibold mb-4 text-primary-700">Modern Integration</h3>
                  <p className="text-gray-700 mb-4">
                    Today, herbal medicine is experiencing a renaissance as modern science validates traditional practices. Many pharmaceutical drugs are derived from plants.
                  </p>
                  <p className="text-gray-700">
                    Our programmes bridge traditional wisdom with contemporary scientific methods, creating practitioners who understand both ancient healing arts and modern medical standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="relative py-24 bg-gradient-to-br from-primary-700 via-green-700 to-primary-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-0"></div>
          <div className="absolute inset-0 leaf-bg opacity-10 z-0"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
                Begin Your Journey in Herbal Medicine
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-white max-w-3xl mx-auto drop-shadow-xl leading-relaxed">
                Join hundreds of students who have transformed their lives and careers through our comprehensive herbal medicine programmes.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/programmes" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-10 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-white/30 inline-block text-lg">
                    View All Programmes
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register/email" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-10 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-white/30 inline-block text-lg">
                    Enroll Today
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>
    </MainLayout>
  );
}

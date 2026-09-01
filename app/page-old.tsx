import MainLayout from '@/components/MainLayout';
import Link from 'next/link';
import { Leaf, Award, BookOpen, Users, Heart, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 leaf-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Leaf className="w-16 h-16 text-primary-200 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Herbal Medicine Certificate Programmes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              In Partnership with Zee&apos;s Herbal Pharmacy
            </p>
            <p className="text-lg mb-10 text-gray-100">
              Discover the ancient wisdom of herbal healing combined with modern scientific knowledge.
              Join our accredited programmes and become a certified herbal medicine practitioner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programmes" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Explore Programmes
              </Link>
              <Link href="/register" className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOU Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="section-title text-center inline-block">
                Memorandum of Understanding (MOU)
              </h2>
              <p className="text-gray-600 mt-6">
                Between Cosmopolitan University Abuja and Zee&apos;s Herbal Pharmacy
              </p>
            </div>

            <div className="card p-8 border-t-4 border-primary-600">
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  This partnership represents a groundbreaking collaboration between Cosmopolitan University Abuja,
                  a leading institution of higher learning, and Zee&apos;s Herbal Pharmacy, a renowned authority in
                  traditional and modern herbal medicine practices.
                </p>

                <h3 className="text-xl font-semibold text-primary-700 mt-6 mb-3">Partnership Objectives:</h3>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Provide world-class herbal medicine education grounded in both traditional wisdom and contemporary research</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Offer practical training through Zee&apos;s Herbal Pharmacy&apos;s state-of-the-art facilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Promote the integration of herbal medicine into mainstream healthcare</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Preserve and advance African traditional medicine knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Support research and development in phytotherapy and herbal pharmacology</span>
                  </li>
                </ul>

                <div className="bg-primary-50 p-6 rounded-lg mt-6">
                  <p className="text-gray-800 font-medium">
                    This collaboration ensures that students receive comprehensive training from experienced
                    practitioners, access to extensive herbal resources, and certifications recognized both
                    nationally and internationally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Zee's Herbal Pharmacy */}
      <section className="py-16 bg-primary-50 leaf-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Leaf className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="section-title text-center inline-block">
                About Zee&apos;s Herbal Pharmacy
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card p-6">
                <Heart className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Heritage</h3>
                <p className="text-gray-700">
                  Established over 30 years ago, Zee&apos;s Herbal Pharmacy has been at the forefront of
                  herbal medicine in Nigeria. Founded by renowned herbalist Dr. Aziz &quot;Zee&quot; Okoye,
                  our pharmacy combines generations of traditional knowledge with modern pharmaceutical standards.
                </p>
              </div>

              <div className="card p-6">
                <TrendingUp className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Expertise</h3>
                <p className="text-gray-700">
                  We specialize in formulating effective herbal remedies for various health conditions,
                  from common ailments to chronic diseases. Our products are rigorously tested, quality-controlled,
                  and comply with international standards.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Why Choose Zee&apos;s Herbal Pharmacy?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary-700" />
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-800">Certified Excellence</h4>
                  <p className="text-sm text-gray-600">Accredited by national and international herbal medicine bodies</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-700" />
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-800">Expert Practitioners</h4>
                  <p className="text-sm text-gray-600">Learn from experienced herbalists with decades of practice</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-700" />
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-800">Comprehensive Resources</h4>
                  <p className="text-sm text-gray-600">Access to extensive herbal library and botanical gardens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Importance of Herbal Medicine */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title text-center inline-block">
                The Importance of Herbal Medicine
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Health Benefits</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Natural Healing:</strong> Harnesses the body&apos;s innate healing capabilities using plant-based remedies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Fewer Side Effects:</strong> Generally gentler on the body compared to synthetic pharmaceuticals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Holistic Approach:</strong> Treats the whole person, not just symptoms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Preventive Care:</strong> Emphasizes prevention and maintaining overall wellness</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Complementary Treatment:</strong> Can work alongside conventional medicine</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Global Significance</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>WHO Recognition:</strong> The World Health Organization acknowledges herbal medicine&apos;s vital role in healthcare</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Accessibility:</strong> Affordable and available to rural and underserved communities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Sustainability:</strong> Environmentally friendly and renewable healthcare solution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Cultural Preservation:</strong> Maintains traditional healing knowledge for future generations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">•</span>
                    <span><strong>Economic Impact:</strong> Creates employment and supports local communities</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-8">
              <p className="text-lg text-center">
                <strong>Did you know?</strong> According to WHO, approximately 80% of the world&apos;s population
                relies on herbal medicine for some aspect of their primary healthcare needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History and Culture */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title text-center inline-block">
                History & Cultural Heritage
              </h2>
            </div>

            <div className="space-y-8">
              <div className="card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-primary-700">Ancient Roots</h3>
                <p className="text-gray-700 mb-4">
                  Herbal medicine is humanity&apos;s oldest healthcare practice, dating back over 5,000 years.
                  Ancient civilizations including Egyptian, Chinese, Indian, Greek, and African cultures developed
                  sophisticated systems of herbal healing that form the foundation of modern medicine.
                </p>
                <p className="text-gray-700">
                  In Africa, traditional healers have served as the backbone of healthcare for millennia,
                  passing down invaluable knowledge through oral traditions and apprenticeships.
                </p>
              </div>

              <div className="card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-primary-700">African Traditional Medicine</h3>
                <p className="text-gray-700 mb-4">
                  Nigeria&apos;s rich biodiversity provides over 7,000 species of medicinal plants. Traditional
                  healers have developed deep understanding of these plants&apos; therapeutic properties, creating
                  effective remedies for various ailments.
                </p>
                <div className="bg-primary-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Notable African Medicinal Plants:</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <li>• Bitter Leaf (Vernonia amygdalina)</li>
                    <li>• Moringa (Moringa oleifera)</li>
                    <li>• African Mistletoe (Viscum album)</li>
                    <li>• Neem (Azadirachta indica)</li>
                    <li>• Ginger (Zingiber officinale)</li>
                    <li>• Turmeric (Curcuma longa)</li>
                  </ul>
                </div>
              </div>

              <div className="card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-primary-700">Modern Integration</h3>
                <p className="text-gray-700 mb-4">
                  Today, herbal medicine is experiencing a renaissance as modern science validates traditional
                  practices. Many pharmaceutical drugs are derived from plants, and research continues to discover
                  new therapeutic compounds in medicinal herbs.
                </p>
                <p className="text-gray-700">
                  Our programmes bridge traditional wisdom with contemporary scientific methods, creating
                  practitioners who understand both ancient healing arts and modern medical standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Begin Your Journey in Herbal Medicine
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join hundreds of students who have transformed their lives and careers through our
            comprehensive herbal medicine programmes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programmes" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              View All Programmes
            </Link>
            <Link href="/register" className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white transition-all duration-300 shadow-lg hover:shadow-xl">
              Enroll Today
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

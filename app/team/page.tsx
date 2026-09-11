'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { Users, Mail, Phone, Linkedin, Twitter, Facebook, Sparkles, X, Eye } from 'lucide-react';
import { TeamMember } from '@/types';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [introRef, introInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <MainLayout>
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="absolute inset-0 z-0">
          <Image
            src="/images/IMG-20260901-WA0008.jpg"
            alt="Herbal Medicine Background"
            fill
            className="object-cover opacity-15"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </motion.div>
              <span className="text-sm font-medium">Meet Our Experts</span>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Our Team
            </motion.h1>
            <motion.p
              className="text-xl text-primary-100 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Meet the experts behind our world-class herbal medicine education
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative floating elements */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-3 h-3 bg-white/30 rounded-full"
        />
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-20 w-2 h-2 bg-white/40 rounded-full"
        />
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 left-1/4 w-4 h-4 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-32 right-1/3 w-2 h-2 bg-yellow-300/40 rounded-full"
        />
      </section>

      {/* Team Introduction */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            ref={introRef}
            initial={{ opacity: 0, y: 40 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={introInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Users className="w-10 h-10 text-primary-700" />
              </motion.div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="section-title text-center inline-block mb-6"
            >
              Expert Faculty & Staff
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-700 text-lg leading-relaxed"
            >
              Our team consists of experienced practitioners, researchers, and educators
              dedicated to advancing herbal medicine education. Each member brings unique
              expertise from academia, clinical practice, and the pharmaceutical industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 bg-primary-50 overflow-hidden">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : teamMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Team Coming Soon</h3>
              <p className="text-gray-500">
                We&apos;re updating our team profiles. Check back soon!
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                ref={gridRef}
                variants={containerVariants}
                initial="hidden"
                animate={gridInView ? 'visible' : 'hidden'}
                className={teamMembers.length === 1 ? 'flex justify-center' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'}
              >
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    onHoverStart={() => setHoveredCard(member.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className={teamMembers.length === 1 ? 'w-full max-w-md' : 'relative'}
                  >
                    <div className={`card p-6 text-center h-full flex flex-col transition-shadow duration-300 ${
                      hoveredCard === member.id ? 'shadow-xl shadow-primary-200/50' : ''
                    } ${teamMembers.length === 1 ? 'mx-auto' : ''}`}>
                      {/* Profile Image */}
                      <motion.div
                        className="relative w-32 h-32 mx-auto mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover border-4 border-primary-100"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center border-4 border-primary-200">
                            <span className="text-4xl font-bold text-primary-600">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {/* Hover ring effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-primary-400"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={hoveredCard === member.id ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>

                      {/* Name & Title */}
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{member.name}</h3>
                      <p className="text-primary-600 font-medium mb-2">{member.title}</p>

                      {/* Department */}
                      {member.department && (
                        <motion.p
                          className="text-sm text-gray-500 mb-3 inline-block"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <span className="bg-primary-50 px-3 py-1 rounded-full">
                            {member.department}
                          </span>
                        </motion.p>
                      )}

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{member.bio}</p>
                      )}

                      {/* Contact & Social Links */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex justify-center gap-3">
                          {member.email && (
                            <motion.a
                              href={`mailto:${member.email}`}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                              title="Email"
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Mail className="w-5 h-5" />
                            </motion.a>
                          )}
                          {member.phone && (
                            <motion.a
                              href={`tel:${member.phone}`}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                              title="Phone"
                              whileHover={{ scale: 1.15, rotate: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Phone className="w-5 h-5" />
                            </motion.a>
                          )}
                          {member.linkedin && (
                            <motion.a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                              title="LinkedIn"
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Linkedin className="w-5 h-5" />
                            </motion.a>
                          )}
                          {member.twitter && (
                            <motion.a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-sky-100 hover:text-sky-500 transition-colors"
                              title="Twitter"
                              whileHover={{ scale: 1.15, rotate: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Twitter className="w-5 h-5" />
                            </motion.a>
                          )}
                          {member.facebook && (
                            <motion.a
                              href={member.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                              title="Facebook"
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Facebook className="w-5 h-5" />
                            </motion.a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMember(member)}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                        >
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <AnimatePresence>
                {selectedMember && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 py-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="relative w-[min(96vw,1400px)] max-h-[96vh] rounded-3xl bg-white shadow-2xl overflow-hidden"
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedMember(null)}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-700 shadow-sm transition hover:bg-primary-50 hover:text-primary-700"
                        aria-label="Close profile"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="grid md:grid-cols-[240px_1fr] max-h-[96vh]">
                        <div className="bg-gradient-to-br from-primary-700 to-primary-900 p-8 flex flex-col items-center justify-center text-white min-h-[280px]">
                          {selectedMember.imageUrl ? (
                            <div className="relative w-40 h-40 mb-4">
                              <Image
                                src={selectedMember.imageUrl}
                                alt={selectedMember.name}
                                fill
                                className="rounded-full object-cover border-4 border-white/80"
                              />
                            </div>
                          ) : (
                            <div className="w-40 h-40 rounded-full bg-white/20 border-4 border-white/80 flex items-center justify-center text-5xl font-bold">
                              {selectedMember.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-semibold uppercase tracking-wide">Team Member</span>
                        </div>

                        <div className="p-8 min-w-0 flex flex-col max-h-[96vh] overflow-hidden">
                          <div className="mb-4 flex-shrink-0">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-600">{selectedMember.department || 'Faculty Member'}</p>
                            <h3 className="mt-2 text-3xl font-bold text-gray-900 break-words">{selectedMember.name}</h3>
                            <p className="mt-2 text-lg font-semibold text-primary-700">{selectedMember.title}</p>
                          </div>

                          {selectedMember.bio && (
                            <div className="mb-5 rounded-2xl bg-primary-50 p-4 flex-1 min-h-0 overflow-y-auto">
                              <p className="text-sm leading-7 text-gray-700 whitespace-pre-line">{selectedMember.bio}</p>
                            </div>
                          )}

                          <div className="space-y-3 text-sm text-gray-700 flex-shrink-0">
                            {selectedMember.email && (
                              <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary-700" />
                                <a href={`mailto:${selectedMember.email}`} className="hover:text-primary-700">{selectedMember.email}</a>
                              </div>
                            )}
                            {selectedMember.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary-700" />
                                <a href={`tel:${selectedMember.phone}`} className="hover:text-primary-700">{selectedMember.phone}</a>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3 flex-shrink-0">
                            {selectedMember.linkedin && (
                              <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                LinkedIn
                              </a>
                            )}
                            {selectedMember.twitter && (
                              <a href={selectedMember.twitter} target="_blank" rel="noopener noreferrer" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-sky-50 hover:text-sky-500">
                                Twitter
                              </a>
                            )}
                            {selectedMember.facebook && (
                              <a href={selectedMember.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                                Facebook
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white overflow-hidden relative">
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Learn From the Best
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-primary-100"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Join our programmes and benefit from the expertise of our distinguished faculty.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.a
                href="/programmes"
                className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 inline-block"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                View Programmes
              </motion.a>
              <motion.a
                href="/contact"
                className="bg-transparent hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white transition-all duration-300 inline-block"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Leaf, Award, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    title: 'Herbal Medicine Excellence',
    subtitle: 'Transform Your Future with Ancient Wisdom',
    description: 'Join our comprehensive herbal medicine programmes and become a certified practitioner',
    icon: Leaf,
    image: '/side-view-man-cleaning-plant-s-leaf.jpg',
    cta: { text: 'Explore Programmes', link: '/programmes' },
  },
  {
    id: 2,
    title: 'Partnership with Zee\'s Herbal Pharmacy',
    subtitle: '30+ Years of Herbal Excellence',
    description: 'Learn from experienced practitioners with decades of real-world practice',
    icon: Award,
    image: '/set-wood-stubs-cup-tea-tea-herbs-bowls-dark-textured-background-flat-lay.jpg',
    cta: { text: 'Learn More', link: '/about' },
  },
  {
    id: 3,
    title: 'Join 500+ Certified Graduates',
    subtitle: 'Building Careers in Natural Medicine',
    description: 'Our alumni practice across Nigeria and internationally',
    icon: Users,
    image: '/rustic-table-adorned-with-fresh-herb-bouquet-generated-by-ai.jpg',
    cta: { text: 'Register Now', link: '/register' },
  },
  {
    id: 4,
    title: 'Accredited Certificate Programmes',
    subtitle: 'Recognized by National & International Bodies',
    description: 'Receive certificates acknowledged by herbal medicine associations worldwide',
    icon: BookOpen,
    image: '/natural-crushed-green-leaves-bowl.jpg',
    cta: { text: 'View Certificates', link: '/programmes' },
  },
];

export default function HeroSlider() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
          bulletClass: 'swiper-pagination-bullet !bg-white/50',
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                  quality={85}
                />

                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

                {/* Leafy pattern overlay */}
                <div className="absolute inset-0 leaf-bg opacity-20"></div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-center px-4 z-10">
                  <div className="max-w-4xl mx-auto text-center text-white">
                    {/* Animated Icon */}
                    <div className="flex justify-center mb-8 animate-bounce-slow">
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full animate-pulse-slow">
                        <Icon className="w-16 h-16 md:w-20 md:h-20 text-white" />
                      </div>
                    </div>

                    {/* Title with fade-in animation */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in-up drop-shadow-2xl">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-3xl mb-6 text-primary-100 animate-fade-in-up animation-delay-200 drop-shadow-lg">
                      {slide.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-lg md:text-xl mb-10 text-gray-100 max-w-2xl mx-auto animate-fade-in-up animation-delay-400 drop-shadow-md">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={slide.cta.link}
                      className="inline-block bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-10 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105 transform animate-fade-in-up animation-delay-600"
                    >
                      {slide.cta.text}
                    </Link>
                  </div>
                </div>

                {/* Decorative floating leaves */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Leaf className="absolute top-20 left-10 w-12 h-12 text-white/10 animate-float" />
                  <Leaf className="absolute top-40 right-20 w-16 h-16 text-white/10 animate-float animation-delay-1000" />
                  <Leaf className="absolute bottom-32 left-1/4 w-10 h-10 text-white/10 animate-float animation-delay-2000" />
                  <Leaf className="absolute bottom-20 right-1/3 w-14 h-14 text-white/10 animate-float animation-delay-1500" />
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-white/20 !backdrop-blur-sm rounded-full hover:!bg-white/30 transition-all after:!text-2xl"></div>
        <div className="swiper-button-next !text-white !w-12 !h-12 !bg-white/20 !backdrop-blur-sm rounded-full hover:!bg-white/30 transition-all after:!text-2xl"></div>
      </Swiper>

      {/* Custom pagination styling */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 30px !important;
          z-index: 20 !important;
        }
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
          width: 40px !important;
          border-radius: 6px !important;
        }

        /* Fix fade effect stacking issue */
        .swiper-slide {
          opacity: 0 !important;
          transition-property: opacity !important;
        }

        .swiper-slide-active {
          opacity: 1 !important;
          z-index: 10 !important;
        }

        .swiper-slide-prev,
        .swiper-slide-next {
          opacity: 0 !important;
          z-index: 1 !important;
        }
      `}</style>
    </div>
  );
}

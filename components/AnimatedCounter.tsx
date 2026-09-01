'use client';

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  icon: ReactNode;
}

export default function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2.5,
  label,
  icon,
}: AnimatedCounterProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="flex justify-center mb-4">
        <div className="bg-primary-100 p-4 rounded-full animate-pulse-slow">
          {icon}
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-bold text-primary-700 mb-2">
        {inView && (
          <CountUp
            start={0}
            end={end}
            duration={duration}
            suffix={suffix}
            prefix={prefix}
            separator=","
          />
        )}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}

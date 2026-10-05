'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import BackgroundWrapper from '../components/BackgroundWrapper';

const SectionReveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function Terms() {
  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="pt-36 pb-20"
    >
      <div className="max-w-3xl mx-auto px-6 font-sans space-y-8 relative z-10 text-left">
        <SectionReveal>
          <h1 className="font-serif text-4xl pb-4 font-semibold text-[#166D74]" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider mt-4 text-[#C9A646]">Last Updated: July 10, 2026</p>
        </SectionReveal>
        
        <SectionReveal delay={0.1} className="space-y-6 text-[15px] leading-relaxed text-[#5F6C72]">
          <p>
            Welcome to the relationship consultation website of Abhay Harpale. By accessing this portal, booking sessions, or subscribing to our newsletters, you agree to comply with and be bound by the following conditions.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">1. Scope of Consultations</h3>
          <p>
            Our programs, relationship mapping exercises, and intimacy guidance sessions represent professional relationship advising and couples connection coaching. They do not constitute clinical therapy, psychiatric services, or medical advice. If you require medical assistance, please contact local medical services or emergency services immediately.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">2. Account Responsibility</h3>
          <p>
            Users booking sessions are responsible for supplying authentic names, emails, and contact details. Supplying fraudulent details will result in slot termination without reimbursement.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">3. Code of Conduct</h3>
          <p>
            Clients are expected to maintain professional courtesy during virtual consultations. Intimidating, aggressive, or inappropriate language will lead to instant termination of session connections.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2} className="pt-8">
          <Link href="/" className="animated-link font-sans text-xs font-bold uppercase tracking-wider text-[#166D74]">
            &larr; Back to Home
          </Link>
        </SectionReveal>
      </div>
    </BackgroundWrapper>
  );
}

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

export default function PrivacyPolicy() {
  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="pt-36 pb-20"
    >
      <div className="max-w-3xl mx-auto px-6 font-sans space-y-8 relative z-10 text-left">
        <SectionReveal>
          <h1 className="font-serif text-4xl pb-4 font-semibold text-[#166D74]" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
            Privacy Policy
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider mt-4 text-[#C9A646]">Last Updated: July 10, 2026</p>
        </SectionReveal>
        
        <SectionReveal delay={0.1} className="space-y-6 text-[15px] leading-relaxed text-[#5F6C72]">
          <p>
            At Abhay Harpale's relationship advisor portal, we prioritize client privacy and the absolute security of your consultation records. This document outlines how we collect, handle, and store user credentials, session notes, and booking transactions.
          </p>
          
          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">1. Information Collection</h3>
          <p>
            We collect personal identification records (Name, Email Address, Contact Number) and details regarding your relationship concerns strictly during booking forms or query submissions.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">2. Session and Consultation Data</h3>
          <p>
            All records, mapping answers, and video coordinates remain confidential. We adhere to standard professional confidentiality practices. Your session data is never shared with third-party networks, employers, or ad publishers.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">3. Transactional Safety</h3>
          <p>
            Payment transactions are processed entirely through the Razorpay SDK gateway. We store transaction references and status values in our MySQL database. We do not access, view, or record credit card credentials.
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

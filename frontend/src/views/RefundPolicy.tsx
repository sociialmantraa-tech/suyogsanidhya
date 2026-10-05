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

export default function RefundPolicy() {
  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="pt-36 pb-20"
    >
      <div className="max-w-3xl mx-auto px-6 font-sans space-y-8 relative z-10 text-left">
        <SectionReveal>
          <h1 className="font-serif text-4xl pb-4 font-semibold text-[#166D74]" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider mt-4 text-[#C9A646]">Last Updated: July 10, 2026</p>
        </SectionReveal>
        
        <SectionReveal delay={0.1} className="space-y-6 text-[15px] leading-relaxed text-[#5F6C72]">
          <p>
            We appreciate the value of your time and ours. Because private consultation slots are heavily limited, we operate under strict rescheduling and cancellation parameters.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">1. Rescheduling Guidelines</h3>
          <p>
            You can request to reschedule your consultation free of charge up to 24 hours prior to your scheduled slot. Rescheduling requests sent inside the 24-hour window are not allowed and the session will be logged as completed.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">2. Cancellations and Refunds</h3>
          <p>
            Cancellations made more than 48 hours prior to the session start time will receive a 100% refund. Cancellations made between 24 and 48 hours prior will receive a 50% refund. No refunds are provided for cancellations made less than 24 hours prior or for client no-shows.
          </p>

          <h3 className="font-serif text-xl pt-4 font-semibold text-[#166D74]">3. Processing Refunds</h3>
          <p>
            Eligible refunds are processed directly back to the original source payment instrument within 5 to 7 business days, depending on bank gateway timelines.
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

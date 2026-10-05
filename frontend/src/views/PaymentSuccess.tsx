'use client';

import React, { useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Mail } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';

const SectionReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams?.get('ref');
  const booking = {
    booking_reference: refParam || 'REF-CONFIRMED',
    service_title: 'Clarity Mapping Session',
    booking_date: 'Confirmed',
    booking_time: '10:00:00',
    duration: 60,
    total_amount: '2500.00'
  };

  const formatSlotTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hour, min] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  };

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="pt-32 pb-20"
    >
      <div className="max-w-2xl mx-auto px-6 text-center space-y-10 relative z-10">
        
        <SectionReveal className="space-y-4">
          <div className="flex justify-center" style={{ color: '#166D74' }}>
            <CheckCircle className="w-20 h-20 fill-[#40C0C0]/10" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold block" style={{ color: '#C9A646' }}>Session Confirmed</span>
          <h1 className="font-serif text-[#166D74]">Your Booking is Secured</h1>
          <p className="font-sans text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#5F6C72' }}>
            Your transaction has been verified. A confirmation email containing meeting details and video session link has been dispatched.
          </p>
        </SectionReveal>

        {/* Details Card */}
        <SectionReveal delay={0.1}>
          <div 
            className="p-8 shadow-lg text-left max-w-md mx-auto space-y-6"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              border: '1.5px solid rgba(64,192,192,0.12)'
            }}
          >
            <div className="pb-4" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
              <span className="font-sans text-[10px] uppercase tracking-widest block mb-1" style={{ color: '#88949B' }}>
                Receipt Reference: {booking.booking_reference}
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#166D74]">{booking.service_title}</h3>
            </div>

            <div className="space-y-3 font-sans text-sm" style={{ color: '#5F6C72' }}>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" style={{ color: '#40C0C0' }} />
                <span><strong style={{ color: '#166D74' }}>Date:</strong> {booking.booking_date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" style={{ color: '#40C0C0' }} />
                <span><strong style={{ color: '#166D74' }}>Time:</strong> {formatSlotTime(booking.booking_time)} (IST)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: '#40C0C0' }} />
                <span><strong style={{ color: '#166D74' }}>Duration:</strong> {booking.duration} Minutes</span>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Next Steps */}
        <SectionReveal delay={0.15}>
          <div 
            className="p-6 max-w-md mx-auto text-left space-y-2 text-xs font-sans leading-relaxed bg-white"
            style={{
              borderRadius: '20px',
              border: '1.5px solid rgba(64,192,192,0.12)',
              color: '#5F6C72'
            }}
          >
            <p className="font-bold uppercase tracking-wider mb-2" style={{ color: '#166D74' }}>Important Preparation Checklist:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Check your spam/junk email folder if you do not receive the confirmation mail within 5 minutes.</li>
              <li>Connect using a desktop browser (Chrome/Safari) for optimal audio-video compatibility.</li>
              <li>A quiet room with 100% privacy is highly recommended for clarity exercises.</li>
            </ul>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2} className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Button to="/" variant="outline">
            Back to Home
          </Button>
          <Button to="/blog" variant="primary">
            Read Publications
          </Button>
        </SectionReveal>

      </div>
    </BackgroundWrapper>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#166D74]">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

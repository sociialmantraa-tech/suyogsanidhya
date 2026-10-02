import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';

const SectionReveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

export default function PaymentFailed() {
  const location = useLocation();
  const errorMsg = location.state?.error || "The transaction was aborted by the payment gateway or bank.";

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6"
    >
      <SectionReveal className="max-w-md w-full p-8 text-center relative z-10 space-y-6 bg-white" style={{ border: '1.5px solid rgba(64,192,192,0.12)', borderRadius: '28px' }}>
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-100 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-red-500 font-bold block">Payment Failed</span>
          <h2 className="font-serif text-2xl text-[#166D74]">Transaction Unsuccessful</h2>
          <p className="font-sans text-xs text-[#5F6C72] leading-relaxed">
            We were unable to complete secure validation. No charges have been drafted from your account.
          </p>
        </div>

        <div className="bg-red-50/50 border-l-2 border-red-500 p-4 text-left rounded-r-xl">
          <span className="font-sans text-[10px] uppercase font-bold text-red-700 tracking-wider block mb-1">Reason:</span>
          <p className="font-sans text-xs text-red-800 leading-relaxed">{errorMsg}</p>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t w-full" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
          <Button to="/book" variant="primary" className="w-full justify-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Booking Again
          </Button>
          <Button to="/contact" variant="outline" className="w-full justify-center">
            Contact Support Desk
          </Button>
        </div>
      </SectionReveal>
    </BackgroundWrapper>
  );
}

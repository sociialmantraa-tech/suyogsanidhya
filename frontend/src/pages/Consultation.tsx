import React, { useRef } from 'react';
import { ShieldCheck, Video } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';

const SectionReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Consultation() {
  return (
    <BackgroundWrapper
      variant="primary"
      patternType="geometry"
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20 relative z-10">
        
        {/* Intro */}
        <SectionReveal className="text-center max-w-xl mx-auto space-y-4">
          <span 
            className="inline-block px-4 py-1.5 eyebrow-label uppercase rounded-full"
            style={{ backgroundColor: '#FFFFFF', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
          >
            The Engagement
          </span>
          <h1 className="font-serif text-[#166D74]">Private Consultations</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            One-on-one virtual consultations structured to explore relationship patterns, address communication blocks, and rebuild intimacy.
          </p>
        </SectionReveal>

        {/* Focus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <SectionReveal>
            <div 
              className="service-card p-8 md:p-12 space-y-4 h-full"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Video className="w-8 h-8" style={{ color: '#40C0C0' }} />
              <h3 className="font-serif text-xl text-[#166D74]">Virtual Coordination</h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
                Sessions are conducted over fully secure video channels. You receive connection instructions and custom calendar invites instantly post confirmation.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div 
              className="service-card p-8 md:p-12 space-y-4 h-full"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ShieldCheck className="w-8 h-8" style={{ color: '#40C0C0' }} />
              <h3 className="font-serif text-xl text-[#166D74]">Confidential Boundaries</h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
                All discussions, relationship exercises, goals, and notes are protected under strict confidentiality guidelines and robust cybersecurity database locks.
              </p>
            </div>
          </SectionReveal>
        </div>

        {/* Preparation Guidelines */}
        <SectionReveal>
          <div 
            className="p-8 md:p-16 space-y-8 text-left rounded-[28px] bg-white" 
            style={{ border: '1.5px solid rgba(64,192,192,0.12)', boxShadow: '0 10px 30px rgba(22,109,116,0.02)' }}
          >
            <h2 className="font-serif text-2xl text-center text-[#166D74]">Session Preparation Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01. Private Space', desc: 'Connect from an isolated, quiet setting where you feel free to discuss sensitive relationship and personal matters without interruption.' },
                { step: '02. Tech Preparation', desc: 'Use a stable internet connection. Access the meeting link 5 minutes prior to configure and test video/microphone permissions.' },
                { step: '03. Clarity Intent', desc: 'Formulate 2-3 primary challenges or patterns you intend to address. Setting clear expectations optimizes our 60-minute duration.' }
              ].map((item, idx) => (
                <div key={item.step} className="space-y-2">
                  <span className="font-serif text-lg font-medium text-[#166D74]">{item.step}</span>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: '#5F6C72' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal className="text-center space-y-6 max-w-lg mx-auto">
          <h3 className="font-serif text-2xl text-[#166D74]">Begin Your Consultation Track</h3>
          <p className="font-sans text-sm" style={{ color: '#5F6C72' }}>
            Select a session model, date, and coordinate details securely. Take the first step toward relationship clarity and communication alignment.
          </p>
          <div className="flex flex-col justify-center items-center">
            <Button to="/book" variant="primary" showArrow={true}>
              Go to Scheduler
            </Button>
          </div>
        </SectionReveal>

      </div>
    </BackgroundWrapper>
  );
}

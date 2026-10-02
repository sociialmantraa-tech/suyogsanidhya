import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { demoFaqs } from '../data/demoFaqs';
import { Faq } from '../types';
import BackgroundWrapper from '../components/BackgroundWrapper';
import SEO from '../components/SEO';

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

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ faqs: Faq[] }>('/faqs/list.php')
      .then(data => {
        if (data && data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        } else {
          setFaqs(demoFaqs);
        }
      })
      .catch(err => {
        console.error("FAQ page failed, using fallback:", err);
        setFaqs(demoFaqs);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const CardSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-16 bg-[#40C0C0]/10 rounded-[24px] w-full"></div>
      <div className="h-16 bg-[#40C0C0]/10 rounded-[24px] w-full"></div>
      <div className="h-16 bg-[#40C0C0]/10 rounded-[24px] w-full"></div>
    </div>
  );

  return (
    <>
      <SEO
        title="FAQ — Frequently Asked Questions"
        description="Get answers to common questions about Abhay Harpale's relationship guidance sessions, booking process, confidentiality and approach."
        canonical="/faq"
      />
      <BackgroundWrapper
        variant="primary"
        patternType="lotus"
        className="pt-32 pb-20"
      >
      <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
        
        {/* Header Block */}
        <SectionReveal className="text-center space-y-4">
          <span 
            className="inline-block px-4 py-1.5 eyebrow-label uppercase rounded-full"
            style={{ backgroundColor: '#FFFFFF', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
          >
            COMMON QUESTIONS
          </span>
          <h1 className="font-serif text-[#166D74]">Frequently Asked Questions</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            Quick responses to common enquiries regarding consultation scheduling, confidentiality, preparation, and fees.
          </p>
        </SectionReveal>

        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-4 text-left">
            {faqs.map((faq: Faq, index: number) => {
              const isOpen = activeFaq === index;
              return (
                <SectionReveal key={faq.id} delay={index * 0.05}>
                  <div 
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      border: `1.5px solid ${isOpen ? 'rgba(64,192,192,0.35)' : 'rgba(64,192,192,0.1)'}`,
                      boxShadow: isOpen ? '0 15px 35px rgba(22,109,116,0.04)' : 'none',
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left py-6 px-8 flex justify-between items-center focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-sans text-[15px] font-semibold leading-[1.4]" style={{ color: '#166D74' }}>
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A646' }} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p 
                            className="font-sans leading-relaxed px-8 pb-6 pt-0"
                            style={{ fontSize: '15px', color: '#5F6C72' }}
                          >
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        )}

      </div>
    </BackgroundWrapper>
    </>
  );
}

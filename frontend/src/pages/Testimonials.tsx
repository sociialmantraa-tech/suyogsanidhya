import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { Testimonial } from '../types';
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

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get<{ testimonials: Testimonial[] }>('/testimonials/list.php')
      .then(data => {
        if (data && data.testimonials) {
          setTestimonials(data.testimonials);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Testimonials page failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO
        title="Client Testimonials"
        description="Read genuine testimonials from individuals and couples who have experienced meaningful transformation through Abhay Harpale's relationship guidance."
        canonical="/testimonials"
      />
      <BackgroundWrapper
        variant="primary"
        patternType="concentric"
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
        
        {/* Header Block */}
        <SectionReveal className="text-center max-w-xl mx-auto space-y-4">
          <span 
            className="inline-block px-4 py-1.5 eyebrow-label uppercase rounded-full"
            style={{ backgroundColor: 'var(--color-bg-card)', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
          >
            Client Voices
          </span>
          <h1 className="font-serif text-[#166D74]">Relational Transformations &amp; Journeys</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            Read verified feedback from individuals and couples who have completed our relationship guidance and intimacy advisory tracks.
          </p>
        </SectionReveal>

        {loading ? (
          <div className="text-center py-20 font-sans text-sm" style={{ color: '#5F6C72' }}>
            Retrieving client narratives...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <SectionReveal key={t.id} delay={idx * 0.08}>
                <motion.div 
                  className="testimonial-card p-8 flex flex-col justify-between h-full animate-fadeIn"
                  whileHover={{ y: -6 }}
                  style={{ backgroundColor: 'var(--color-bg-card)' }}
                >
                  <div className="space-y-6 text-left">
                    {/* Rating Stars - Luxury Gold color */}
                    <div className="flex space-x-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C9A646] text-[#C9A646]" />
                      ))}
                    </div>
                    <p className="font-serif text-base leading-relaxed italic text-[#166D74]">
                      &ldquo;{t.testimonial_text}&rdquo;
                    </p>
                  </div>

                  <div 
                    className="pt-6 mt-8 flex items-center gap-4 font-sans text-left"
                    style={{ borderTop: '1px solid rgba(64,192,192,0.12)' }}
                  >
                    <div 
                      className="w-10 h-10 flex items-center justify-center font-bold text-xs rounded-full shadow-sm"
                      style={{ backgroundColor: 'rgba(64,192,192,0.1)', color: '#166D74', border: '1px solid rgba(64,192,192,0.15)' }}
                    >
                      {t.client_initials}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#166D74]">{t.client_name}</h4>
                      <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#C9A646' }}>{t.service_category}</span>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}

            {testimonials.length === 0 && (
              <p className="text-center text-sm col-span-3 py-12" style={{ color: '#5F6C72' }}>No client stories loaded yet.</p>
            )}
          </div>
        )}

      </div>
    </BackgroundWrapper>
    </>
  );
}

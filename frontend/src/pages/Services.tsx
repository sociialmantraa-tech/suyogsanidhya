import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { usePublicData } from '../context/PublicDataContext';
import { Service } from '../types';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';
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

export default function Services() {
  const { services, loading } = usePublicData();

  const CardSkeleton = () => (
    <div className="editorial-card p-8 animate-pulse space-y-6 bg-white">
      <div className="h-4 bg-[#40C0C0]/10 rounded-full w-1/3"></div>
      <div className="h-8 bg-[#40C0C0]/10 rounded-full w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-[#40C0C0]/10 rounded-full w-full"></div>
        <div className="h-3 bg-[#40C0C0]/10 rounded-full w-5/6"></div>
      </div>
      <div className="h-10 bg-[#40C0C0]/10 rounded-full w-full pt-4"></div>
    </div>
  );

  return (
    <>
      <SEO
        title="Consultation Programs"
        description="Tailored relationship and intimacy guidance programs for individuals and couples. Explore our confidential consultations with Abhay Harpale."
        canonical="/services"
      />
      <BackgroundWrapper
        variant="primary"
        patternType="curves"
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative">
        
        {/* Header Block */}
        <SectionReveal className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold animate-pulse" style={{ color: '#C9A646' }}>Offerings</span>
          <h1 className="font-serif text-[#166D74]">Relationship Guidance Programs</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            Tailor-made, confidential consultations and coaching programs structured to improve communication and emotional closeness.
          </p>
        </SectionReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: Service, idx: number) => (
              <SectionReveal key={service.id} delay={idx * 0.08}>
                <motion.div 
                  className="service-card p-8 flex flex-col justify-between group h-full"
                  whileHover={{ y: -8 }}
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="space-y-6 text-left">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-serif italic font-medium"
                        style={{ fontSize: '3rem', color: '#166D74', opacity: 0.85, lineHeight: 1 }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span 
                        className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] leading-none rounded-full"
                        style={{ backgroundColor: '#FCF8F1', color: '#166D74', border: '1px solid rgba(64,192,192,0.15)' }}
                      >
                        {service.category_name}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl group-hover:text-[#40C0C0] transition-colors text-[#166D74]">
                      {service.title}
                    </h2>
                    <p className="font-sans text-[15px] font-medium leading-[1.65] tracking-normal line-clamp-4" style={{ color: '#5F6C72' }}>
                      {service.short_description}
                    </p>
                  </div>

                  <div className="pt-8 mt-8 space-y-6" style={{ borderTop: '1px solid rgba(64,192,192,0.12)' }}>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-[0.06em] leading-none" style={{ color: '#166D74' }}>
                        <Clock className="w-4 h-4" style={{ color: '#40C0C0' }} />
                        {service.duration} minutes
                      </span>
                      <span className="font-sans text-[15px] font-bold" style={{ color: '#166D74' }}>
                        {service.sale_price ? (
                          <>
                            <span className="line-through text-[12px] font-medium mr-1 decoration-1" style={{ color: '#88949B' }}>INR {service.price}</span>
                            INR {service.sale_price}
                          </>
                        ) : (
                          `INR ${service.price}`
                        )}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        to={`/services/${service.slug}`} 
                        variant="outline"
                        className="w-full text-center py-2.5 text-[12px]"
                      >
                        Learn More
                      </Button>
                      <Button 
                        to="/book" 
                        variant="primary"
                        className="w-full text-center py-2.5 text-[12px]"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        )}

        {/* FAQs Redirection */}
        <SectionReveal>
          <div 
            className="custom-card p-8 md:p-12 text-center space-y-6 max-w-3xl mx-auto mt-20"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(64,192,192,0.15)',
              boxShadow: '0 15px 40px rgba(22,109,116,0.03)'
            }}
          >
            <h3 className="font-serif text-xl text-[#166D74]">Need a custom couples guidance schedule or private online package?</h3>
            <p className="font-sans text-sm max-w-lg mx-auto" style={{ color: '#5F6C72' }}>
              We provide customized consulting blueprints for unique long-term partnership goals and distant communication recovery schedules.
            </p>
            <Button to="/contact" variant="primary" showArrow={true}>
              Get In Touch
            </Button>
          </div>
        </SectionReveal>

      </div>
    </BackgroundWrapper>
    </>
  );
}

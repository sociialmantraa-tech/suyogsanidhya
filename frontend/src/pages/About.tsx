import React, { useRef } from 'react';
import { Award, BookOpen, ShieldCheck } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import abhayImage from '../assets/abhay.jpg';
import BackgroundWrapper from '../components/BackgroundWrapper';
import SectionDivider from '../components/SectionDivider';
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

export default function About() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="w-full">
      <SEO
        title="About Abhay Harpale"
        description="Certified Psychologist, Vedic Astrologer, and Gold Medalist in Performing Arts with 27+ years of experience in relationship and intimacy counselling."
        canonical="/about"
      />
      
      {/* Editorial Profile Section */}
      <BackgroundWrapper
        variant="primary"
        patternType="lotus"
        className="pt-36 pb-28 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <SectionReveal className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4]">
              {/* Background offset decorative blocks */}
              <div 
                className="absolute inset-0 rounded-[32px] translate-x-[24px] translate-y-[18px] pointer-events-none z-0 blur-[1px]"
                style={{ backgroundColor: 'rgba(64,192,192,0.06)', boxShadow: '0 20px 50px rgba(22,109,116,0.04)' }}
              />
              <div 
                className="absolute -bottom-8 -left-12 w-40 h-40 rounded-full pointer-events-none z-0"
                style={{ border: '1.2px solid rgba(201,166,70,0.15)' }}
              />
              
              {/* Inset Frame Container */}
              <div 
                className="absolute inset-0 rounded-[28px] overflow-hidden group z-10"
                style={{
                  border: '8px solid #FFFFFF',
                  outline: '1.5px solid rgba(64,192,192,0.15)',
                  boxShadow: '0 25px 50px rgba(22,109,116,0.06)',
                }}
              >
                <img 
                  src={abhayImage} 
                  alt="Abhay Harpale" 
                  className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div 
                  className="absolute bottom-8 left-8 right-8 backdrop-blur-md p-4 text-left rounded-xl shadow-sm z-20"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(64,192,192,0.15)',
                  }}
                >
                  <h3 className="font-serif text-lg mb-0.5 font-bold" style={{ color: '#166D74' }}>Abhay Harpale</h3>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: '#40C0C0' }}>Relationship &amp; Intimacy Advisor</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="lg:col-span-7 space-y-6 text-left" delay={0.15}>
            <span 
              className="inline-block px-4 py-1.5 eyebrow-label uppercase rounded-full"
              style={{ backgroundColor: '#FFFFFF', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
            >
              The Narrative
            </span>
            <h1 className="font-serif leading-tight text-[#166D74]">
              Certified Psychologist, Vedic Astrologer & Gold Medalist in Performing Arts
            </h1>
            <p className="font-sans text-[17px] font-normal leading-[1.75] max-w-[650px]" style={{ color: '#5F6C72' }}>
              Abhay Harpale brings over 27 years of professional theatre experience and a lifetime of dedication to understanding human emotions, relationships, and authentic expression. Through <em>Suyog Sannidhya</em>, he combines the timeless wisdom of Kamasutra, Vedic Astrology, and Psychology into a holistic, practical, and deeply personalized approach to relationship and intimacy counselling.
            </p>
            <p className="font-sans text-[15px] font-medium leading-[1.75] max-w-[650px]" style={{ color: '#166D74' }}>
              With compassion, confidentiality, and deep insight, Abhay helps individuals and couples strengthen emotional connections, improve communication, deepen intimacy, and build healthier, more fulfilling relationships — in a safe, non-judgmental space that fosters self-awareness, mutual understanding, healing, and lasting transformation.
            </p>
          </SectionReveal>
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* Credentials Grid */}
      <BackgroundWrapper
        variant="secondary"
        patternType="concentric"
        className="py-28 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <SectionReveal className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold block" style={{ color: '#C9A646' }}>Qualifications</span>
            <h2 className="font-serif text-[#166D74]">Background &amp; Guidance Milestones</h2>
            <p className="font-sans text-sm max-w-[650px] mx-auto" style={{ color: '#5F6C72' }}>
              Professional focus areas and coaching principles behind our consultations.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: 'Certified Psychologist & Gold Medalist', desc: 'Certified Psychologist and Gold Medalist in Bachelor of Performing Arts (BPA) — blending the science of the mind with the art of human expression to guide relationships with empathy and insight.' },
              { icon: BookOpen, title: 'Vedic Astrologer & Kamasutra Scholar', desc: 'Integrating the timeless wisdom of Vedic Astrology and Kamasutra with modern psychology through Suyog Sannidhya — offering a holistic, ancient-meets-contemporary approach to intimacy and relationship counselling.' },
              { icon: ShieldCheck, title: '27+ Years of Theatre & Human Expression', desc: 'Over 27 years of professional theatre experience rooted in understanding authentic human emotion, communication, and connection — applied directly to creating safe, transformative counselling sessions.' },
            ].map((item, idx) => (
              <SectionReveal key={item.title} delay={idx * 0.1}>
                <div 
                  className="editorial-card p-8 space-y-4 text-left h-full"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid rgba(64,192,192,0.12)',
                    boxShadow: '0 10px 30px rgba(22,109,116,0.02)'
                  }}
                >
                  <item.icon className="w-8 h-8" style={{ color: '#40C0C0' }} />
                  <h3 className="font-serif text-lg" style={{ color: '#166D74' }}>{item.title}</h3>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: '#5F6C72' }}>
                    {item.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* Core Values / Methodology */}
      <BackgroundWrapper
        variant="alternate"
        patternType="geometry"
        className="py-28 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div 
              className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left relative overflow-hidden"
              style={{
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #166D74, rgba(64,192,192,0.95), #008B8B)',
                boxShadow: '0 30px 60px rgba(22,109,116,0.12)',
              }}
            >
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="about-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill="#FFFFFF" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#about-grid)" />
                </svg>
              </div>

              <div className="lg:col-span-8 space-y-6 relative z-10">
                <h2 className="font-serif text-white">The Suyog Sannidhya Approach</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold uppercase tracking-wider" style={{ color: '#C9A646' }}>Holistic Wisdom</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,245,0.9)' }}>
                      Suyog Sannidhya weaves together the timeless teachings of Kamasutra, Vedic Astrology, and Psychology to offer a truly personalized and culturally rooted path to relationship wellbeing.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold uppercase tracking-wider" style={{ color: '#C9A646' }}>Compassion & Confidentiality</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,245,0.9)' }}>
                      Every session is held in a safe, non-judgmental space that prioritises your privacy, fosters self-awareness, mutual understanding, healing, and lasting transformation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center text-center relative z-10">
                <div 
                  className="p-8 max-w-xs space-y-2 backdrop-blur-md rounded-2xl"
                  style={{ border: '1px solid rgba(201,166,70,0.45)', backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <span className="font-serif text-3xl font-bold" style={{ color: '#C9A646' }}>27+</span>
                  <p className="font-sans text-xs uppercase tracking-wider text-white">Years of Professional Experience</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </BackgroundWrapper>

    </div>
  );
}

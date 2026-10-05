'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Shield, Check } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { demoServices } from '../data/demoServices';
import { Service } from '../types';
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
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get<{ service: Service }>(`/services/detail.php?slug=${slug}`)
      .then(data => {
        if (data && data.service) {
          setService(data.service);
        } else {
          const found = demoServices.find(s => s.slug === slug);
          if (found) {
            setService(found);
          } else {
            setError("Service program not found.");
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Service detail loading failed, trying fallback:", err);
        const found = demoServices.find(s => s.slug === slug);
        if (found) {
          setService(found);
        } else {
          setError("An error occurred while loading this program details.");
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <BackgroundWrapper variant="primary" className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10 animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-[#40C0C0]/10 rounded-full w-48 mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="h-4 bg-[#40C0C0]/10 rounded-full w-24" />
                <div className="h-10 bg-[#40C0C0]/10 rounded-full w-3/4" />
                <div className="h-8 bg-[#40C0C0]/10 rounded-full w-1/2 pt-4" />
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-4 bg-[#40C0C0]/10 rounded-full w-full" />
                <div className="h-4 bg-[#40C0C0]/10 rounded-full w-full" />
                <div className="h-4 bg-[#40C0C0]/10 rounded-full w-5/6" />
              </div>
            </div>
            
            {/* Right Sidebar Column */}
            <div className="lg:col-span-5">
              <div className="h-96 bg-[#40C0C0]/10 rounded-[28px] w-full" />
            </div>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  if (error || !service) {
    return (
      <BackgroundWrapper variant="primary" className="min-h-screen flex flex-col items-center justify-center pt-20 space-y-4">
        <h2 className="font-serif text-2xl text-[#166D74]">{error || "Program Not Found"}</h2>
        <Button to="/services" variant="primary">Back to Services</Button>
      </BackgroundWrapper>
    );
  }

  const handleBookRedirect = () => {
    localStorage.setItem('selected_booking_service_id', service.id.toString());
    router.push('/book');
  };

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="curves"
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="font-sans text-[13px] flex items-center space-x-2 text-[#5F6C72]">
          <Link href="/" className="animated-link" style={{ color: '#5F6C72' }}>Home</Link>
          <span>/</span>
          <Link href="/services" className="animated-link" style={{ color: '#5F6C72' }}>Services</Link>
          <span>/</span>
          <span className="font-semibold text-[#166D74]">{service.title}</span>
        </nav>

        {/* Content Splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Details */}
          <SectionReveal className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <span className="eyebrow-label uppercase" style={{ color: '#C9A646' }}>
                {service.category_name}
              </span>
              <h1 className="font-serif leading-tight text-[#166D74]">
                {service.title}
              </h1>
              <div 
                className="flex items-center gap-6 text-[13px] font-sans pt-2 py-4"
                style={{ borderTop: '1px solid rgba(64,192,192,0.12)', borderBottom: '1px solid rgba(64,192,192,0.12)' }}
              >
                <span className="flex items-center gap-1.5 font-medium text-[#166D74]">
                  <Clock className="w-4 h-4" style={{ color: '#40C0C0' }} />
                  Session Duration: {service.duration} Mins
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#166D74]">
                  <Shield className="w-4 h-4" style={{ color: '#40C0C0' }} />
                  100% Secure &amp; Confidential
                </span>
              </div>
            </div>

            {/* Rich Content Description */}
            <div 
              className="font-sans text-sm leading-relaxed space-y-6 markdown-content"
              style={{ color: '#5F6C72' }}
              dangerouslySetInnerHTML={{ __html: service.full_description }}
            />

            {/* Mapped Concerns */}
            {service.concerns && service.concerns.length > 0 && (
              <div className="pt-8 space-y-4">
                <h3 className="font-serif text-xl text-[#166D74]">This Program Helps With:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.concerns.map((c: { title: string; description?: string }, i: number) => (
                    <SectionReveal key={i} delay={i * 0.06}>
                      <div 
                        className="flex items-start gap-3 p-4 shadow-sm"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '20px',
                          border: '1.5px solid rgba(64,192,192,0.12)',
                        }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'rgba(64,192,192,0.1)', color: '#166D74' }}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-sans text-sm font-bold text-[#166D74]">{c.title}</h4>
                          <p className="font-sans text-xs mt-1 leading-relaxed" style={{ color: '#5F6C72' }}>{c.description}</p>
                        </div>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            )}
          </SectionReveal>

          {/* Booking / Sidebar Card */}
          <SectionReveal className="lg:col-span-5" delay={0.2}>
            <div 
              className="service-card p-8 sticky top-32 space-y-6 text-left"
              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(64,192,192,0.12)', borderRadius: '28px' }}
            >
              <span className="eyebrow-label uppercase tracking-widest block" style={{ color: '#C9A646' }}>Session Cost</span>
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-[24px] font-bold text-[#166D74]">
                  {service.sale_price ? `INR ${service.sale_price}` : `INR ${service.price}`}
                </span>
                {service.sale_price && (
                  <span className="line-through text-[12px] font-medium decoration-1" style={{ color: '#88949B' }}>INR {service.price}</span>
                )}
              </div>

              <div className="space-y-4 text-xs font-sans pt-6" style={{ color: '#5F6C72', borderTop: '1px solid rgba(64,192,192,0.12)' }}>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: '#40C0C0' }} />
                  Conducted entirely online via secure video call
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: '#40C0C0' }} />
                  Confidential individual or joint options
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: '#40C0C0' }} />
                  Flexible 24-hour rescheduling
                </p>
              </div>

              <div className="pt-2 flex flex-col items-stretch">
                <Button 
                  onClick={handleBookRedirect}
                  variant="primary"
                  className="w-full"
                  showArrow={true}
                >
                  Schedule Private Session
                </Button>
              </div>
            </div>
          </SectionReveal>

        </div>

      </div>
    </BackgroundWrapper>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublicData } from '../context/PublicDataContext';
import { Service } from '../types';
import SEO from '../components/SEO';
import MandalaPattern from '../components/MandalaPattern';
import MeshGradient from '../components/MeshGradient';

export default function Services() {
  const { services } = usePublicData();

  return (
    <div className="w-full">
      <SEO
        title="Our Services | Consultation Programs — Abhay Harpale"
        description="Comprehensive couple compatibility checks, pre-marriage counselling, and relationship clarity programs blending Vedic astrology with relational psychology."
        canonical="/services"
      />

      <section className="relative pt-12 pb-24 px-6 md:px-12 bg-[#FFFFFC] overflow-hidden">
        {/* Ambient mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <MeshGradient />
        </div>

        <MandalaPattern
          type="sacred"
          className="absolute -right-20 top-20 w-[450px] h-[450px] text-[#C9A646]"
          opacity={0.025}
        />

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          {/* Header Block */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5F3] border border-[#D0EAE4] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A646]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#0F5D66]">
                Advisory Programs
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0F5D66] tracking-tight">
              Our Services
            </h1>
            
            <p className="font-sans text-base sm:text-lg text-[#55696E] leading-relaxed max-w-2xl mx-auto">
              Personalized guidance programs crafted to restore mutual understanding, emotional closeness, and conscious compatibility through Vedic astrology and relational psychology.
            </p>
          </div>

          {/* Services Grid (All visible immediately without blocking) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: Service, idx: number) => (
              <motion.div
                key={service.id || idx}
                className="bg-white rounded-3xl p-8 border border-[rgba(22,109,116,0.12)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#166D74] via-[#C9A646] to-[#166D74] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-serif italic font-medium text-3xl text-[#166D74]/80 leading-none"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F8F6] text-[#166D74] border border-[#D0EAE4]">
                      {service.category_name || 'Consultation'}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-semibold text-[#0F5D66] group-hover:text-[#166D74] transition-colors leading-snug">
                    {service.title}
                  </h2>

                  <p className="font-sans text-sm text-[#5E6E72] leading-relaxed line-clamp-3">
                    {service.short_description || service.full_description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#166D74]">
                      <Clock className="w-3.5 h-3.5 text-[#C9A646]" />
                      {service.duration || 60} mins
                    </span>
                    <span className="font-sans text-base font-bold text-[#0F5D66]">
                      {service.sale_price ? (
                        <>
                          <span className="line-through text-xs font-medium mr-1 text-slate-400">INR {service.price}</span>
                          INR {service.sale_price}
                        </>
                      ) : (
                        `INR ${service.price || 4999}`
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href={`/services/${service.slug || service.id}`}
                      className="py-2.5 px-4 rounded-full font-sans text-xs font-semibold text-center text-[#0F5D66] bg-[#F2F8F6] border border-[#D0EAE4] hover:bg-[#E2F0EC] transition-colors"
                    >
                      Learn More
                    </Link>
                    <Link
                      href={`/book?service=${service.slug || service.id}`}
                      className="py-2.5 px-4 rounded-full font-sans text-xs font-bold text-center text-white transition-all hover:scale-[1.02] shadow-xs"
                      style={{
                        background: 'linear-gradient(135deg, #166D74 0%, #0F5D66 100%)',
                      }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Help Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#F2F8F6] to-[#E7F3F0] border border-[#D0EAE4] text-center max-w-3xl mx-auto space-y-4 shadow-sm">
            <h3 className="font-serif text-2xl font-semibold text-[#0F5D66]">
              Need a Custom Consultation Plan?
            </h3>
            <p className="font-sans text-sm text-[#5E6E72] max-w-lg mx-auto leading-relaxed">
              We provide tailored guidance for unique relationship situations, pre-marital alignment, or distant communication challenges.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #166D74 0%, #0F5D66 100%)',
                }}
              >
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

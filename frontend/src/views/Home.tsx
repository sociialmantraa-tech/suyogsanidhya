'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, HeartHandshake, ShieldCheck, Sparkles, MessageCircle, Mail, MapPin, Linkedin, Facebook, Instagram, Youtube, Phone } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import abhayHeroImg from '../assets/abhay_blue_blazer.jpg';
import abhayCutoutImg from '../assets/abhay_blue_blazer_cutout.png';
import { usePublicData } from '../context/PublicDataContext';
import BackgroundWrapper from '../components/BackgroundWrapper';
import SEO from '../components/SEO';
import MandalaPattern from '../components/MandalaPattern';
import MeshGradient from '../components/MeshGradient';

const abhayHero = typeof abhayHeroImg === 'string' ? abhayHeroImg : (abhayHeroImg as any)?.src || abhayHeroImg;

export default function Home() {
  const { services, siteSettings } = usePublicData();
  const settings = siteSettings;

  return (
    <div className="w-full">
      <SEO
        title="Abhay Harpale | Founder, Suyog Saanidhya — Relationship & Astrology Guardian"
        description="Your trusted guardian for couple compatibility and relationship clarity through the timeless synthesis of Vedic astrology and modern psychology."
        canonical="/"
      />

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO SECTION (As per Wireframe Page 1)
          Photo on Left, Title/Bio/Buttons on Right
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] pt-32 sm:pt-36 pb-20 flex items-center overflow-hidden bg-[#FFFFFC]">
        {/* Ambient mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <MeshGradient />
        </div>

        {/* Sacred Geometry watermark */}
        <MandalaPattern
          type="sacred"
          className="absolute -right-20 top-1/4 w-[500px] h-[500px] text-[#C9A646]"
          opacity={0.03}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Original Professional Photo with full background */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-start"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[36px] p-2">
                {/* Background soft glow plate */}
                <div
                  className="absolute inset-0 rounded-[36px] -z-10 blur-xl opacity-60 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0,170,193,0.2) 0%, rgba(0,107,125,0.1) 60%, transparent 80%)'
                  }}
                />
                
                {/* Image Border Container */}
                <div
                  className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl group flex items-center justify-center bg-gray-100"
                  style={{
                    border: '4px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 24px 60px -12px rgba(0, 170, 193, 0.18)'
                  }}
                >
                  <img
                    src={abhayHero}
                    alt="Abhay Harpale — Founder, Suyog Saanidhya"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Corner Gold Lotus Accent */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-[#00AAC1]/30 shadow-xs flex items-center gap-1.5 z-10">
                    <Sparkles className="w-3.5 h-3.5 text-[#00AAC1]" />
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#006B7D]">Vedic &amp; Psychology</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Abhay Harpale Bio, Badge, and Action Buttons */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-left"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/20 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#00AAC1] animate-pulse" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#006B7D]">
                  Founder, Suyog Saanidhya
                </span>
              </div>

              {/* Founder Name */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1F2937] tracking-tight leading-[1.1]">
                Abhay Harpale
              </h1>

              {/* Tagline */}
              <p className="font-serif italic text-2xl sm:text-3xl text-[#006B7D] leading-snug">
                Your Relationship And Astrology Guardian
              </p>

              <p className="font-sans text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
                Guiding couples and individuals toward conscious intimacy, mutual understanding, and lifelong harmony through the combined wisdom of astrology and relational psychology.
              </p>

              {/* CTA Buttons (About Me & Book Session) */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/about"
                  className="px-8 py-3.5 rounded-full font-sans text-sm font-bold text-[#00AAC1] bg-white border-2 border-[#00AAC1] shadow-xs hover:bg-[#EBF7F7] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>About Me</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/book"
                  className="px-8 py-3.5 rounded-full font-sans text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-xl hover:shadow-[#00AAC1]/25 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badge Indicators */}
              <div className="pt-6 border-t border-[rgba(0,170,193,0.1)] flex flex-wrap items-center gap-6 text-xs text-[#6B7280] font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00AAC1]" /> 100% Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#006B7D]" /> Compassionate Guidance
                </span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#00AAC1]" /> Astrology &amp; Psychology
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. OUR SERVICES SECTION (As per Wireframe Page 1)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-6 md:px-12 relative bg-[#F7FAF9] border-y border-[rgba(22,109,116,0.08)]">
        <MandalaPattern
          type="lattice"
          className="absolute inset-0 w-full h-full text-[#166D74]"
          opacity={0.015}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#00AAC1]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00AAC1]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#006B7D]">
                Astrological &amp; Psychological Harmony
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2937]">
              Our Services
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#4B5563] leading-relaxed">
              Specialized advisory programs designed to untangle complex emotions and illuminate clear pathways forward.
            </p>
          </div>

          {/* Services Grid (As per wireframe 3 columns x 2 rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                className="bg-white rounded-3xl p-8 border border-[rgba(0,170,193,0.12)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                {/* Top decorative accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#00AAC1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-4">
                  {/* Category Pill */}
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20">
                    {service.category_name || 'Consultation'}
                  </span>

                  {/* Service Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F2937] group-hover:text-[#00AAC1] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="font-sans text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                    {service.short_description || service.full_description}
                  </p>
                </div>

                {/* Book Now Button (Leads to calendar booking) */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={`/book?service=${service.slug || service.id}`}
                    className="inline-flex items-center justify-between w-full py-3 px-5 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-[#00AAC1] bg-[#EBF7F7] border border-[#00AAC1]/20 group-hover:bg-[#00AAC1] group-hover:text-white group-hover:border-[#00AAC1] transition-all duration-300 shadow-xs"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Services Link */}
          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#00AAC1] hover:text-[#0092A8] hover:underline"
            >
              <span>Explore All Consultation Offerings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. CONTACT US SECTION (As per Wireframe Page 1)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-6 md:px-12 relative bg-[#FFFFFC]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-[#F2F8F6] to-[#E7F3F0] rounded-[36px] p-8 sm:p-14 lg:p-16 border border-[rgba(22,109,116,0.12)] shadow-lg">
            
            <div className="max-w-3xl mb-12">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#B8943A] block mb-2">
                Get In Touch
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F5D66]">
                Contact Us
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#5E6E72] mt-2">
                Have questions or need private guidance? Reach out directly through any of our official channels.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left: Contact Coordinates (Address, WhatsApp, Email) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Address */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-[#D0EAE4] shadow-xs">
                  <div className="p-3 rounded-xl bg-[#EAF5F3] text-[#166D74] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#71858A] block">
                      Address :
                    </span>
                    <span className="font-serif text-lg font-medium text-[#0F5D66]">
                      {settings.contact_address || 'Online Sessions Only'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${(settings.contact_whatsapp || '9152962255').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-[#D0EAE4] shadow-xs hover:shadow-md hover:border-[#25D366] transition-all group"
                >
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#71858A] block">
                      WhatsApp us at :
                    </span>
                    <span className="font-sans text-lg font-semibold text-[#0F5D66] group-hover:text-[#25D366] transition-colors">
                      {settings.contact_whatsapp || '+91 91529 62255'}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.contact_email || 'suyogsaanidhya@gmail.com'}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-[#D0EAE4] shadow-xs hover:shadow-md hover:border-[#166D74] transition-all group"
                >
                  <div className="p-3 rounded-xl bg-[#EAF5F3] text-[#166D74] shrink-0 group-hover:bg-[#166D74] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#71858A] block">
                      E-mail Us at :
                    </span>
                    <span className="font-sans text-lg font-semibold text-[#0F5D66] group-hover:text-[#166D74] transition-colors break-all">
                      {settings.contact_email || 'suyogsaanidhya@gmail.com'}
                    </span>
                  </div>
                </a>

              </div>

              {/* Right: Our Socials with Embedded Interactive Buttons */}
              <div className="lg:col-span-5 p-8 rounded-3xl bg-white/90 border border-[#D0EAE4] shadow-sm space-y-6">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#B8943A] block mb-1">
                    Connect With Us
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[#0F5D66]">
                    Our Socials :
                  </h3>
                </div>

                <p className="font-sans text-xs text-[#5E6E72] leading-relaxed">
                  Join our social communities for regular astrological relationship insights, video discussions, and guidance updates.
                </p>

                {/* Social Button Grid */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* LinkedIn - Only render if valid custom URL provided */}
                  {settings.social_linkedin && settings.social_linkedin !== '#' && !settings.social_linkedin.includes('linkedin.com/in/abhayharpale') && (
                    <a
                      href={settings.social_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-12 h-12 rounded-2xl bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${(settings.contact_whatsapp || '9152962255').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={settings.social_facebook || 'https://facebook.com/suyogsaanidhya'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={settings.social_instagram || 'https://instagram.com/suyogsaanidhya'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-12 h-12 rounded-2xl bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>

                  {/* YouTube */}
                  <a
                    href={settings.social_youtube || 'https://www.youtube.com/@suyogsaanidhya'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-12 h-12 rounded-2xl bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>

                {/* Consultation Quick Card */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                  >
                    <span>Schedule Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

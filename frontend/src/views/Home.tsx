'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, HeartHandshake, ShieldCheck, Sparkles, MessageCircle, Mail, MapPin, Linkedin, Facebook, Instagram, Youtube, Star, CheckCircle, Flame, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import abhayHeroImg from '../assets/abhay_blue_blazer.jpg';
import celestialBgImg from '../assets/celestial_astrology_bg.jpg';
import relationshipBgImg from '../assets/relationship_harmony_bg.jpg';
import { usePublicData } from '../context/PublicDataContext';
import SEO from '../components/SEO';
import MandalaPattern from '../components/MandalaPattern';
import MeshGradient from '../components/MeshGradient';

const abhayHero = typeof abhayHeroImg === 'string' ? abhayHeroImg : (abhayHeroImg as any)?.src || abhayHeroImg;
const celestialBg = typeof celestialBgImg === 'string' ? celestialBgImg : (celestialBgImg as any)?.src || celestialBgImg;
const relationshipBg = typeof relationshipBgImg === 'string' ? relationshipBgImg : (relationshipBgImg as any)?.src || relationshipBgImg;

export default function Home() {
  const { services, siteSettings } = usePublicData();
  const settings = siteSettings;

  return (
    <div className="w-full overflow-hidden">
      <SEO
        title="Abhay Harpale | Founder, Suyog Saanidhya — Relationship & Astrology Guardian"
        description="Your trusted guardian for couple compatibility and relationship clarity through the timeless synthesis of Vedic astrology and modern psychology."
        canonical="/"
      />

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO SECTION (With Celestial Background Texture & Ambient Glow)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] pt-32 sm:pt-36 pb-24 flex items-center overflow-hidden bg-[#FFFFFC]">
        
        {/* Thematic Celestial Background Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={celestialBg}
            alt=""
            className="w-full h-full object-cover object-center opacity-25 mix-blend-multiply filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFC]/60 via-transparent to-[#FFFFFC]" />
        </div>

        {/* Ambient mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
          <MeshGradient />
        </div>

        {/* Sacred Geometry Watermark */}
        <MandalaPattern
          type="sacred"
          className="absolute -right-24 top-1/4 w-[550px] h-[550px] text-[#C9A646]"
          opacity={0.04}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Original Professional Photo with full background plate */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-start"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[38px] p-2">
                {/* Background soft glow plate */}
                <div
                  className="absolute inset-0 rounded-[38px] -z-10 blur-2xl opacity-70 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0,170,193,0.3) 0%, rgba(201,166,70,0.2) 50%, transparent 80%)'
                  }}
                />
                
                {/* Image Border Container */}
                <div
                  className="relative w-full h-full rounded-[34px] overflow-hidden shadow-2xl group flex items-center justify-center bg-gray-100"
                  style={{
                    border: '4px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 24px 60px -12px rgba(0, 170, 193, 0.22)'
                  }}
                >
                  <img
                    src={abhayHero}
                    alt="Abhay Harpale — Founder, Suyog Saanidhya"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Corner Gold Badge Accent */}
                  <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#00AAC1]/30 shadow-sm flex items-center gap-1.5 z-10">
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
          2. DUAL-LENS SYNTHESIS SECTION (Vedic Wisdom + Relational Psychology)
          Atmospheric Darkness & Luminous Gold Lotus Overlay
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 relative bg-[#092B30] text-white overflow-hidden">
        
        {/* Background Artwork Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
          <img
            src={relationshipBg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        <MandalaPattern
          type="sacred"
          className="absolute -left-20 -bottom-20 w-[600px] h-[600px] text-[#C9A646]"
          opacity={0.05}
        />

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C9A646]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A646]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#E5C365]">
                Our Unique Methodology
              </span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-snug">
              Where Ancient Vedic Wisdom Meets Modern Relational Psychology
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              We move beyond one-dimensional advice by synthesizing deep planetary synastry with evidence-based relationship profiling to illuminate clarity from every perspective.
            </p>
          </div>

          {/* Two Lens Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Lens 1: Vedic Astrology */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#C9A646]/50 transition-all duration-300 space-y-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A646]/20 to-[#C9A646]/5 border border-[#C9A646]/40 flex items-center justify-center text-[#E5C365] group-hover:scale-110 transition-transform">
                <Sun className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C9A646]">
                  Lens 1 — Astrological Blueprint
                </span>
                <h3 className="font-serif text-2xl font-semibold text-white">
                  Vedic Astrological Synastry
                </h3>
                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  Deep Kundali Milan &amp; Guna assessment evaluating planetary alignments, Moon &amp; Venus placements, Dasha timeline transitions, and remedial mitigations for long-term marital harmony.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs font-sans text-slate-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A646] shrink-0" />
                  <span>Comprehensive Kundali &amp; Horoscope Matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A646] shrink-0" />
                  <span>Dosha Analysis (Manglik, Bhakoot, Nadi) &amp; Remedies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A646] shrink-0" />
                  <span>Dasha Period &amp; Favorable Timeline Guidance</span>
                </li>
              </ul>
            </motion.div>

            {/* Lens 2: Relational Psychology */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#00AAC1]/50 transition-all duration-300 space-y-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00AAC1]/20 to-[#00AAC1]/5 border border-[#00AAC1]/40 flex items-center justify-center text-[#00C4D9] group-hover:scale-110 transition-transform">
                <Moon className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#00AAC1]">
                  Lens 2 — Psychological Profile
                </span>
                <h3 className="font-serif text-2xl font-semibold text-white">
                  Relational &amp; Behavioral Psychology
                </h3>
                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  Evidence-based relationship mapping examining attachment styles, cognitive argument triggers, core expectation alignment, and constructive communication tools.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs font-sans text-slate-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span>Attachment Style &amp; Emotional Intelligence Mapping</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span>Constructive Conflict &amp; Communication Workbooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span>Role Expectations, Career &amp; Lifestyle Alignment</span>
                </li>
              </ul>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. OUR SERVICES SECTION (Centered 2-Column Grid with Celestial Texture)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-6 md:px-12 relative bg-[#F7FAF9] border-y border-[rgba(22,109,116,0.08)]">
        
        {/* Background Celestial Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <img
            src={celestialBg}
            alt=""
            className="w-full h-full object-cover object-center mix-blend-multiply"
          />
        </div>

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

          {/* Services Grid (2 specialized consultation programs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-[rgba(0,170,193,0.14)] shadow-sm hover:shadow-2xl hover:shadow-[#00AAC1]/10 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                {/* Top decorative accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00C4D9] to-[#008496] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-5">
                  {/* Category Pill */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20">
                      {service.category_name || 'Astrology & Psychology'}
                    </span>
                    <span className="font-serif italic text-2xl font-bold text-[#00AAC1]/40">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F2937] group-hover:text-[#00AAC1] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="font-sans text-sm text-[#4B5563] leading-relaxed line-clamp-4">
                    {service.short_description || service.full_description}
                  </p>
                </div>

                {/* Book Now Button (Leads to calendar booking) */}
                <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-[#6B7280] font-medium">Session Duration: {service.duration || 75} Mins</span>
                    <span className="font-bold text-[#00AAC1]">{service.price_text || "To Be Confirmed"}</span>
                  </div>

                  <Link
                    href={`/book?service=${service.slug || service.id}`}
                    className="inline-flex items-center justify-between w-full py-3.5 px-6 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-[#00AAC1] bg-[#EBF7F7] border border-[#00AAC1]/20 group-hover:bg-[#00AAC1] group-hover:text-white group-hover:border-[#00AAC1] transition-all duration-300 shadow-xs"
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
          4. WHY CHOOSE US / THE GUARDIAN DIFFERENCE PILLARS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 relative bg-[#FFFFFC]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#006B7D]">
              The Guardian Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2937]">
              Why Couples &amp; Individuals Trust Abhay Harpale
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#4B5563] leading-relaxed">
              Rooted in empathy, discretion, and dual-lens clarity to guide you through your most delicate relationship decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-[#F7FAF9] border border-[rgba(0,170,193,0.12)] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF7F7] text-[#00AAC1] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1F2937]">Dual-Lens Synthesis</h3>
              <p className="font-sans text-xs text-[#4B5563] leading-relaxed">
                Blending time-tested Vedic astrological alignments with modern evidence-based psychological frameworks.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-[#F7FAF9] border border-[rgba(0,170,193,0.12)] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF7F7] text-[#006B7D] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1F2937]">100% Confidential</h3>
              <p className="font-sans text-xs text-[#4B5563] leading-relaxed">
                Conducted in a private, non-judgmental digital environment ensuring total privacy for all personal details.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-[#F7FAF9] border border-[rgba(0,170,193,0.12)] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF7F7] text-[#00AAC1] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1F2937]">Actionable Roadmap</h3>
              <p className="font-sans text-xs text-[#4B5563] leading-relaxed">
                Practical communication exercises, remedial guidance, and clear metrics rather than vague predictions.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 rounded-3xl bg-[#F7FAF9] border border-[rgba(0,170,193,0.12)] space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF7F7] text-[#006B7D] flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1F2937]">Empathic Guardian</h3>
              <p className="font-sans text-xs text-[#4B5563] leading-relaxed">
                Dedicated personal attention focused on building emotional security, mutual trust, and long-term connection.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. CONTACT US SECTION (With Relationship Harmony Backdrop Overlay)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-6 md:px-12 relative bg-[#FFFFFC]">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="relative rounded-[36px] p-8 sm:p-14 lg:p-16 border border-[rgba(22,109,116,0.15)] shadow-xl overflow-hidden bg-[#0D383F] text-white">
            
            {/* Relationship Harmony Background Backdrop Image */}
            <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen">
              <img
                src={relationshipBg}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="max-w-3xl mb-12 relative z-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#E5C365] block mb-2">
                Get In Touch
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
                Contact Us
              </h2>
              <p className="font-sans text-sm sm:text-base text-slate-200 mt-2">
                Have questions or need private guidance? Reach out directly through any of our official channels.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
              
              {/* Left: Contact Coordinates (Address, WhatsApp, Email) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Address */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
                  <div className="p-3 rounded-xl bg-[#00AAC1]/20 text-[#00C4D9] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Address :
                    </span>
                    <span className="font-serif text-lg font-medium text-white">
                      {settings.contact_address || 'Online Sessions Only'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${(settings.contact_whatsapp || '9152962255').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs hover:border-[#25D366] transition-all group"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-[#25D366] shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      WhatsApp us at :
                    </span>
                    <span className="font-sans text-lg font-semibold text-white group-hover:text-[#25D366] transition-colors">
                      {settings.contact_whatsapp || '+91 91529 62255'}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.contact_email || 'suyogsaanidhya@gmail.com'}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs hover:border-[#00C4D9] transition-all group"
                >
                  <div className="p-3 rounded-xl bg-[#00AAC1]/20 text-[#00C4D9] shrink-0 group-hover:bg-[#00AAC1] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      E-mail Us at :
                    </span>
                    <span className="font-sans text-lg font-semibold text-white group-hover:text-[#00C4D9] transition-colors break-all">
                      {settings.contact_email || 'suyogsaanidhya@gmail.com'}
                    </span>
                  </div>
                </a>

              </div>

              {/* Right: Our Socials with Embedded Interactive Buttons */}
              <div className="lg:col-span-5 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-6">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#E5C365] block mb-1">
                    Connect With Us
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-white">
                    Our Socials :
                  </h3>
                </div>

                <p className="font-sans text-xs text-slate-300 leading-relaxed">
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
                      className="w-12 h-12 rounded-2xl bg-white/10 text-white hover:bg-[#0077B5] flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
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
                    className="w-12 h-12 rounded-2xl bg-white/10 text-white hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={settings.social_facebook || 'https://facebook.com/suyogsaanidhya'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-12 h-12 rounded-2xl bg-white/10 text-white hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={settings.social_instagram || 'https://instagram.com/suyogsaanidhya'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-12 h-12 rounded-2xl bg-white/10 text-white hover:bg-[#E4405F] flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>

                  {/* YouTube */}
                  <a
                    href={settings.social_youtube || 'https://www.youtube.com/@suyogsaanidhya'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-12 h-12 rounded-2xl bg-white/10 text-white hover:bg-[#FF0000] flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>

                {/* Consultation Quick Card */}
                <div className="pt-4 border-t border-white/10">
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


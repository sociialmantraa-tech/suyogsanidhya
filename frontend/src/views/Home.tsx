'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, HeartHandshake, ShieldCheck, Sparkles, MessageCircle, Mail, MapPin, Linkedin, Facebook, Instagram, Youtube, Star, CheckCircle, Flame, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import abhayHeroImg from '../assets/abhay_blue_blazer.jpg';
import celestialBgImg from '../assets/celestial_astrology_bg.jpg';
import relationshipBgImg from '../assets/relationship_harmony_bg.jpg';
import lifestyleBannerImg from '../assets/lifestyle_banner.jpg';
import coupleHarmonyImg from '../assets/couple_harmony.jpg';
import { usePublicData } from '../context/PublicDataContext';
import SEO from '../components/SEO';
import MandalaPattern from '../components/MandalaPattern';
import MeshGradient from '../components/MeshGradient';

const abhayHero = typeof abhayHeroImg === 'string' ? abhayHeroImg : (abhayHeroImg as any)?.src || abhayHeroImg;
const celestialBg = typeof celestialBgImg === 'string' ? celestialBgImg : (celestialBgImg as any)?.src || celestialBgImg;
const relationshipBg = typeof relationshipBgImg === 'string' ? relationshipBgImg : (relationshipBgImg as any)?.src || relationshipBgImg;
const lifestyleBanner = typeof lifestyleBannerImg === 'string' ? lifestyleBannerImg : (lifestyleBannerImg as any)?.src || lifestyleBannerImg;
const coupleHarmony = typeof coupleHarmonyImg === 'string' ? coupleHarmonyImg : (coupleHarmonyImg as any)?.src || coupleHarmonyImg;

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
          1. HERO SECTION (Clean Theme-Based Soft Gradient & Photo Container)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] pt-32 sm:pt-36 pb-20 flex items-center overflow-hidden bg-gradient-to-b from-[#F2FAFA] via-[#FFFFFC] to-[#F7FAF9]">
        
        {/* Ambient mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
          <MeshGradient />
        </div>

        {/* Subtle Theme Geometry Accents */}
        <MandalaPattern
          type="sacred"
          className="absolute -right-24 top-1/4 w-[600px] h-[600px] text-[#C9A646]"
          opacity={0.03}
          animateRotation={true}
        />

        <MandalaPattern
          type="concentric"
          className="absolute -left-32 bottom-10 w-[450px] h-[450px] text-[#00AAC1]"
          opacity={0.02}
          animateRotation={true}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Left: Professional Photo Plate */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-start"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full max-w-[290px] sm:max-w-[360px] lg:max-w-[420px] aspect-[4/4.8] sm:aspect-[4/5] rounded-[32px] sm:rounded-[40px] p-2 bg-white shadow-[0_15px_45px_rgba(0,170,193,0.14)] border border-[#00AAC1]/15">
                {/* Image Container */}
                <div className="relative w-full h-full rounded-[26px] sm:rounded-[34px] overflow-hidden bg-slate-50 group">
                  <img
                    src={abhayHero}
                    alt="Abhay Harpale — Founder, Suyog Saanidhya"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Corner Badge Accent */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#00AAC1]/30 shadow-md flex items-center gap-1.5 z-10">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00AAC1]" />
                    <span className="text-[9.5px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-[#006B7D]">Vedic &amp; Psychology</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Abhay Harpale Bio, Badge, and Action Buttons */}
            <motion.div
              className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/25 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#00AAC1] animate-pulse" />
                <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#006B7D]">
                  Founder, Suyog Saanidhya
                </span>
              </div>

              {/* Founder Name */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#1F2937] tracking-tight leading-[1.1]">
                Abhay Harpale
              </h1>

              {/* Tagline */}
              <p className="font-serif italic text-xl sm:text-3xl text-[#006B7D] leading-snug">
                Your Relationship And Astrology Guardian
              </p>

              {/* Sanskrit Motto Pill */}
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#EBF7F7] via-white to-[#EBF7F7] border border-[#C9A646]/30 text-xs font-serif italic text-[#006B7D] shadow-xs">
                संवादात् सान्निध्यम् · <span className="font-sans not-italic text-[11px] text-[#5E6E72] font-medium">From Dialogue Emerges Connection</span>
              </div>

              <p className="font-sans text-sm sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
                Guiding couples and individuals toward conscious intimacy, mutual understanding, and lifelong harmony through the combined wisdom of astrology and relational psychology.
              </p>

              {/* CTA Buttons (About Me & Book Session) */}
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full max-w-xs sm:max-w-none">
                <Link
                  href="/about"
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-[#00AAC1] bg-white border-2 border-[#00AAC1] shadow-xs hover:bg-[#EBF7F7] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>About Me</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/book"
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-xl hover:shadow-[#00AAC1]/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badge Indicators */}
              <div className="pt-5 border-t border-[rgba(0,170,193,0.12)] flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-6 text-[11px] sm:text-xs text-[#6B7280] font-semibold w-full">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#00AAC1]/15 shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00AAC1]" /> 100% Confidential
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#00AAC1]/15 shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-[#006B7D]" /> Compassionate Guidance
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#00AAC1]/15 shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00AAC1]" /> Astrology &amp; Psychology
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. DUAL-LENS SYNTHESIS SECTION (Clean Theme-Based Methodology)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 px-6 md:px-12 relative bg-gradient-to-b from-[#F7FAF9] via-[#EBF7F7]/50 to-[#FFFFFC] text-[#1F2937] overflow-hidden border-y border-[#00AAC1]/10">
        
        <MandalaPattern
          type="sacred"
          className="absolute -left-20 -bottom-20 w-[600px] h-[600px] text-[#C9A646]"
          opacity={0.03}
          animateRotation={true}
        />

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#00AAC1]/25 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00AAC1]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#006B7D]">
                Our Unique Methodology
              </span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-snug text-[#1F2937]">
              Where Ancient Vedic Wisdom Meets Modern Relational Psychology
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
              We move beyond one-dimensional advice by synthesizing deep planetary synastry with evidence-based relationship profiling to illuminate clarity from every perspective.
            </p>
          </div>

          {/* Two Lens Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Lens 1: Vedic Astrology */}
            <motion.div
              className="bg-white rounded-3xl p-8 border border-[#C9A646]/30 shadow-md hover:shadow-xl transition-all duration-300 space-y-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FFFDF5] border border-[#C9A646]/40 flex items-center justify-center text-[#C9A646] group-hover:scale-110 transition-transform shadow-xs">
                <Sun className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C9A646]">
                  Lens 1 — Astrological Blueprint
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1F2937]">
                  Vedic Astrological Synastry
                </h3>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed">
                  Deep Kundali Milan &amp; Guna assessment evaluating planetary alignments, Moon &amp; Venus placements, Dasha timeline transitions, and remedial mitigations for long-term marital harmony.
                </p>
              </div>

              <ul className="space-y-3 text-xs font-sans text-[#374151] pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span><strong className="font-semibold text-[#1F2937]">Kundali &amp; Horoscope Matching:</strong> Deep birth chart evaluation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span><strong className="font-semibold text-[#1F2937]">Dosha Analysis &amp; Remedies:</strong> Manglik, Bhakoot &amp; Nadi mitigations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span><strong className="font-semibold text-[#1F2937]">Dasha Timelines:</strong> Favorable period mapping &amp; transits</span>
                </li>
              </ul>
            </motion.div>

            {/* Lens 2: Relational Psychology */}
            <motion.div
              className="bg-white rounded-3xl p-8 border border-[#00AAC1]/25 shadow-md hover:shadow-xl transition-all duration-300 space-y-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#EBF7F7] border border-[#00AAC1]/40 flex items-center justify-center text-[#00AAC1] group-hover:scale-110 transition-transform shadow-xs">
                <Moon className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#00AAC1]">
                  Lens 2 — Psychological Profile
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1F2937]">
                  Relational &amp; Behavioral Psychology
                </h3>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed">
                  Evidence-based relationship mapping examining attachment styles, cognitive argument triggers, core expectation alignment, and constructive communication tools.
                </p>
              </div>

              <ul className="space-y-3 text-xs font-sans text-[#374151] pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span><strong className="font-semibold text-[#1F2937]">Attachment Profiling:</strong> Emotional intelligence &amp; security mapping</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span><strong className="font-semibold text-[#1F2937]">Constructive Dialogue:</strong> Conflict resolution &amp; communication tools</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00AAC1] shrink-0" />
                  <span><strong className="font-semibold text-[#1F2937]">Lifestyle Alignment:</strong> Role expectations, career &amp; intimacy goals</span>
                </li>
              </ul>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2.5 RELATIONSHIP GUARDIAN EXPERIENCE (BetterLYF Style Feature Grid)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-12 bg-[#FFFFFC] border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side: Authentic Photorealistic Couple Harmony Image Plate */}
            <motion.div
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative w-full max-w-md aspect-[4/3] rounded-[36px] p-2 bg-white shadow-[0_20px_50px_rgba(0,170,193,0.15)] border border-[#00AAC1]/20 group">
                <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-slate-100">
                  <img
                    src={coupleHarmony}
                    alt="Couple Harmony Consultation"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#00AAC1]/20 shadow-md flex items-center justify-between">
                    <span className="text-xs font-sans font-bold text-[#006B7D]">Conscious Intimacy &amp; Trust</span>
                    <span className="text-[10px] font-sans font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EBF7F7] text-[#00AAC1]">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side: Checkmark Bullet Points (BetterLYF Screenshot 1 Style) */}
            <motion.div
              className="lg:col-span-7 space-y-6"
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="space-y-3">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#00AAC1] bg-[#EBF7F7] border border-[#00AAC1]/20">
                  Top-Rated Consultation Guardian
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2937] leading-tight">
                  Consult With Our Top Rated In-House Relationship &amp; Astrology Guardian
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#4B5563] leading-relaxed">
                  Your relationship experience depends on your consultant’s approach, empathy, and clarity. We synthesize deep planetary insight with compassionate psychology to bring you the most fulfilling guidance.
                </p>
              </div>

              {/* Checkmark List */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#00AAC1]" />
                  </div>
                  <p className="font-sans text-sm text-[#374151]">
                    <strong className="font-bold text-[#00AAC1]">Dual Qualification:</strong> Synthesis of Vedic Astrological Synastry &amp; Relational Psychology
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#00AAC1]" />
                  </div>
                  <p className="font-sans text-sm text-[#374151]">
                    <strong className="font-bold text-[#00AAC1]">500+ Hours</strong> of rigorous relationship advisory &amp; couple compatibility matching
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#00AAC1]" />
                  </div>
                  <p className="font-sans text-sm text-[#374151]">
                    <strong className="font-bold text-[#00AAC1]">Multiple Expertise</strong> in psychotherapeutic conflict resolution &amp; planetary remedies
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#00AAC1]" />
                  </div>
                  <p className="font-sans text-sm text-[#374151]">
                    <strong className="font-bold text-[#00AAC1]">100% Confidential</strong> private digital environment ensuring total privacy for personal details
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#00AAC1]" />
                  </div>
                  <p className="font-sans text-sm text-[#374151]">
                    <strong className="font-bold text-[#00AAC1]">Actionable Roadmaps</strong> to tackle communication bottlenecks and attain clarity
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. OUR SERVICES SECTION (Clean Light Theme Grid)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-6 md:px-12 relative bg-[#F7FAF9] border-y border-[rgba(22,109,116,0.08)]">
        
        <MandalaPattern
          type="lattice"
          className="absolute inset-0 w-full h-full text-[#166D74]"
          opacity={0.02}
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
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-[rgba(0,170,193,0.16)] shadow-md hover:shadow-2xl hover:shadow-[#00AAC1]/15 hover:border-[#00AAC1]/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                {/* Top decorative accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
      <section className="py-24 px-6 md:px-12 relative bg-[#FFFFFC] overflow-hidden">
        {/* Background Mandala Watermark */}
        <MandalaPattern
          type="concentric"
          className="absolute -right-32 bottom-0 w-[550px] h-[550px] text-[#C9A646]"
          opacity={0.03}
          animateRotation={true}
        />

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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            
            {/* Pillar 1 */}
            <div className="p-4.5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F7FAF9] to-[#EBF7F7]/30 border border-[rgba(0,170,193,0.16)] shadow-xs space-y-2.5 sm:space-y-4 hover:shadow-xl hover:border-[#00AAC1]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EBF7F7] text-[#00AAC1] flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold text-[#1F2937] leading-snug">Dual-Lens Synthesis</h3>
              <p className="font-sans text-[11px] sm:text-xs text-[#4B5563] leading-relaxed">
                Blending time-tested Vedic astrological alignments with modern evidence-based psychological frameworks.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4.5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F7FAF9] to-[#EBF7F7]/30 border border-[rgba(0,170,193,0.16)] shadow-xs space-y-2.5 sm:space-y-4 hover:shadow-xl hover:border-[#00AAC1]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EBF7F7] text-[#006B7D] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold text-[#1F2937] leading-snug">100% Confidential</h3>
              <p className="font-sans text-[11px] sm:text-xs text-[#4B5563] leading-relaxed">
                Conducted in a private, non-judgmental digital environment ensuring total privacy for all personal details.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4.5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F7FAF9] to-[#EBF7F7]/30 border border-[rgba(0,170,193,0.16)] shadow-xs space-y-2.5 sm:space-y-4 hover:shadow-xl hover:border-[#00AAC1]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EBF7F7] text-[#00AAC1] flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold text-[#1F2937] leading-snug">Actionable Roadmap</h3>
              <p className="font-sans text-[11px] sm:text-xs text-[#4B5563] leading-relaxed">
                Practical communication exercises, remedial guidance, and clear metrics rather than vague predictions.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4.5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F7FAF9] to-[#EBF7F7]/30 border border-[rgba(0,170,193,0.16)] shadow-xs space-y-2.5 sm:space-y-4 hover:shadow-xl hover:border-[#00AAC1]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EBF7F7] text-[#006B7D] flex items-center justify-center shadow-xs">
                <Star className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold text-[#1F2937] leading-snug">Empathic Guardian</h3>
              <p className="font-sans text-[11px] sm:text-xs text-[#4B5563] leading-relaxed">
                Dedicated personal attention focused on building emotional security, mutual trust, and long-term connection.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BANNER PLATE: READY TO BEGIN YOUR JOURNEY? (BetterLYF Style Card)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-6 md:px-12 bg-[#FFFFFC]">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[32px] bg-gradient-to-r from-[#EBF7F7] via-white to-[#F0FAFA] border border-[#00AAC1]/25 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
            
            {/* Left side: Lifestyle image plate with rounded corners */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md aspect-[16/9] lg:aspect-[4/3] group">
              <img
                src={lifestyleBanner}
                alt="Personal Consultation Workspace"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-sans font-semibold text-[#006B7D] flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-[#00AAC1] shrink-0" />
                <span>1-on-1 Confidential Online Consultation</span>
              </div>
            </div>

            {/* Right side: Content & Action */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#00AAC1] bg-white border border-[#00AAC1]/20 shadow-2xs">
                Not Ready To Book Yet?
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1F2937] leading-tight">
                Explore Direct Relationship &amp; Vedic Guidance With Abhay Harpale
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#4B5563] leading-relaxed">
                Take the first step toward relationship clarity. Schedule a private consultation or explore our tailored program details today.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/book"
                  className="px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] inline-flex items-center gap-2"
                >
                  <span>Book Consultation Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/services"
                  className="px-7 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-[#006B7D] bg-white border border-[#00AAC1]/30 hover:bg-[#EBF7F7] shadow-2xs transition-all duration-300"
                >
                  <span>Explore Programs</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. CONTACT US SECTION (Clean Theme Dark-Teal Container)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-6 md:px-12 relative bg-[#FFFFFC]">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="relative rounded-[36px] p-8 sm:p-14 lg:p-16 border border-[#00AAC1]/20 shadow-2xl overflow-hidden bg-gradient-to-br from-[#092B30] via-[#0E3A42] to-[#124B56] text-white">
            
            <MandalaPattern
              type="sacred"
              className="absolute -right-20 -bottom-20 w-[550px] h-[550px] text-[#C9A646]"
              opacity={0.04}
              animateRotation={true}
            />

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


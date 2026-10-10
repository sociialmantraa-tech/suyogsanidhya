'use client';

import React from 'react';
import Link from 'next/link';
import logoImg from '../assets/logo.png';
import { Mail, Phone, MapPin, Clock, Linkedin, Twitter, Youtube, Facebook, Instagram, ArrowRight, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublicData } from '../context/PublicDataContext';
import MandalaPattern from './MandalaPattern';
import MeshGradient from './MeshGradient';

export default function Footer() {
  const { services, siteSettings } = usePublicData();
  const settings = siteSettings;
  const displayServices = services.slice(0, 5);
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const logoSrc = typeof logoImg === 'string' ? logoImg : (logoImg as any)?.src || logoImg;

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#F7FAF9',
        borderTop: '1px solid rgba(22, 109, 116, 0.1)',
      }}
    >
      {/* ── Background Layer 1: Ambient Mesh Gradient ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <MeshGradient />
      </div>

      {/* ── Background Layer 2: Subtle Geometry ── */}
      <MandalaPattern
        type="lattice"
        className="absolute inset-0 w-full h-full text-[#166D74]"
        opacity={0.018}
      />

      <MandalaPattern
        type="sacred"
        className="absolute -right-24 -bottom-24 w-[500px] h-[500px] text-[#C9A646]"
        opacity={0.02}
        animateRotation={!prefersReducedMotion}
      />

      {/* ── Gold / Sage Top Divider Accent ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(22,109,116,0.3) 25%, rgba(201,166,70,0.5) 50%, rgba(22,109,116,0.3) 75%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ══ TOP BRAND & INVITATION SECTION ══ */}
        <div className="pt-20 pb-14 border-b border-[rgba(22,109,116,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Brand Statement */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#00AAC1]/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#00AAC1]" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#006B7D]">
                  Abhay Harpale · Suyog Saanidhya
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F2937] font-normal leading-[1.15] tracking-tight">
                Where Relationships <br className="hidden sm:inline" />
                <span className="italic font-light text-[#00AAC1]">Awaken to Harmony.</span>
              </h2>
              <div className="pt-2">
                <p className="font-serif italic text-lg text-[#006B7D] mb-0.5">संवादात् सान्निध्यम्</p>
                <p className="font-sans text-xs tracking-wider text-[#6B7280] uppercase">
                  From conscious dialogue emerges enduring connection.
                </p>
              </div>
            </div>

            {/* Right Consultation Card */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="p-8 rounded-3xl relative overflow-hidden backdrop-blur-md shadow-sm bg-white border border-[#00AAC1]/15"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#00AAC1] animate-pulse" />
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#006B7D]">
                    Private Consultations Available
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#1F2937] mb-2 font-medium">
                  Ready for Meaningful Clarity?
                </h3>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-6">
                  Schedule a private 1-on-1 or couples session crafted to restore mutual understanding and intimacy.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full font-sans text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══ MAIN FOOTER LINKS ══ */}
        <div className="py-10 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 text-left">

            {/* Brand & Bio (Full width on mobile, 4 cols on desktop) */}
            <div className="col-span-2 lg:col-span-4 space-y-4">
              <Link href="/" className="inline-flex items-center group py-1" aria-label="Suyog Saanidhya — Home">
                <img 
                  src={logoSrc} 
                  alt="Suyog Saanidhya — Where Hearts Find Harmony" 
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02] h-[60px] sm:h-[85px] md:h-[100px]" 
                  style={{
                    height: '100px',
                    maxHeight: '100px',
                    width: 'auto',
                    maxWidth: '380px',
                    display: 'block',
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))'
                  }}
                />
              </Link>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#5E6E72] max-w-sm">
                Empowering individuals and couples through compassionate, confidential guidance rooted in ancient wisdom and modern relational science.
              </p>
              <div className="flex items-center space-x-2.5 pt-1">
                {[
                  { href: settings.social_facebook || 'https://facebook.com/suyogsaanidhya', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
                  { href: settings.social_instagram || 'https://instagram.com/suyogsaanidhya', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
                  { href: settings.social_youtube || 'https://www.youtube.com/@suyogsaanidhya', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
                  { href: settings.social_linkedin, label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
                  { href: settings.social_twitter, label: 'Twitter', icon: <Twitter className="w-4 h-4" /> }
                ]
                  .filter(soc => Boolean(soc.href) && soc.href !== '#' && !soc.href.includes('linkedin.com/in/abhayharpale') && !soc.href.includes('twitter.com/abhayharpale'))
                  .map((soc, idx) => (
                    <motion.a
                      key={idx}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[rgba(22,109,116,0.15)] flex items-center justify-center bg-white text-[#166D74] transition-all hover:bg-[#166D74] hover:text-white hover:border-[#166D74] shadow-xs"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={soc.label}
                    >
                      {soc.icon}
                    </motion.a>
                  ))}
              </div>
            </div>

            {/* Pages / Explore Links (Left Column on Mobile - 1 col on mobile, 4 cols on desktop) */}
            <div className="col-span-1 lg:col-span-4 space-y-3.5 pt-2 md:pt-0">
              <h4 className="font-sans text-[11px] sm:text-xs uppercase tracking-widest font-bold text-[#00AAC1] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AAC1]" />
                <span>Explore &amp; Pages</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {[
                  { href: '/about', label: 'About Abhay' },
                  { href: '/services', label: 'Consultations' },
                  { href: '/testimonials', label: 'Client Stories' },
                  { href: '/blog', label: 'Insights & Blog' },
                  { href: '/media', label: 'Media & Videos' },
                  { href: '/faq', label: 'FAQ' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="font-sans text-[#4B5563] hover:text-[#00AAC1] transition-colors flex items-center gap-1 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#00AAC1] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reach Out / Contact Details (Right Column on Mobile - 1 col on mobile, 4 cols on desktop) */}
            <div className="col-span-1 lg:col-span-4 space-y-3.5 pt-2 md:pt-0">
              <h4 className="font-sans text-[11px] sm:text-xs uppercase tracking-widest font-bold text-[#00AAC1] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AAC1]" />
                <span>Reach Out</span>
              </h4>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-[#00AAC1]/15 space-y-3 shadow-xs">
                <ul className="space-y-2.5 text-[11px] sm:text-xs text-[#4B5563]">
                  <li className="flex items-start gap-2">
                    <div className="p-1 rounded-lg bg-[#EBF7F7] text-[#00AAC1] shrink-0 mt-0.5">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="leading-snug">{settings.contact_address || 'Pune / Mumbai, Maharashtra'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#EBF7F7] text-[#00AAC1] shrink-0">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <a
                      href={`tel:${settings.contact_phone || '+91 91529 62255'}`}
                      className="hover:text-[#00AAC1] transition-colors font-medium break-all"
                    >
                      {settings.contact_phone || '+91 91529 62255'}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#EBF7F7] text-[#00AAC1] shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="hover:text-[#00AAC1] transition-colors break-all font-medium text-[10.5px] sm:text-xs"
                    >
                      {settings.contact_email || 'consult@abhayharpale.com'}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="p-1 rounded-lg bg-[#EBF7F7] text-[#00AAC1] shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span>{settings.business_hours || 'Mon – Sat: 10:00 AM – 7:00 PM IST'}</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* ══ BOTTOM COPYRIGHT BAR (Policies removed from bottom) ══ */}
        <div className="py-6 border-t border-[rgba(22,109,116,0.08)] flex items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#71858A] font-sans">
            <ShieldCheck className="w-4 h-4 text-[#166D74]" />
            <span>© {new Date().getFullYear()} Abhay Harpale. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

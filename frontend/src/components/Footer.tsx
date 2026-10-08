'use client';

import React from 'react';
import Link from 'next/link';
import logoImg from '../assets/logo.png';
import { Mail, Phone, MapPin, Clock, Linkedin, Twitter, Youtube, ArrowRight, Sparkles, Heart, ShieldCheck } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 text-left">

          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center group py-1" aria-label="Suyog Saanidhya — Home">
              <img 
                src={logoSrc} 
                alt="Suyog Saanidhya — Where Hearts Find Harmony" 
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02] h-[75px] sm:h-[95px] md:h-[110px]" 
                style={{
                  height: '110px',
                  maxHeight: '110px',
                  width: 'auto',
                  maxWidth: '480px',
                  display: 'block',
                  imageRendering: '-webkit-optimize-contrast',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))'
                }}
              />
            </Link>
            <p className="font-sans text-sm leading-relaxed text-[#5E6E72] max-w-sm">
              Empowering individuals and couples through compassionate, confidential guidance rooted in ancient wisdom and modern relational science.
            </p>
            <div className="flex items-center space-x-2.5 pt-2">
              {[
                { href: settings.social_linkedin, label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
                { href: settings.social_twitter, label: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
                { href: settings.social_youtube, label: 'YouTube', icon: <Youtube className="w-4 h-4" /> }
              ].map((soc, idx) => (
                <motion.a
                  key={idx}
                  href={soc.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[rgba(22,109,116,0.15)] flex items-center justify-center bg-white/90 text-[#166D74] transition-all hover:bg-[#166D74] hover:text-white hover:border-[#166D74] shadow-xs"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={soc.label}
                >
                  {soc.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-[#166D74]">
              Explore
            </h4>
            <ul className="space-y-2.5">
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
                    className="font-sans text-sm text-[#5E6E72] hover:text-[#0F5D66] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#166D74] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Offerings (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-[#166D74]">
              Specialized Guidance
            </h4>
            <ul className="space-y-2.5">
              {displayServices.map(service => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-sans text-sm text-[#5E6E72] hover:text-[#0F5D66] transition-colors line-clamp-1"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/services"
                  className="font-sans text-xs font-bold uppercase tracking-wider text-[#B8943A] hover:text-[#0F5D66] flex items-center gap-1 transition-colors"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-[#166D74]">
              Reach Out
            </h4>
            <ul className="space-y-3.5 text-sm text-[#5E6E72]">
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#EAF5F3] text-[#166D74] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug">{settings.contact_address || 'Pune / Mumbai, Maharashtra, India'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-[#EAF5F3] text-[#166D74] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a
                  href={`tel:${settings.contact_phone || '+91 91529 62255'}`}
                  className="hover:text-[#0F5D66] transition-colors"
                >
                  {settings.contact_phone || '+91 91529 62255'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-[#EAF5F3] text-[#166D74] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-[#0F5D66] transition-colors break-all"
                >
                  {settings.contact_email || 'consult@abhayharpale.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#EAF5F3] text-[#166D74] shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>{settings.business_hours || 'Mon – Sat: 10:00 AM – 7:00 PM IST'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ══ BOTTOM COPYRIGHT BAR ══ */}
        <div className="py-7 border-t border-[rgba(22,109,116,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#71858A] font-sans">
            <ShieldCheck className="w-4 h-4 text-[#166D74]" />
            <span>© {new Date().getFullYear()} Abhay Harpale. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#71858A] font-sans flex-wrap justify-center">
            <Link href="/privacy-policy" className="hover:text-[#0F5D66] transition-colors">
              Privacy Policy
            </Link>
            <span className="opacity-30">·</span>
            <Link href="/terms" className="hover:text-[#0F5D66] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="opacity-30">·</span>
            <Link href="/refund-policy" className="hover:text-[#0F5D66] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { Mail, Phone, MapPin, Clock, Linkedin, Twitter, Youtube, ArrowRight } from 'lucide-react';
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

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#F6F2E8',
        borderTop: '1px solid rgba(201,166,70,0.2)',
      }}
    >
      {/* ── Background Layer 1: Ambient Mesh Gradient ── */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <MeshGradient />
      </div>

      {/* ── Background Layer 2: Lattice Grid Pattern ── */}
      <MandalaPattern
        type="lattice"
        className="absolute inset-0 w-full h-full text-[#166D74]"
        opacity={0.025}
      />

      {/* ── Background Layer 3: Central Sacred Geometry ── */}
      <MandalaPattern
        type="sacred"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-[#C9A646]"
        opacity={0.025}
        animateRotation={!prefersReducedMotion}
      />

      {/* ── Background Layer 4: Corner Mandala (bottom left) ── */}
      <MandalaPattern
        type="mandala"
        className="absolute -left-24 -bottom-24 w-[500px] h-[500px] text-[#166D74]"
        opacity={0.02}
        animateRotation={!prefersReducedMotion}
      />

      {/* ── Background Layer 5: Corner geometry (bottom right) ── */}
      <MandalaPattern
        type="geometry"
        className="absolute -right-20 -bottom-20 w-[380px] h-[380px] text-[#C9A646]"
        opacity={0.025}
        animateRotation={!prefersReducedMotion}
      />

      {/* ── Background Layer 6: Soft radial glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-30%', left: '30%',
          width: '60%', height: '120%',
          background: 'radial-gradient(ellipse, rgba(201,166,70,0.05) 0%, rgba(64,192,192,0.03) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Gold Top Divider Line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(201,166,70,0.5) 25%, rgba(201,166,70,0.5) 75%, transparent)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-6 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(201,166,70,0.06), transparent)',
        }}
      />

      {/* ── Corner Ornaments ── */}
      <div className="absolute top-6 left-6 w-10 h-10 opacity-20 text-[#C9A646] pointer-events-none z-10">
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 0 L30 0 M0 0 L0 30" />
          <circle cx="8" cy="8" r="2.5" />
        </svg>
      </div>
      <div className="absolute top-6 right-6 w-10 h-10 opacity-20 text-[#C9A646] pointer-events-none z-10" style={{ transform: 'rotate(90deg)' }}>
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 0 L30 0 M0 0 L0 30" />
          <circle cx="8" cy="8" r="2.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ══ BRAND STATEMENT SECTION ══ */}
        <div className="pt-20 pb-16 border-b" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left — Brand statement */}
            <div className="lg:col-span-7 space-y-6">
              <motion.span
                className="eyebrow"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Abhay Harpale
              </motion.span>
              <motion.p
                className="footer-brand-statement"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Where Relationships<br />
                <span style={{ color: '#C9A646' }}>Become Art.</span>
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="sanskrit-text text-xl mb-1">संवादात् सान्निध्यम्</p>
                <p className="sanskrit-caption">From communication comes true closeness.</p>
              </motion.div>
            </div>

            {/* Right — Book CTA */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="footer-cta-section"
                style={{
                  background: 'linear-gradient(135deg, rgba(22,109,116,0.04) 0%, rgba(201,166,70,0.03) 100%)',
                  border: '1px solid rgba(201,166,70,0.18)',
                  borderRadius: '20px',
                  padding: '2rem 2rem',
                }}
              >
                <h4 className="font-serif text-xl mb-2" style={{ color: '#166D74' }}>
                  Ready to Begin?
                </h4>
                <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: '#5F6C72', maxWidth: '340px' }}>
                  Book a private, confidential consultation and take the first step toward deeper connection.
                </p>
                <Link
                  to="/book"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  Book Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══ MAIN FOOTER COLUMNS ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 mb-2 text-left">

          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block transition-opacity hover:opacity-85">
              <img src={logoImg} alt="Suyog Saanidhya" width={64} height={64} className="h-16 w-16 object-contain" />
            </Link>
            <p className="font-sans leading-relaxed" style={{ fontSize: '14px', color: '#5F6C72', maxWidth: '240px' }}>
              Confidential relationship and intimacy guidance for individuals and couples seeking deeper connection and lasting change.
            </p>
            <div className="flex items-center space-x-3">
              {[
                { href: settings.social_linkedin, label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
                { href: settings.social_twitter, label: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
                { href: settings.social_youtube, label: 'YouTube', icon: <Youtube className="w-4 h-4" /> }
              ].map((soc, idx) => (
                <motion.a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border flex items-center justify-center bg-white"
                  style={{ borderColor: 'rgba(201,166,70,0.2)', color: '#166D74' }}
                  whileHover={prefersReducedMotion ? {} : {
                    y: -4,
                    backgroundColor: '#FFFDF7',
                    borderColor: '#C9A646',
                    color: '#C9A646',
                    boxShadow: '0 8px 20px rgba(201,166,70,0.15)',
                  }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={soc.label}
                >
                  {soc.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-sans text-[10.5px] uppercase tracking-wider font-bold mb-6" style={{ color: '#C9A646' }}>
              Explore
            </h4>
            <ul className="space-y-3.5">
              {[
                { to: '/about', label: 'About Abhay Harpale' },
                { to: '/services', label: 'Consultation Programs' },
                { to: '/testimonials', label: 'Client Testimonials' },
                { to: '/media', label: 'Media & Videos' },
                { to: '/faq', label: 'Frequently Asked Questions' },
                { to: '/blog', label: 'Insights & Articles' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="animated-link transition-colors duration-300 font-sans"
                    style={{ fontSize: '14px', color: '#5F6C72' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div>
            <h4 className="font-sans text-[10.5px] uppercase tracking-wider font-bold mb-6" style={{ color: '#C9A646' }}>
              Programs
            </h4>
            <ul className="space-y-3.5">
              {displayServices.map(service => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="animated-link transition-colors duration-300 font-sans"
                    style={{ fontSize: '14px', color: '#5F6C72' }}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/book"
                  className="animated-link font-bold transition-colors font-sans"
                  style={{ fontSize: '14px', color: '#166D74' }}
                >
                  Schedule a Session →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-sans text-[10.5px] uppercase tracking-wider font-bold mb-6" style={{ color: '#C9A646' }}>
              Contact
            </h4>
            <ul className="space-y-4" style={{ color: '#5F6C72' }}>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#40C0C0' }} />
                <span className="font-sans" style={{ fontSize: '14px' }}>{settings.contact_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#40C0C0' }} />
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="animated-link transition-colors font-sans"
                  style={{ fontSize: '14px', color: '#5F6C72' }}
                >
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#40C0C0' }} />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="animated-link transition-colors font-sans"
                  style={{ fontSize: '14px', color: '#5F6C72' }}
                >
                  {settings.contact_email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#40C0C0' }} />
                <span className="font-sans" style={{ fontSize: '14px' }}>{settings.business_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div
          className="py-8 border-t flex flex-col md:flex-row items-center justify-between gap-5"
          style={{ borderColor: 'rgba(64,192,192,0.1)' }}
        >
          {/* Copyright + Sanskrit */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-sans text-xs" style={{ color: '#88949B' }}>
              © {new Date().getFullYear()} Abhay Harpale. All rights reserved.
            </p>
            <p className="sanskrit-text" style={{ fontSize: '12px' }}>
              संबन्धात् सम्पूर्णता — Wholeness through relationships.
            </p>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {[
              { to: '/privacy-policy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms & Conditions' },
              { to: '/refund-policy', label: 'Refund Policy' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="animated-link font-sans text-xs transition-colors"
                style={{ color: '#88949B' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

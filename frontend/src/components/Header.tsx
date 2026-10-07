'use client';

import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/logo.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Sparkles, ArrowRight, HeartHandshake, Compass, Users, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicData } from '../context/PublicDataContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { services } = usePublicData();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const logoSrc = typeof logoImg === 'string' ? logoImg : (logoImg as any)?.src || logoImg;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setShowDropdown(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setShowDropdown(false);
      closeTimer.current = null;
    }, 180);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, [pathname]);

  // Click outside and Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = next ? 'hidden' : '';
      }
      return next;
    });
  };

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Our Services' },
    { href: '/stories', label: 'Stories' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={isScrolled ? {
        backgroundColor: 'rgba(255, 255, 252, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(22, 109, 116, 0.08)',
        boxShadow: '0 8px 32px -4px rgba(22, 109, 116, 0.06)',
        paddingTop: '0.45rem',
        paddingBottom: '0.45rem',
      } : {
        backgroundColor: 'rgba(255, 255, 252, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      }}
    >
      {/* Top subtle sage-gold gradient line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-300 pointer-events-none ${isScrolled ? 'opacity-100' : 'opacity-40'}`}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(22,109,116,0.3) 25%, rgba(201,166,70,0.5) 50%, rgba(22,109,116,0.3) 75%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">

        {/* Brand Logo - Original High-Resolution Logo with Increased Prominent Size */}
        <Link href="/" className="focus:outline-none flex items-center py-1 group shrink-0" aria-label="Suyog Saanidhya — Home">
          <motion.div
            className="relative flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <img
              src={logoSrc}
              alt="Suyog Saanidhya — Where Hearts Find Harmony"
              className="object-contain transition-all duration-300 h-[58px] sm:h-[76px] md:h-[96px]"
              style={{
                height: isScrolled ? '72px' : '96px',
                maxHeight: isScrolled ? '72px' : '96px',
                width: 'auto',
                maxWidth: isScrolled ? '360px' : '480px',
                display: 'block',
                imageRendering: '-webkit-optimize-contrast',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))'
              }}
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-[rgba(22,109,116,0.1)] shadow-sm">
          {navLinks.map((link, i) => {
            const active = isActive(link.href);
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full font-sans text-[13px] font-medium tracking-[0.02em] transition-all duration-300 block ${
                    active ? 'text-[#0F5D66] font-semibold' : 'text-[#4A5D62] hover:text-[#0F5D66]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#EAF5F3] rounded-full -z-10 border border-[#D0EAE4]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Link
              href="/book"
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-sans text-[13px] font-semibold tracking-wide text-white overflow-hidden shadow-[0_4px_16px_rgba(22,109,116,0.25)] hover:shadow-[0_6px_22px_rgba(22,109,116,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #166D74 0%, #0F5D66 100%)',
              }}
            >
              <span className="absolute inset-0 bg-white/15 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2.5 rounded-full bg-white/80 border border-[rgba(22,109,116,0.15)] text-[#0F5D66] focus:outline-none transition-transform active:scale-95 shadow-sm"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />

            {/* Slide-in Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] z-50 lg:hidden flex flex-col justify-between shadow-2xl overflow-hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: '#FFFFFC',
                borderLeft: '1px solid rgba(22,109,116,0.12)',
              }}
            >
              {/* Drawer Header */}
              <div className="p-4 flex items-center justify-between border-b border-[rgba(22,109,116,0.08)] bg-white/80 backdrop-blur-md">
                <Link href="/" onClick={toggleMenu} className="flex items-center">
                  <img
                    src={logoSrc}
                    alt="Suyog Saanidhya"
                    className="object-contain"
                    style={{
                      height: '48px',
                      maxHeight: '48px',
                      width: 'auto',
                      maxWidth: '220px',
                      display: 'block',
                      imageRendering: '-webkit-optimize-contrast'
                    }}
                  />
                </Link>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-full hover:bg-slate-100 text-[#0F5D66] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71858A] block px-2 mb-1">
                    Navigation
                  </span>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl font-sans text-base transition-colors ${
                          isActive(link.href)
                            ? 'bg-[#EAF5F3] text-[#0F5D66] font-semibold border border-[#D0EAE4]'
                            : 'text-[#394E53] hover:bg-[#F7FAF9]'
                        }`}
                      >
                        {link.label}
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Services Section in Drawer */}
                <div className="pt-4 border-t border-[rgba(22,109,116,0.08)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8943A] block px-2 mb-2">
                    Consultations
                  </span>
                  <div className="space-y-1">
                    <Link
                      href="/services"
                      className="flex items-center justify-between py-2 px-3 rounded-xl font-sans text-sm font-semibold text-[#0F5D66] hover:bg-[#F7FAF9]"
                    >
                      All Services
                      <ArrowRight className="w-3.5 h-3.5 text-[#166D74]" />
                    </Link>
                    {services.slice(0, 5).map(service => (
                      <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="block py-1.5 px-3 rounded-lg font-sans text-xs text-[#5E6E72] hover:text-[#0F5D66] hover:bg-[#F7FAF9] transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom CTA */}
              <div className="p-6 border-t border-[rgba(22,109,116,0.08)] bg-white/70 backdrop-blur-md space-y-3">
                <Link
                  href="/book"
                  className="w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-2 font-sans text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #166D74 0%, #0F5D66 100%)',
                  }}
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#71858A]">
                  <PhoneCall className="w-3.5 h-3.5 text-[#166D74]" />
                  <span>Confidential Sessions Available</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

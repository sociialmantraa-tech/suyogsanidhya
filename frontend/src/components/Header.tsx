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
        backgroundColor: 'rgba(255, 255, 252, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(22, 109, 116, 0.08)',
        boxShadow: '0 8px 30px -4px rgba(22, 109, 116, 0.06)',
        paddingTop: '0.45rem',
        paddingBottom: '0.45rem',
      } : {
        backgroundColor: 'rgba(255, 255, 252, 0.86)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(22, 109, 116, 0.04)',
        boxShadow: '0 2px 20px -2px rgba(22, 109, 116, 0.03)',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      }}
    >
      {/* Top subtle sage-gold radiant line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 pointer-events-none ${isScrolled ? 'opacity-100' : 'opacity-70'}`}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(22,109,116,0.2) 20%, rgba(201,166,70,0.65) 50%, rgba(22,109,116,0.2) 80%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">

        {/* Brand Logo - Original High-Resolution Logo with Prominent Presentation */}
        <Link href="/" className="focus:outline-none flex items-center py-1 group shrink-0" aria-label="Suyog Saanidhya — Home">
          <motion.div
            className="relative flex items-center"
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.15 }}
          >
            <img
              src={logoSrc}
              alt="Suyog Saanidhya — Where Hearts Find Harmony"
              className="object-contain transition-all duration-300 h-[58px] sm:h-[76px] md:h-[94px]"
              style={{
                height: isScrolled ? '70px' : '94px',
                maxHeight: isScrolled ? '70px' : '94px',
                width: 'auto',
                maxWidth: isScrolled ? '360px' : '480px',
                display: 'block',
                imageRendering: '-webkit-optimize-contrast',
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))'
              }}
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation - Clean, Borderless, Luxurious & Refined */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
          {navLinks.map((link, i) => {
            const active = isActive(link.href);
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 font-sans text-[14.5px] lg:text-[15px] tracking-[0.01em] transition-all duration-200 block group/link ${
                    active
                      ? 'text-[#00AAC1] font-bold'
                      : 'text-[#4B5563] hover:text-[#00AAC1] font-semibold'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>

                  {/* Active Underline Bar */}
                  {active && (
                    <motion.div
                      layoutId="nav-active-glow"
                      className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] rounded-full"
                      style={{
                        background: '#00AAC1',
                        boxShadow: '0 2px 8px rgba(0, 170, 193, 0.35)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  {/* Hover subtle glow dot */}
                  {!active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00AAC1] opacity-0 group-hover/link:opacity-70 transition-opacity duration-200" />
                  )}
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
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <Link
              href="/book"
              className="relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-sans text-[14px] font-bold tracking-wide text-white overflow-hidden shadow-[0_4px_18px_rgba(0,170,193,0.32)] hover:shadow-[0_8px_30px_rgba(0,170,193,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Book Consultation</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-white" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2.5 rounded-full bg-white/80 border border-[rgba(0,170,193,0.2)] text-[#00AAC1] focus:outline-none transition-transform active:scale-95 shadow-sm"
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
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] z-50 lg:hidden flex flex-col justify-between shadow-2xl overflow-hidden bg-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Drawer Header */}
              <div className="p-4 flex items-center justify-between border-b border-[rgba(0,170,193,0.1)] bg-white">
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
                  className="p-2 rounded-full hover:bg-slate-100 text-[#00AAC1] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block px-2 mb-1">
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
                            ? 'bg-[#EBF7F7] text-[#00AAC1] font-bold border border-[#00AAC1]/20'
                            : 'text-[#4B5563] hover:bg-[#F4F8F8]'
                        }`}
                      >
                        {link.label}
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Services Section in Drawer */}
                <div className="pt-4 border-t border-[rgba(0,170,193,0.1)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00AAC1] block px-2 mb-2">
                    Consultations
                  </span>
                  <div className="space-y-1">
                    <Link
                      href="/services"
                      className="flex items-center justify-between py-2 px-3 rounded-xl font-sans text-sm font-semibold text-[#00AAC1] hover:bg-[#F4F8F8]"
                    >
                      All Services
                      <ArrowRight className="w-3.5 h-3.5 text-[#00AAC1]" />
                    </Link>
                    {services.slice(0, 5).map(service => (
                      <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="block py-1.5 px-3 rounded-lg font-sans text-xs text-[#4B5563] hover:text-[#00AAC1] hover:bg-[#F4F8F8] transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom CTA */}
              <div className="p-6 border-t border-[rgba(0,170,193,0.1)] bg-white space-y-3">
                <Link
                  href="/book"
                  className="w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-2 font-sans text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md transition-all"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B7280]">
                  <PhoneCall className="w-3.5 h-3.5 text-[#00AAC1]" />
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

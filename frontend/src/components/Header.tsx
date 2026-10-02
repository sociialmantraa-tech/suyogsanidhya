import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicData } from '../context/PublicDataContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { services } = usePublicData();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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
    }, 200);
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
    document.body.style.overflow = '';
  }, [location]);

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
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
      style={isScrolled ? {
        backgroundColor: 'rgba(246,242,232,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,166,70,0.12)',
        boxShadow: '0 4px 24px rgba(22,109,116,0.04)',
        paddingTop: '0.875rem',
        paddingBottom: '0.875rem',
      } : {
        backgroundColor: 'transparent',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
      }}
    >
      {/* Top gold glow line — visible when scrolled */}
      {isScrolled && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(201,166,70,0.35) 30%, rgba(201,166,70,0.35) 70%, transparent 100%)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="focus:outline-none flex items-center" aria-label="Abhay Harpale — Home">
          <motion.img
            src={logoImg}
            alt="Suyog Saanidhya"
            width={isScrolled ? 44 : 52}
            height={isScrolled ? 44 : 52}
            className="object-contain transition-all duration-500"
            style={{ height: isScrolled ? '44px' : '52px', width: isScrolled ? '44px' : '52px' }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-9 desktop-nav">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={link.to}
                className={`animated-link font-sans text-[13px] font-semibold tracking-[0.04em] transition-colors duration-250 ${isActive(link.to) ? 'active' : ''}`}
                style={{ color: isActive(link.to) ? '#166D74' : '#5E6E72' }}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          {/* Services Dropdown */}
          <motion.div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className={`font-sans text-[13px] font-semibold tracking-[0.04em] flex items-center gap-1 transition-colors duration-250 ${isActive('/services') ? 'text-[#166D74]' : 'text-[#5E6E72]'}`}
              onClick={() => setShowDropdown(!showDropdown)}
              onFocus={openMenu}
              onBlur={scheduleClose}
              aria-expanded={showDropdown}
              style={{ color: isActive('/services') ? '#166D74' : '#5E6E72' }}
            >
              Services
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  {/* Invisible hover bridge */}
                  <div
                    className="absolute top-full left-[-20px] w-[calc(100%+40px)] h-[12px] bg-transparent z-40"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  />

                  {/* Mega Menu */}
                  <motion.div
                    className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[620px] p-7 mega-menu-shadow z-50"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      backgroundColor: '#FFFCF8',
                      borderRadius: '20px',
                      border: '1px solid rgba(201,166,70,0.15)',
                      boxShadow: '0 32px 80px -16px rgba(23,111,120,0.1), 0 4px 16px rgba(23,111,120,0.04)',
                      backdropFilter: 'blur(16px)',
                    }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    {/* Gold divider top line */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] rounded-full" style={{
                      background: 'linear-gradient(to right, transparent, rgba(201,166,70,0.4), transparent)',
                    }} />

                    <div className="grid grid-cols-2 gap-6 text-left">
                      {/* Column 1 */}
                      <div className="flex flex-col space-y-1.5">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-wider mb-2.5 block pb-2" style={{ color: '#C9A646', borderBottom: '1px solid rgba(201,166,70,0.15)' }}>
                          Relationship Guidance
                        </span>
                        {services
                          .filter(s => s.category_id === 1 || s.category_name?.includes("Individual") || s.slug?.includes("clarity") || s.slug?.includes("individual") || s.slug?.includes("conflict") || s.slug?.includes("online"))
                          .slice(0, 5)
                          .map(service => (
                            <Link
                              key={service.id}
                              to={`/services/${service.slug}`}
                              className="mega-menu-link animated-link py-1.5 px-2 rounded-lg transition-all font-sans text-sm font-medium"
                              style={{ color: '#5E6E72' }}
                            >
                              {service.title}
                            </Link>
                          ))}
                      </div>

                      {/* Column 2 */}
                      <div className="flex flex-col space-y-1.5">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-wider mb-2.5 block pb-2" style={{ color: '#C9A646', borderBottom: '1px solid rgba(201,166,70,0.15)' }}>
                          Connection &amp; Intimacy
                        </span>
                        {services
                          .filter(s => s.category_id === 2 || s.category_name?.includes("Couples") || s.slug?.includes("couples") || s.slug?.includes("intimacy") || s.slug?.includes("trust") || s.slug?.includes("marriage") || s.slug?.includes("pre-marriage"))
                          .slice(0, 5)
                          .map(service => (
                            <Link
                              key={service.id}
                              to={`/services/${service.slug}`}
                              className="mega-menu-link animated-link py-1.5 px-2 rounded-lg transition-all font-sans text-sm font-medium"
                              style={{ color: '#5E6E72' }}
                            >
                              {service.title}
                            </Link>
                          ))}
                      </div>

                      {/* Footer */}
                      <div className="col-span-2 pt-4 flex justify-between items-center" style={{ borderTop: '1px solid rgba(64,192,192,0.1)' }}>
                        <span className="font-sans text-[10px]" style={{ color: '#88949B', letterSpacing: '0.05em' }}>
                          Confidential · Personalized · Private
                        </span>
                        <Link
                          to="/services"
                          className="animated-link font-sans text-[11px] font-bold uppercase tracking-wider transition-all"
                          style={{ color: '#166D74' }}
                        >
                          View All Services →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>

        {/* CTA Button */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/book" className="btn btn-primary">
            Book Consultation
          </Link>
        </motion.div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden focus:outline-none p-2 rounded-lg transition-colors"
          style={{ color: '#176F78' }}
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-[73px] z-40 lg:hidden flex flex-col justify-between"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: '#FFFCF8' }}
          >
            {/* Gold line top */}
            <div className="w-full h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(201,166,70,0.3), transparent)' }} />

            <div className="p-8 flex flex-col space-y-6 overflow-y-auto max-h-[70vh]">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to}
                    className="font-serif text-2xl block"
                    style={{ color: isActive(link.to) ? '#166D74' : '#176F78' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="pt-4"
                style={{ borderTop: '1px solid rgba(64,192,192,0.12)' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <span className="font-sans text-[10px] uppercase tracking-wider mb-3 block font-bold" style={{ color: '#C9A646' }}>
                  Consultations &amp; Services
                </span>
                <div className="flex flex-col space-y-3 pl-3">
                  <Link to="/services" className="font-sans text-lg hover:text-[#166D74] transition-colors" style={{ color: '#176F78' }}>
                    All Offerings
                  </Link>
                  {services.map(service => (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="font-sans text-base hover:text-[#166D74] transition-colors"
                      style={{ color: '#5E6E72' }}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="p-8 flex flex-col gap-4" style={{ backgroundColor: '#FFFCF8', borderTop: '1px solid rgba(64,192,192,0.1)' }}>
              <Link to="/book" className="btn btn-primary w-full text-center py-4">
                Book Consultation
              </Link>
              <p className="text-xs text-center" style={{ color: '#88949B' }}>
                Confidential &amp; custom clarity sessions.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

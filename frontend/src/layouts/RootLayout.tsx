import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloating from '../components/WhatsAppFloating';
import CursorGlow from '../components/CursorGlow';

export default function RootLayout() {
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      {/* Spacer to push content down if header is sticky, but since we designed it overlayed, we handle padding on heroes */}
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFloating />
      <CursorGlow />
    </div>
  );
}

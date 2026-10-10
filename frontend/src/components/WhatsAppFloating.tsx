'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { usePublicData } from '../context/PublicDataContext';

export default function WhatsAppFloating() {
  const { siteSettings } = usePublicData();
  const [isHovered, setIsHovered] = useState(false);

  const getWhatsappLink = () => {
    const rawNumber = siteSettings.contact_whatsapp || '+91 91529 62255';
    const cleaned = rawNumber.replace(/[^\d+]/g, '');
    // Ensure country code format for WhatsApp link
    const formatted = cleaned.startsWith('+') ? cleaned.replace('+', '') : `91${cleaned}`;
    return `https://wa.me/${formatted}?text=Hello%20Abhay%20Harpale,%20I%20would%20like%20to%20enquire%20about%20a%20consultation.`;
  };

  return (
    <div className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block px-4 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase shadow-lg border border-[#40C0C0]/20 backdrop-blur-md"
            style={{
              backgroundColor: '#FFFCF8',
              color: '#176F78',
              boxShadow: '0 10px 30px rgba(23,111,120,0.08)',
            }}
          >
            Chat with Abhay
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={getWhatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20,
          delay: 1.5 
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#40C0C0] focus:ring-offset-2"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.3)',
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* Luxury glowing radial overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* WhatsApp Icon SVG (Highly accurate vector representation) */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 text-white fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 2c-5.506 0-9.98 4.47-9.98 9.974 0 1.76.46 3.473 1.332 4.982L2 22l5.178-1.357a9.923 9.923 0 004.83 1.258h.004c5.503 0 9.976-4.47 9.976-9.973A9.976 9.976 0 0012.012 2zm6.91 14.156c-.28.788-1.393 1.458-1.923 1.52-.475.056-.994.08-1.637-.125-.4-.128-.9-.28-1.493-.532-2.525-1.07-4.14-3.666-4.266-3.834-.127-.168-1.026-1.365-1.026-2.604 0-1.24.646-1.848.876-2.096.23-.247.502-.309.67-.309.167 0 .334.004.48.012.15.008.35.016.543.484.197.48.675 1.647.734 1.769.058.12.099.263.018.423-.08.16-.12.26-.24.4-.12.14-.253.313-.36.42-.12.12-.246.252-.107.492.14.24.62 1.02 1.332 1.654.92.82 1.692 1.07 1.93 1.19.24.12.38.1.52-.06.14-.16.6-1.02.76-1.37.16-.35.32-.29.54-.21.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.22 1.37z" />
        </svg>
      </motion.a>
    </div>
  );
}

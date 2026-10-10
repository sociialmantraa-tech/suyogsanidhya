'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';
import MandalaPattern from '../components/MandalaPattern';
import logoImg from '../assets/logo.png';

export default function NotFound() {
  const logoSrc = typeof logoImg === 'string' ? logoImg : (logoImg as any)?.src || logoImg;

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-6 py-20 relative overflow-hidden bg-[#FFFFFC]">
      <MandalaPattern type="sacred" className="absolute -right-24 top-1/4 w-[550px] h-[550px] text-[#C9A646]" opacity={0.03} animateRotation={true} />
      
      <div className="max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-[rgba(0,170,193,0.18)] shadow-2xl text-center space-y-6 relative z-10">
        <div className="flex justify-center mb-2">
          <img src={logoSrc} alt="Suyog Saanidhya" className="h-12 w-auto object-contain" />
        </div>

        <div className="space-y-3">
          <span className="font-serif italic text-6xl font-bold text-[#00AAC1] block">404</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F2937]">Page Not Found</h2>
          <p className="font-sans text-xs sm:text-sm text-[#5E6E72] leading-relaxed max-w-sm mx-auto">
            The page you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto py-3.5 px-7 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto py-3.5 px-7 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-[#00AAC1] bg-[#EBF7F7] border border-[#00AAC1]/25 hover:bg-[#00AAC1] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

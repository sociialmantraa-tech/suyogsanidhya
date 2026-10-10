'use client';

import React from 'react';
import logoImg from '../assets/logo.png';
import MandalaPattern from '../components/MandalaPattern';

export default function Loading() {
  const logoSrc = typeof logoImg === 'string' ? logoImg : (logoImg as any)?.src || logoImg;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#FFFFFC]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none">
      
      {/* Background Mandala Animation */}
      <div className="absolute w-[450px] h-[450px] pointer-events-none opacity-20">
        <MandalaPattern type="sacred" className="w-full h-full text-[#C9A646]" animateRotation={true} />
      </div>

      {/* Main Loading Card */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        
        {/* Glowing Logo Container */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-[#00AAC1]/30 via-[#C9A646]/20 to-[#00AAC1]/30 animate-pulse" />
          <img
            src={logoSrc}
            alt="Suyog Saanidhya"
            className="h-16 w-auto object-contain relative z-10 drop-shadow-md animate-bounce"
            style={{ animationDuration: '2.5s' }}
          />
        </div>

        {/* Pulse Spinner & Dots */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00AAC1] animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A646] animate-ping [animation-delay:0.2s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#006B7D] animate-ping [animation-delay:0.4s]" />
        </div>

        {/* Brand Tagline */}
        <div className="space-y-1">
          <p className="font-serif italic text-lg text-[#006B7D]">संवादात् सान्निध्यम्</p>
          <p className="font-sans text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
            Loading Clarity &amp; Harmony...
          </p>
        </div>

      </div>
    </div>
  );
}

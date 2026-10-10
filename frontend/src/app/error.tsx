'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ShieldAlert } from 'lucide-react';
import MandalaPattern from '../components/MandalaPattern';
import logoImg from '../assets/logo.png';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const logoSrc = typeof logoImg === 'string' ? logoImg : (logoImg as any)?.src || logoImg;

  useEffect(() => {
    console.error('Captured App Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-6 py-20 relative overflow-hidden bg-[#FFFFFC]">
      
      {/* Background Geometry */}
      <MandalaPattern type="sacred" className="absolute -right-20 -top-20 w-[500px] h-[500px] text-[#C9A646]" opacity={0.03} animateRotation={true} />
      <MandalaPattern type="concentric" className="absolute -left-20 -bottom-20 w-[450px] h-[450px] text-[#00AAC1]" opacity={0.03} animateRotation={true} />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[rgba(0,170,193,0.2)] shadow-2xl text-center space-y-6 relative z-10">
        
        {/* Brand Logo Header */}
        <div className="flex justify-center">
          <img src={logoSrc} alt="Suyog Saanidhya" className="h-12 w-auto object-contain" />
        </div>

        {/* Icon & Message */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F2937]">
            Momentary Disruption
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5E6E72] leading-relaxed">
            We encountered a temporary connection issue while displaying this page. Don't worry, your data and session remain completely safe.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full py-3.5 px-6 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-[#00AAC1] bg-[#EBF7F7] border border-[#00AAC1]/25 hover:bg-[#00AAC1] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        <p className="text-[11px] font-sans text-[#71858A]">
          If this issue persists, please contact support at{' '}
          <a href="mailto:suyogsaanidhya@gmail.com" className="text-[#00AAC1] underline">
            suyogsaanidhya@gmail.com
          </a>
        </p>

      </div>
    </div>
  );
}

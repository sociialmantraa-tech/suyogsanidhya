import React from 'react';

interface SectionDividerProps {
  type?: 'fade' | 'line' | 'curve';
  className?: string;
}

export default function SectionDivider({ type = 'fade', className = '' }: SectionDividerProps) {
  if (type === 'line') {
    return (
      <div 
        className={`w-full h-[1.5px] opacity-[0.12] ${className}`}
        style={{
          background: 'linear-gradient(to right, transparent, #40C0C0 15%, #C9A646 50%, #40C0C0 85%, transparent)',
        }}
      />
    );
  }

  if (type === 'curve') {
    return (
      <div className={`w-full overflow-hidden leading-[0] ${className}`}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px]" fill="none">
          <path 
            d="M0,0 C150,90 350,90 500,60 C650,30 850,30 1000,60 C1150,90 1200,0 1200,0 L1200,120 L0,120 Z" 
            fill="#F6F2E8"
            className="opacity-[0.06]"
          />
          <path 
            d="M0,0 C150,90 350,90 500,60 C650,30 850,30 1000,60 C1150,90 1200,0 1200,0" 
            stroke="url(#dividerGradient)"
            strokeWidth="1.5"
            className="opacity-[0.12]"
          />
          <defs>
            <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#40C0C0" stopOpacity="0" />
              <stop offset="25%" stopColor="#40C0C0" />
              <stop offset="50%" stopColor="#C9A646" />
              <stop offset="75%" stopColor="#40C0C0" />
              <stop offset="100%" stopColor="#40C0C0" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Improved Section Separation: soft gradients, top highlight, bottom fade, very subtle divider
  return (
    <div 
      className={`w-full h-16 pointer-events-none select-none z-10 relative ${className}`}
      style={{
        background: 'linear-gradient(to bottom, rgba(22, 109, 116, 0.01) 0%, rgba(201, 166, 70, 0.005) 50%, rgba(22, 109, 116, 0.01) 100%)',
      }}
    >
      <div 
        className="absolute top-1/2 left-[10%] right-[10%] h-[1px] opacity-20"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(64, 192, 192, 0.15) 20%, rgba(201, 166, 70, 0.15) 50%, rgba(64, 192, 192, 0.15) 80%, transparent)'
        }}
      />
    </div>
  );
}

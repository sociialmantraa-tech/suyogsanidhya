'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MandalaPatternProps {
  type: 'mandala' | 'lotus' | 'geometry' | 'concentric' | 'waves' | 'curves' | 'diamond' | 'mesh' | 'constellation' | 'sacred' | 'lattice' | 'linearGrid';
  className?: string;
  animateRotation?: boolean;
  opacity?: number; // 0.01 to 0.05
}

export default function MandalaPattern({ 
  type, 
  className = '', 
  animateRotation = false,
  opacity = 0.02
}: MandalaPatternProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  const isAnimated = animateRotation && !prefersReducedMotion;

  // Safe clamp of opacity to max 0.05 (5%)
  const finalOpacity = Math.min(Math.max(opacity, 0.005), 0.05);

  const renderSVGContent = () => {
    switch (type) {
      case 'mandala':
        return (
          <svg viewBox="0 0 500 500" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
            <circle cx="250" cy="250" r="25" />
            <circle cx="250" cy="250" r="50" />
            <circle cx="250" cy="250" r="100" />
            <circle cx="250" cy="250" r="160" />
            <circle cx="250" cy="250" r="220" />
            <path d="M250 10 L250 490 M10 250 L490 250 M70 70 L430 430 M430 70 L70 430" />
            {[...Array(8)].map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = 250 + Math.cos(angle) * 50;
              const y1 = 250 + Math.sin(angle) * 50;
              const x2 = 250 + Math.cos(angle) * 160;
              const y2 = 250 + Math.sin(angle) * 160;
              return (
                <g key={i}>
                  <path d={`M${x1} ${y1} Q${250 + Math.cos(angle + 0.15) * 110} ${250 + Math.sin(angle + 0.15) * 110} ${x2} ${y2}`} />
                  <path d={`M${x1} ${y1} Q${250 + Math.cos(angle - 0.15) * 110} ${250 + Math.sin(angle - 0.15) * 110} ${x2} ${y2}`} />
                </g>
              );
            })}
          </svg>
        );
      case 'lotus':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6" className="w-full h-full">
            <path d="M50 10 C 45 35, 20 40, 10 50 C 20 60, 45 65, 50 90 C 55 65, 80 60, 90 50 C 80 40, 55 35, 50 10 Z" />
            <path d="M50 25 C 48 40, 30 43, 25 50 C 30 57, 48 60, 50 75 C 52 60, 70 57, 75 50 C 70 43, 52 40, 50 25 Z" />
            <path d="M50 35 C 49 45, 38 47, 35 50 C 38 53, 49 55, 50 65 C 51 55, 62 53, 65 50 C 62 47, 51 45, 50 35 Z" />
            <circle cx="50" cy="50" r="5" />
          </svg>
        );
      case 'geometry':
        return (
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" />
            <polygon points="100,60 140,80 140,120 100,140 60,120 60,80" />
            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="30" y1="60" x2="170" y2="140" />
            <line x1="30" y1="140" x2="170" y2="60" />
            <line x1="100" y1="20" x2="170" y2="140" />
            <line x1="100" y1="20" x2="30" y2="140" />
            <line x1="100" y1="180" x2="170" y2="60" />
            <line x1="100" y1="180" x2="30" y2="60" />
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="40" />
          </svg>
        );
      case 'concentric':
        return (
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
            <circle cx="100" cy="100" r="15" />
            <circle cx="100" cy="100" r="35" />
            <circle cx="100" cy="100" r="55" />
            <circle cx="100" cy="100" r="75" />
            <circle cx="100" cy="100" r="95" />
          </svg>
        );
      case 'waves':
      case 'curves':
        return (
          <svg viewBox="0 0 400 200" fill="none" stroke="currentColor" strokeWidth="0.4" className="w-full h-full">
            <path d="M-10,40 C60,80 100,10 180,50 T360,40 T540,40" />
            <path d="M-10,70 C60,110 100,40 180,80 T360,70 T540,70" />
            <path d="M-10,100 C60,140 100,70 180,110 T360,100 T540,100" />
            <path d="M-10,130 C60,170 100,100 180,140 T360,130 T540,130" />
            <path d="M-10,160 C60,200 100,130 180,170 T360,160 T540,160" />
          </svg>
        );
      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4" className="w-full h-full">
            <path d="M50 5 L95 50 L50 95 L5 50 Z" />
            <path d="M50 20 L80 50 L50 80 L20 50 Z" />
            <path d="M50 35 L65 50 L50 65 L35 50 Z" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="5" y1="50" x2="95" y2="50" />
          </svg>
        );
      case 'mesh':
        return (
          <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
            <path d="M 0 100 Q 100 50, 200 100 T 400 100" />
            <path d="M 0 200 Q 100 150, 200 200 T 400 200" />
            <path d="M 0 300 Q 100 250, 200 300 T 400 300" />
            <path d="M 100 0 Q 50 100, 100 200 T 100 400" />
            <path d="M 200 0 Q 150 100, 200 200 T 200 400" />
            <path d="M 300 0 Q 250 100, 300 200 T 300 400" />
          </svg>
        );

      /* ── NEW: Constellation dots + connecting lines ── */
      case 'constellation':
        return (
          <svg viewBox="0 0 600 400" fill="none" stroke="currentColor" strokeWidth="0.4" className="w-full h-full">
            {/* Connecting lines */}
            <line x1="80" y1="60" x2="180" y2="120" strokeOpacity="0.5" />
            <line x1="180" y1="120" x2="300" y2="80" strokeOpacity="0.5" />
            <line x1="300" y1="80" x2="420" y2="160" strokeOpacity="0.5" />
            <line x1="420" y1="160" x2="520" y2="100" strokeOpacity="0.5" />
            <line x1="180" y1="120" x2="240" y2="220" strokeOpacity="0.4" />
            <line x1="240" y1="220" x2="360" y2="280" strokeOpacity="0.4" />
            <line x1="360" y1="280" x2="480" y2="240" strokeOpacity="0.4" />
            <line x1="60" y1="200" x2="180" y2="120" strokeOpacity="0.3" />
            <line x1="60" y1="200" x2="240" y2="220" strokeOpacity="0.3" />
            <line x1="360" y1="280" x2="420" y2="160" strokeOpacity="0.3" />
            <line x1="120" y1="320" x2="240" y2="220" strokeOpacity="0.4" />
            <line x1="120" y1="320" x2="60" y2="200" strokeOpacity="0.3" />
            <line x1="480" y1="360" x2="360" y2="280" strokeOpacity="0.4" />
            <line x1="480" y1="360" x2="520" y2="100" strokeOpacity="0.2" />
            {/* Stars / dots */}
            <circle cx="80" cy="60" r="2" fill="currentColor" />
            <circle cx="180" cy="120" r="2.5" fill="currentColor" />
            <circle cx="300" cy="80" r="1.8" fill="currentColor" />
            <circle cx="420" cy="160" r="2.2" fill="currentColor" />
            <circle cx="520" cy="100" r="1.5" fill="currentColor" />
            <circle cx="240" cy="220" r="3" fill="currentColor" />
            <circle cx="360" cy="280" r="2" fill="currentColor" />
            <circle cx="480" cy="240" r="1.8" fill="currentColor" />
            <circle cx="60" cy="200" r="1.5" fill="currentColor" />
            <circle cx="120" cy="320" r="2" fill="currentColor" />
            <circle cx="480" cy="360" r="2.5" fill="currentColor" />
            {/* Subtle extra stars */}
            <circle cx="160" cy="340" r="1.2" fill="currentColor" opacity="0.5" />
            <circle cx="340" cy="40" r="1" fill="currentColor" opacity="0.5" />
            <circle cx="540" cy="280" r="1.3" fill="currentColor" opacity="0.5" />
            <circle cx="40" cy="360" r="1" fill="currentColor" opacity="0.4" />
          </svg>
        );

      /* ── NEW: Flower of Life sacred geometry ── */
      case 'sacred':
        return (
          <svg viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
            {/* Central circle */}
            <circle cx="150" cy="150" r="50" />
            {/* 6 surrounding circles (Flower of Life) */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * Math.PI) / 3;
              const cx = 150 + 50 * Math.cos(angle);
              const cy = 150 + 50 * Math.sin(angle);
              return <circle key={i} cx={cx} cy={cy} r="50" />;
            })}
            {/* Outer ring circles */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * Math.PI) / 3 + Math.PI / 6;
              const cx = 150 + 100 * Math.cos(angle);
              const cy = 150 + 100 * Math.sin(angle);
              return <circle key={`outer-${i}`} cx={cx} cy={cy} r="50" opacity="0.5" />;
            })}
            {/* Outer containment circle */}
            <circle cx="150" cy="150" r="148" opacity="0.3" />
            <circle cx="150" cy="150" r="100" opacity="0.2" />
          </svg>
        );

      /* ── NEW: Premium geometric lattice (footer) ── */
      case 'lattice':
        return (
          <svg viewBox="0 0 800 500" fill="none" stroke="currentColor" strokeWidth="0.35" className="w-full h-full">
            {/* Horizontal lines */}
            {[...Array(11)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} opacity={0.4} />
            ))}
            {/* Vertical lines */}
            {[...Array(17)].map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" opacity={0.4} />
            ))}
            {/* Diagonal lines NW→SE */}
            {[...Array(12)].map((_, i) => (
              <line key={`d1${i}`} x1={i * 100 - 200} y1="0" x2={i * 100 + 300} y2="500" opacity={0.2} />
            ))}
            {/* Diagonal lines NE→SW */}
            {[...Array(12)].map((_, i) => (
              <line key={`d2${i}`} x1={i * 100 - 200} y1="500" x2={i * 100 + 300} y2="0" opacity={0.2} />
            ))}
            {/* Central decorative mandala overlay */}
            <circle cx="400" cy="250" r="120" opacity="0.5" />
            <circle cx="400" cy="250" r="80" opacity="0.4" />
            <circle cx="400" cy="250" r="40" opacity="0.4" />
            <path d="M400 130 L400 370 M280 250 L520 250 M315 165 L485 335 M485 165 L315 335" opacity="0.3" />
          </svg>
        );

      /* ── NEW: Subtle linear grid (section backgrounds) ── */
      case 'linearGrid':
        return (
          <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.3" className="w-full h-full">
            {[...Array(9)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} opacity={0.5} />
            ))}
            {[...Array(9)].map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" opacity={0.5} />
            ))}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`absolute pointer-events-none select-none z-[2] ${className}`}
      animate={isAnimated ? { rotate: 360 } : {}}
      transition={isAnimated ? {
        duration: 120,
        repeat: Infinity,
        ease: 'linear'
      } : {}}
      style={{ 
        transformOrigin: 'center center',
        opacity: finalOpacity
      }}
    >
      {renderSVGContent()}
    </motion.div>
  );
}

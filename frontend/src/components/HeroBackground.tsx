'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import MandalaPattern from './MandalaPattern';

export default function HeroBackground() {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Mouse parallax for the hero background elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 60, stiffness: 80, mass: 1.2 });
  const springY = useSpring(mouseY, { damping: 60, stiffness: 80, mass: 1.2 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 24;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 24;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">

      {/* ── Layer 1: Primary ambient mesh blob (teal, top-left) ── */}
      <div
        className="absolute rounded-full ambient-blob-1"
        style={{
          width: '70vw',
          height: '70vw',
          maxWidth: '900px',
          maxHeight: '900px',
          top: '-15%',
          left: '-5%',
          background: 'radial-gradient(circle at 40% 40%, rgba(64,192,192,0.07) 0%, rgba(22,109,116,0.04) 40%, transparent 70%)',
          filter: 'blur(80px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Layer 2: Gold accent blob (bottom-right) ── */}
      <div
        className="absolute rounded-full ambient-blob-2"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: '700px',
          maxHeight: '700px',
          bottom: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle at 60% 60%, rgba(201,166,70,0.06) 0%, rgba(201,166,70,0.03) 45%, transparent 70%)',
          filter: 'blur(100px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Layer 3: Warm ivory centre glow ── */}
      <div
        className="absolute rounded-full ambient-blob-3"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '600px',
          maxHeight: '600px',
          top: '20%',
          left: '35%',
          background: 'radial-gradient(circle, rgba(64,192,192,0.04) 0%, rgba(201,166,70,0.02) 50%, transparent 75%)',
          filter: 'blur(120px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Layer 4: Soft teal pulse radial (animated glow) ── */}
      <div
        className="absolute rounded-full ambient-glow"
        style={{
          width: '30vw',
          height: '30vw',
          maxWidth: '400px',
          maxHeight: '400px',
          top: '10%',
          right: '20%',
          background: 'radial-gradient(circle, rgba(64,192,192,0.055) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Layer 5: Sacred geometry — mouse parallax driven ── */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute"
          style={{
            right: '-60px',
            top: '5%',
            width: 'min(700px, 55vw)',
            height: 'min(700px, 55vw)',
            x: springX,
            y: springY,
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <MandalaPattern
            type="geometry"
            animateRotation={true}
            opacity={0.035}
            className="w-full h-full text-[#166D74]"
          />
        </motion.div>
      )}

      {/* ── Layer 6: Inner sacred geometry (counter-rotation) ── */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute"
          style={{
            right: '5%',
            top: '15%',
            width: 'min(400px, 35vw)',
            height: 'min(400px, 35vw)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <MandalaPattern
            type="concentric"
            opacity={0.025}
            className="w-full h-full text-[#C9A646]"
          />
        </motion.div>
      )}

      {/* ── Layer 7: Subtle diagonal grid lines ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(22,109,116,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22,109,116,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* ── Layer 8: Left editorial vertical rule ── */}
      <div
        className="absolute left-[8%] top-0 bottom-0 w-[1px] opacity-[0.07]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(22,109,116,0.8) 30%, rgba(201,166,70,0.5) 70%, transparent 100%)',
        }}
      />

      {/* ── Layer 9: Right editorial vertical rule ── */}
      <div
        className="absolute right-[8%] top-0 bottom-0 w-[1px] opacity-[0.07]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(22,109,116,0.8) 30%, rgba(201,166,70,0.5) 70%, transparent 100%)',
        }}
      />

      {/* ── Layer 10: Lotus pattern floating near center-left ── */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute left-[5%] bottom-[15%] w-[220px] h-[220px] text-[#C9A646] opacity-[0.025] hidden lg:block"
          animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        >
          <MandalaPattern type="lotus" opacity={0.04} className="w-full h-full" />
        </motion.div>
      )}

    </div>
  );
}

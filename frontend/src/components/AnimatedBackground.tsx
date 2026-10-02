import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import MeshGradient from './MeshGradient';
import MandalaPattern from './MandalaPattern';

interface AnimatedBackgroundProps {
  patternType?: 'mandala' | 'lotus' | 'geometry' | 'concentric' | 'waves' | 'curves' | 'diamond' | 'mesh' | 'constellation' | 'sacred' | 'lattice' | 'linearGrid';
  animateRotation?: boolean;
  patternClassName?: string;
  opacity?: number;
  /** Unique section identity mode — overrides default rendering */
  sectionMode?: 'about' | 'services' | 'testimonials' | 'faq' | 'contact' | 'footer' | 'hero' | 'stats';
}

export default function AnimatedBackground({ 
  patternType, 
  animateRotation = false, 
  patternClassName = 'top-10 -right-20 w-[600px] h-[600px] text-[#166D74]',
  opacity = 0.03,
  sectionMode
}: AnimatedBackgroundProps) {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Mouse parallax (gentle, for every section)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { damping: 50, stiffness: 100, mass: 1 });
  const parallaxY = useSpring(mouseY, { damping: 50, stiffness: 100, mass: 1 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 20;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  /* ─────────────────────────────────────────
     ABOUT SECTION — Mandala + thin gold art
  ───────────────────────────────────────── */
  if (sectionMode === 'about') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
        {/* Soft ivory-gold ambient glow */}
        <div className="absolute rounded-full ambient-blob-2" style={{
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          top: '-20%', right: '-10%',
          background: 'radial-gradient(circle, rgba(201,166,70,0.05) 0%, transparent 70%)',
          filter: 'blur(100px)', transform: 'translateZ(0)',
        }} />
        <div className="absolute rounded-full ambient-blob-1" style={{
          width: '40vw', height: '40vw', maxWidth: '500px', maxHeight: '500px',
          bottom: '-10%', left: '-5%',
          background: 'radial-gradient(circle, rgba(64,192,192,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)', transform: 'translateZ(0)',
        }} />
        {/* Thin mandala line art */}
        <motion.div
          className="absolute"
          style={{ right: '-40px', top: '5%', width: 'min(500px, 40vw)', height: 'min(500px, 40vw)',
            x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        >
          <MandalaPattern type="mandala" animateRotation={!prefersReducedMotion} opacity={0.028} className="w-full h-full text-[#C9A646]" />
        </motion.div>
        <MandalaPattern type="lotus" opacity={0.02} className="absolute left-[5%] bottom-[10%] w-[300px] h-[300px] text-[#166D74]" />
      </div>
    );
  }

  /* ─────────────────────────────────────────
     SERVICES SECTION — Luxury grid + minimal geometry
  ───────────────────────────────────────── */
  if (sectionMode === 'services') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute ambient-blob-1" style={{
          width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
          top: '-5%', left: '-5%',
          background: 'radial-gradient(circle, rgba(64,192,192,0.045) 0%, transparent 70%)',
          filter: 'blur(90px)', transform: 'translateZ(0)', borderRadius: '50%',
        }} />
        <div className="absolute ambient-blob-3" style={{
          width: '35vw', height: '35vw', maxWidth: '450px', maxHeight: '450px',
          bottom: '-5%', right: '-5%',
          background: 'radial-gradient(circle, rgba(201,166,70,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)', transform: 'translateZ(0)', borderRadius: '50%',
        }} />
        {/* Subtle linearGrid background at very low opacity */}
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: 'linear-gradient(rgba(22,109,116,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(22,109,116,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 80%)',
        }} />
        <motion.div
          className="absolute"
          style={{ right: '-60px', top: '10%', width: 'min(600px, 50vw)', height: 'min(600px, 50vw)',
            x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        >
          <MandalaPattern type="geometry" animateRotation={!prefersReducedMotion} opacity={0.03} className="w-full h-full text-[#166D74]" />
        </motion.div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     TESTIMONIALS SECTION — Constellation dots
  ───────────────────────────────────────── */
  if (sectionMode === 'testimonials') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
        {/* Warm gold central glow */}
        <div className="absolute ambient-glow" style={{
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateZ(0)',
          background: 'radial-gradient(circle, rgba(201,166,70,0.05) 0%, rgba(64,192,192,0.03) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        {/* Constellation pattern bottom-right */}
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full opacity-[0.04]"
          style={{ x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        >
          <MandalaPattern type="constellation" opacity={0.045} className="w-full h-full text-[#166D74]" />
        </motion.div>
        {/* Second constellation layer (gold tint) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-[0.025]"
          animate={prefersReducedMotion ? {} : { x: [0, 8, 0], y: [0, -6, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MandalaPattern type="constellation" opacity={0.03} className="w-full h-full text-[#C9A646]" />
        </motion.div>
        {/* Soft teal blob top-left */}
        <div className="absolute rounded-full ambient-blob-1" style={{
          width: '30vw', height: '30vw', top: '-5%', left: '-5%',
          background: 'radial-gradient(circle, rgba(64,192,192,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)', transform: 'translateZ(0)',
        }} />
      </div>
    );
  }

  /* ─────────────────────────────────────────
     FAQ SECTION — Fine geometric pattern + light gradient
  ───────────────────────────────────────── */
  if (sectionMode === 'faq') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute ambient-blob-2" style={{
          width: '55vw', height: '55vw', maxWidth: '650px', maxHeight: '650px',
          top: '-10%', right: '-10%',
          background: 'radial-gradient(circle, rgba(201,166,70,0.04) 0%, transparent 70%)',
          filter: 'blur(90px)', transform: 'translateZ(0)', borderRadius: '50%',
        }} />
        {/* Fine diamond lattice */}
        <motion.div
          className="absolute left-[-80px] top-[0%] w-[500px] h-full"
          style={{ x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        >
          <MandalaPattern type="diamond" opacity={0.025} className="w-full h-full text-[#C9A646]" />
        </motion.div>
        <MandalaPattern type="concentric" animateRotation={!prefersReducedMotion} opacity={0.02} className="absolute -right-10 -bottom-10 w-[350px] h-[350px] text-[#166D74]" />
      </div>
    );
  }

  /* ─────────────────────────────────────────
     CONTACT SECTION — Curved SVG lines + mesh gradient
  ───────────────────────────────────────── */
  if (sectionMode === 'contact') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute ambient-blob-1" style={{
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          top: '-15%', left: '-10%',
          background: 'radial-gradient(circle, rgba(64,192,192,0.05) 0%, transparent 70%)',
          filter: 'blur(100px)', transform: 'translateZ(0)', borderRadius: '50%',
        }} />
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{ x: prefersReducedMotion ? 0 : parallaxX, y: prefersReducedMotion ? 0 : parallaxY }}
        >
          <MandalaPattern type="curves" opacity={0.025} className="absolute -right-20 bottom-0 w-[600px] h-[400px] text-[#166D74]" />
        </motion.div>
        <MandalaPattern type="sacred" animateRotation={!prefersReducedMotion} opacity={0.022} className="absolute -right-20 -top-20 w-[450px] h-[450px] text-[#C9A646]" />
      </div>
    );
  }

  /* ─────────────────────────────────────────
     STATS STRIP — Minimal, just a glow
  ───────────────────────────────────────── */
  if (sectionMode === 'stats') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute ambient-glow" style={{
          width: '80%', height: '200%', top: '-50%', left: '10%',
          background: 'radial-gradient(ellipse, rgba(201,166,70,0.04) 0%, rgba(64,192,192,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)', transform: 'translateZ(0)',
        }} />
      </div>
    );
  }

  /* ─────────────────────────────────────────
     DEFAULT — Generic ambient with pattern
  ───────────────────────────────────────── */
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* Ambient mesh color */}
      <MeshGradient />

      {/* Mouse parallax pattern */}
      {patternType && (
        <motion.div
          className="absolute"
          style={{
            x: prefersReducedMotion ? 0 : parallaxX,
            y: prefersReducedMotion ? 0 : parallaxY,
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <MandalaPattern
            type={patternType}
            animateRotation={animateRotation}
            className={patternClassName}
            opacity={opacity}
          />
        </motion.div>
      )}

      {/* Extra drifting lotus */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute text-[#C9A646] pointer-events-none w-72 h-72 hidden md:block"
          style={{ left: '8%', top: '25%', transform: 'translateZ(0)' }}
          animate={{ y: [0, -22, 18, 0], rotate: [0, 40, -40, 0] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MandalaPattern type="lotus" opacity={0.018} className="w-full h-full" />
        </motion.div>
      )}

      {/* Soft radial top glow */}
      <div
        className="absolute -top-32 left-1/4 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,166,70,0.025) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
}

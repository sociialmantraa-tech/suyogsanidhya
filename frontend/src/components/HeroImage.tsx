'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import abhayImg from '../assets/abhay.jpg';

const abhayImage = typeof abhayImg === 'string' ? abhayImg : (abhayImg as any)?.src || abhayImg;

export default function HeroImage() {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Mouse parallax for depth effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 60, mass: 1.5 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 60, mass: 1.5 });

  // Layer depth transforms (different layers move at different rates for parallax)
  const layer1X = useTransform(springX, [0, 1], [-8, 8]);
  const layer1Y = useTransform(springY, [0, 1], [-6, 6]);
  const layer2X = useTransform(springX, [0, 1], [-14, 14]);
  const layer2Y = useTransform(springY, [0, 1], [-10, 10]);
  const layer3X = useTransform(springX, [0, 1], [6, -6]);
  const layer3Y = useTransform(springY, [0, 1], [4, -4]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  return (
    <div className="relative w-full max-w-[430px] mx-auto" style={{ aspectRatio: '4/5' }}>

      {/* ── Layer A: Outer ambient glow radial ── */}
      <div
        className="absolute pointer-events-none -z-20"
        style={{
          inset: '-25%',
          background: 'radial-gradient(circle at 55% 45%, rgba(64,192,192,0.08) 0%, rgba(201,166,70,0.06) 45%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'glowPulse 12s ease-in-out infinite',
        }}
      />

      {/* ── Layer B: Concentric Sacred Geometry backdrop ── */}
      <div
        className="absolute -z-10 pointer-events-none select-none flex items-center justify-center"
        style={{ inset: '-15%', opacity: 0.03 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" fill="none" stroke="#166D74" strokeWidth="0.4" className="w-full h-full">
          <circle cx="50" cy="50" r="8" />
          <circle cx="50" cy="50" r="18" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="42" />
          <circle cx="50" cy="50" r="48" />
          <path d="M50 0 L50 100 M0 50 L100 50 M14.6 14.6 L85.4 85.4 M85.4 14.6 L14.6 85.4" />
          {[...Array(8)].map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 18}
                y1={50 + Math.sin(a) * 18}
                x2={50 + Math.cos(a) * 42}
                y2={50 + Math.sin(a) * 42}
                opacity={0.5}
              />
            );
          })}
        </svg>
      </div>

      {/* ── Layer C: Background offset card (depth layer) ── */}
      <motion.div
        className="absolute inset-0 rounded-[32px] -z-10 pointer-events-none"
        style={{
          backgroundColor: '#F2EEE4',
          border: '1.5px solid rgba(201,166,70,0.12)',
          x: prefersReducedMotion ? 22 : layer2X,
          y: prefersReducedMotion ? 22 : layer2Y,
          boxShadow: 'inset 0 0 40px rgba(64,192,192,0.02)',
        }}
        animate={prefersReducedMotion ? {} : { rotate: [-0.5, 0.8, -0.5] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Layer D: Gold outline frame (offset opposite direction) ── */}
      <motion.div
        className="absolute inset-0 rounded-[32px] -z-10 pointer-events-none"
        style={{
          border: '1px solid rgba(201,166,70,0.30)',
          x: prefersReducedMotion ? -16 : layer3X,
          y: prefersReducedMotion ? -16 : layer3Y,
        }}
        animate={prefersReducedMotion ? {} : {
          opacity: [0.3, 0.55, 0.3],
          rotate: [0.5, -0.8, 0.5],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Layer E: Breathing gold ring ── */}
      <motion.div
        className="absolute pointer-events-none -z-10"
        style={{ inset: '-6px', borderRadius: '38px' }}
        animate={prefersReducedMotion ? {} : {
          boxShadow: [
            '0 0 0 0px rgba(201,166,70,0)',
            '0 0 0 6px rgba(201,166,70,0.08)',
            '0 0 0 0px rgba(201,166,70,0)',
          ],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Layer F: Main glass photo container (with mouse parallax) ── */}
      <motion.div
        className="absolute inset-0 rounded-[30px] overflow-hidden group flex items-center justify-center p-5"
        style={{
          backgroundColor: 'rgba(255,252,247,0.15)',
          backdropFilter: 'blur(2px)',
          border: '1.5px solid rgba(255,255,255,0.45)',
          boxShadow: [
            '0 30px 80px rgba(22,109,116,0.08)',
            '0 8px 24px rgba(22,109,116,0.04)',
            'inset 0 0 40px rgba(255,255,255,0.25)',
          ].join(', '),
          x: prefersReducedMotion ? 0 : layer1X,
          y: prefersReducedMotion ? 0 : layer1Y,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
        animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner gradient overlay (depth / warmth) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(160deg, rgba(255,253,247,0.12) 0%, transparent 50%, rgba(22,109,116,0.04) 100%)',
          }}
        />

        {/* Portrait photo */}
        <img
          src={abhayImage}
          alt="Abhay Harpale — Relationship & Intimacy Advisor"
          width={380}
          height={475}
          className="w-full h-full object-contain object-top z-10 relative"
          style={{
            filter: 'contrast(1.01) brightness(1.01) saturate(1.02)',
          }}
          loading="eager"
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,252,247,0.9) 0%, transparent 100%)',
          }}
        />

        {/* ── Floating Identity Card ── */}
        <motion.div
          className="absolute bottom-5 left-5 right-5 z-30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-2xl px-5 py-3.5 text-left"
            style={{
              backgroundColor: 'rgba(255,252,247,0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(201,166,70,0.2)',
              boxShadow: '0 16px 40px rgba(22,109,116,0.06), 0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <h3
              className="font-serif tracking-tight mb-0.5"
              style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-dark-cyan)', lineHeight: 1.2 }}
            >
              Abhay Harpale
            </h3>
            <p
              className="font-sans"
              style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary-turquoise)' }}
            >
              Relationship &amp; Intimacy Advisor
            </p>
            {/* Gold divider line */}
            <div
              className="mt-2"
              style={{
                height: '1px',
                background: 'linear-gradient(to right, var(--color-accent-gold), transparent)',
              }}
            />
            <div className="mt-2 py-1 px-3 rounded-lg inline-block" style={{ backgroundColor: 'rgba(184, 148, 58, 0.08)' }}>
              <p
                className="sanskrit-text"
                style={{ fontSize: '13px', display: 'block', color: 'var(--color-dark-cyan)', fontWeight: '600', opacity: 1, fontStyle: 'normal' }}
              >
                रसो वै जीवनम्
              </p>
            </div>
            <p
              className="sanskrit-caption mt-1"
              style={{ fontSize: '9px', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--color-accent-gold)', opacity: 1 }}
            >
              RELATIONSHIP IS THE ESSENCE OF LIFE
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Floating OM ornament ── */}
      <motion.div
        className="absolute -right-5 top-[22%] z-30 pointer-events-none"
        animate={prefersReducedMotion ? {} : {
          y: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: 'rgba(255,252,247,0.96)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(201,166,70,0.28)',
            boxShadow: '0 8px 24px rgba(201,166,70,0.12)',
          }}
        >
          <span className="font-serif text-xl" style={{ color: '#C9A646', lineHeight: 1 }}>ॐ</span>
        </div>
      </motion.div>

      {/* ── Floating trust badge (top-left) ── */}
      <motion.div
        className="absolute -left-6 top-[35%] z-30 pointer-events-none hidden lg:flex"
        animate={prefersReducedMotion ? {} : {
          y: [0, -12, 0],
          rotate: [0, -3, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <div
          className="rounded-2xl px-4 py-2.5 text-center"
          style={{
            backgroundColor: 'rgba(255,252,247,0.94)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(64,192,192,0.2)',
            boxShadow: '0 8px 24px rgba(22,109,116,0.08)',
          }}
        >
          <span className="font-serif block" style={{ fontSize: '1.4rem', color: '#C9A646', lineHeight: 1 }}>12+</span>
          <span className="font-sans block" style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#5F6C72', marginTop: '2px' }}>Years</span>
        </div>
      </motion.div>

      {/* ── Ambient corner glow ── */}
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(64,192,192,0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'glowPulse 8s ease-in-out infinite 2s',
        }}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingParticles() {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion) return null;

  const particles = [
    { top: '15%', left: '10%', size: 3, duration: 18, delay: 0 },
    { top: '25%', left: '85%', size: 2, duration: 22, delay: 2 },
    { top: '45%', left: '18%', size: 4, duration: 16, delay: 1 },
    { top: '60%', left: '78%', size: 2, duration: 24, delay: 3 },
    { top: '75%', left: '12%', size: 3, duration: 20, delay: 0.5 },
    { top: '82%', left: '88%', size: 2, duration: 26, delay: 4 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: '#C9A646',
            opacity: 0.35,
            boxShadow: '0 0 8px rgba(201,166,70,0.6)',
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingParticles() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  // Create 15 tiny floating glowing dots with random sizes, delays, and paths
  const particles = Array.from({ length: 15 }, (_, i) => {
    const size = Math.random() * 3 + 2; // 2px to 5px
    return {
      id: i,
      size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0],
      y: [0, Math.random() * -100 - 50, Math.random() * 60 - 30, 0],
      duration: Math.random() * 25 + 25, // 25s to 50s
      delay: Math.random() * -20 // start immediately at random point
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          animate={{
            x: p.x,
            y: p.y,
            opacity: [0, 0.4, 0.8, 0.4, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay
          }}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: '#40C0C0', // Brand turquoise
            boxShadow: '0 0 8px rgba(64, 192, 192, 0.4)',
            left: p.left,
            top: p.top,
          }}
        />
      ))}
    </div>
  );
}

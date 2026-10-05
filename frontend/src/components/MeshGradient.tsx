'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MeshGradient() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const blobs = [
    {
      color: 'rgba(64, 192, 192, 0.04)', // Signature Accent
      width: '600px',
      height: '600px',
      x: [0, 80, -40, 0],
      y: [0, -90, 50, 0],
      duration: 35
    },
    {
      color: 'rgba(201, 166, 70, 0.03)', // Gold Accent
      width: '500px',
      height: '500px',
      x: [0, -70, 60, 0],
      y: [0, 80, -60, 0],
      duration: 45
    },
    {
      color: 'rgba(22, 109, 116, 0.02)', // Primary Heading color
      width: '700px',
      height: '700px',
      x: [0, 60, -80, 0],
      y: [0, -50, 70, 0],
      duration: 55
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {blobs.map((blob, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full blur-[100px] mix-blend-multiply"
          animate={prefersReducedMotion ? {} : {
            x: blob.x,
            y: blob.y,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{
            backgroundColor: blob.color,
            width: blob.width,
            height: blob.height,
            top: idx === 0 ? '10%' : idx === 1 ? '40%' : '20%',
            left: idx === 0 ? '5%' : idx === 1 ? '50%' : '25%',
          }}
        />
      ))}
    </div>
  );
}

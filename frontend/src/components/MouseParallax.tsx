'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MouseParallaxProps {
  children: React.ReactNode;
  intensity?: number; // how much displacement (px)
  className?: string;
}

export default function MouseParallax({ children, intensity = 12, className = '' }: MouseParallaxProps) {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  
  // Motion values for hardware acceleration
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics configuration
  const springConfig = { stiffness: 90, damping: 22, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse positions (-0.5 to 0.5)
      const normX = (e.clientX / innerWidth) - 0.5;
      const normY = (e.clientY / innerHeight) - 0.5;
      
      x.set(normX * intensity);
      y.set(normY * intensity);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, prefersReducedMotion, x, y]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div 
      className={className}
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      {children}
    </motion.div>
  );
}

'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'secondary' | 'white';
  showArrow?: boolean;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  showArrow = false,
  to,
  href,
  onClick,
  className = '',
  style,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const btnRef = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  // Magnetic hover physics
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { damping: 25, stiffness: 200, mass: 0.5 });
  const springY = useSpring(magnetY, { damping: 25, stiffness: 200, mass: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.25; // Magnetic pull factor
    const dy = (e.clientY - centerY) * 0.25;
    magnetX.set(dx);
    magnetY.set(dy);
  }, [prefersReducedMotion, magnetX, magnetY]);

  const handleMouseLeave = useCallback(() => {
    magnetX.set(0);
    magnetY.set(0);
  }, [magnetX, magnetY]);

  // Ripple effect on click
  const handleRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 700);
  }, [prefersReducedMotion]);

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#166D74',
      color: '#FFFFFF',
      border: '1.5px solid #166D74',
      boxShadow: '0 4px 20px rgba(22, 109, 116, 0.2)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#166D74',
      border: '1.5px solid rgba(64, 192, 192, 0.4)',
      boxShadow: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#166D74',
      border: '1.5px solid rgba(64, 192, 192, 0.4)',
      boxShadow: 'none',
    },
    white: {
      backgroundColor: '#FFFFFF',
      color: '#166D74',
      border: '1.5px solid #FFFFFF',
      boxShadow: '0 4px 14px rgba(22, 109, 116, 0.08)',
    },
  };

  const hoverAnimations = prefersReducedMotion ? {} : {
    y: -4,
    scale: 1.01,
    boxShadow: variant === 'primary'
      ? '0 16px 40px rgba(64, 192, 192, 0.32), 0 4px 12px rgba(22, 109, 116, 0.15)'
      : variant === 'white'
        ? '0 12px 30px rgba(22, 109, 116, 0.12)'
        : '0 12px 28px rgba(64, 192, 192, 0.14)',
  };

  const rippleColor = variant === 'primary' ? 'rgba(255,255,255,0.25)' : 'rgba(64,192,192,0.2)';

  const buttonContent = (
    <>
      {/* Ripple container */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 4,
            height: 4,
            transform: 'translate(-50%, -50%)',
            backgroundColor: rippleColor,
            animation: 'rippleOut 0.7s ease-out forwards',
          }}
        />
      ))}

      {/* Gradient shimmer sweep */}
      <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      {/* Label + arrow */}
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
        {showArrow && (
          <motion.span
            className="inline-flex"
            animate={prefersReducedMotion ? {} : {}}
            whileHover={prefersReducedMotion ? {} : { x: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.span>
        )}
      </span>
    </>
  );

  const baseClasses = `btn transition-all duration-300 relative overflow-hidden select-none group`;
  const destination = href || to;

  if (destination) {
    return (
      <motion.div
        className="inline-block"
        style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}
        whileHover={hoverAnimations}
        whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={btnRef as React.RefObject<HTMLDivElement>}
      >
        <Link
          href={destination}
          onClick={(e) => {
            handleRipple(e as unknown as React.MouseEvent<HTMLElement>);
            if (onClick) onClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
          }}
          className={`${baseClasses} ${className}`}
          style={{ ...variantStyles[variant], ...style }}
        >
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="inline-block"
      style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}
      whileHover={hoverAnimations}
      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={btnRef as React.RefObject<HTMLDivElement>}
    >
      <button
        type={type}
        disabled={disabled}
        onClick={(e) => {
          handleRipple(e as unknown as React.MouseEvent<HTMLElement>);
          if (onClick) onClick(e);
        }}
        className={`${baseClasses} ${className}`}
        style={{ ...variantStyles[variant], ...style, opacity: disabled ? 0.55 : 1 }}
      >
        {buttonContent}
      </button>
    </motion.div>
  );
}

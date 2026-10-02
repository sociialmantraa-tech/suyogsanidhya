import React, { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        // Center the glow on the mouse pointer
        glowRef.current.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div 
      ref={glowRef}
      className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none select-none rounded-full z-[3] mix-blend-screen transition-opacity duration-500 opacity-0 md:opacity-[0.035]"
      style={{
        background: 'radial-gradient(circle, rgba(64, 192, 192, 0.4) 0%, transparent 70%)',
        willChange: 'transform',
        transform: 'translate3d(-400px, -400px, 0)',
      }}
      aria-hidden="true"
    />
  );
}

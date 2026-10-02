import React from 'react';
import AnimatedBackground from './AnimatedBackground';

type SectionMode = 'about' | 'services' | 'testimonials' | 'faq' | 'contact' | 'footer' | 'hero' | 'stats';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'alternate';
  patternType?: 'mandala' | 'lotus' | 'geometry' | 'concentric' | 'waves' | 'curves' | 'diamond' | 'mesh' | 'constellation' | 'sacred' | 'lattice' | 'linearGrid';
  animateRotation?: boolean;
  patternClassName?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  opacity?: number;
  /** Assign a unique premium ambient identity to this section */
  sectionMode?: SectionMode;
}

export default function BackgroundWrapper({
  children,
  variant = 'primary',
  patternType,
  animateRotation = false,
  patternClassName,
  className = '',
  id,
  style,
  opacity = 0.03,
  sectionMode
}: BackgroundWrapperProps) {
  // Map variant to background color variables
  const bgStyles = {
    primary:   { backgroundColor: '#F6F2E8' }, // Warm Ivory
    secondary: { backgroundColor: '#F9F6EF' }, // Secondary
    alternate: { backgroundColor: '#F2EEE4' }  // Alternate Section
  };

  return (
    <section
      id={id}
      className={`relative overflow-hidden w-full transition-colors duration-500 ${className}`}
      style={{ ...bgStyles[variant], ...style }}
    >
      {/* Centralized premium animated backdrop layers */}
      <AnimatedBackground
        patternType={patternType}
        animateRotation={animateRotation}
        patternClassName={patternClassName}
        opacity={opacity}
        sectionMode={sectionMode}
      />

      {/* Foreground Children Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}

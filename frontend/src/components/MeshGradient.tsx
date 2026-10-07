import React from 'react';

export default function MeshGradient() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      style={{
        background: `
          radial-gradient(circle at 15% 15%, rgba(201, 166, 70, 0.05) 0%, transparent 45%),
          radial-gradient(circle at 85% 65%, rgba(22, 109, 116, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 50% 90%, rgba(201, 166, 70, 0.03) 0%, transparent 40%)
        `,
      }}
    />
  );
}

'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFFFFC] min-h-screen flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#00AAC1]/20 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EBF7F7] text-[#00AAC1] flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#1F2937]">System Recovery</h2>
            <p className="text-xs text-[#5E6E72]">A critical error occurred. Please refresh the page to restore your session.</p>
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#00AAC1] hover:bg-[#008496] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Refresh Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}

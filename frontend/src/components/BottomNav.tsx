'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Compass, Calendar, BookOpen, PhoneCall } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/services', label: 'Services', icon: Compass },
    { href: '/book', label: 'Book', icon: Calendar, isCta: true },
    { href: '/stories', label: 'Stories', icon: BookOpen },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9990] md:hidden bg-white/95 backdrop-blur-2xl border-t border-[#00AAC1]/15 shadow-[0_-4px_25px_rgba(0,170,193,0.12)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile Bottom Navigation"
      style={{
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="w-full max-w-lg mx-auto px-2 py-1 flex items-center justify-between relative">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          if (item.isCta) {
            return (
              <div key={item.href} className="relative flex-1 flex flex-col items-center justify-center">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-5 group focus:outline-none"
                  aria-label="Book Consultation"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.06, y: -1 }}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#0096A9] via-[#00AAC1] to-[#00D4EC] shadow-[0_6px_20px_rgba(0,170,193,0.4)] border-[3px] border-white ring-1 ring-[#00AAC1]/30 relative overflow-hidden"
                  >
                    {/* Subtle top light overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                    <Icon className="w-6 h-6 text-white stroke-[2.2px] drop-shadow-xs" />
                  </motion.div>
                  <span className="text-[10.5px] font-sans font-bold tracking-tight mt-0.5 text-[#00AAC1]">
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-1 transition-all focus:outline-none group relative"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`relative flex flex-col items-center px-2 py-0.5 rounded-xl transition-all duration-200 ${
                  active ? 'bg-[#00AAC1]/10' : 'hover:bg-slate-100/80'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    active
                      ? 'text-[#00AAC1] stroke-[2.4px] scale-105'
                      : 'text-[#4B5563] group-hover:text-[#00AAC1] stroke-[1.8px]'
                  }`}
                />
                <span
                  className={`text-[10.5px] font-sans transition-all duration-200 mt-0.5 ${
                    active
                      ? 'text-[#00AAC1] font-bold'
                      : 'text-[#4B5563] font-medium group-hover:text-[#00AAC1]'
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator dot */}
                {active && (
                  <motion.div
                    layoutId="bottom-nav-active-pill"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#00AAC1]"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

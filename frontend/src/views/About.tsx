'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, HeartHandshake, ShieldCheck, Quote, Star, Compass } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import abhayImg from '../assets/abhay.jpg';
import abhayCutoutImg from '../assets/abhay_cutout.png';
import SEO from '../components/SEO';
import MandalaPattern from '../components/MandalaPattern';
import MeshGradient from '../components/MeshGradient';
import { demoBlogs } from '../data/demoBlogs';

const abhay = typeof abhayImg === 'string' ? abhayImg : (abhayImg as any)?.src || abhayImg;

export default function About() {
  const stories = demoBlogs;

  return (
    <div className="w-full">
      <SEO
        title="About Me | Abhay Harpale — Founder, Suyog Saanidhya"
        description="I completed my Bachelor of Performing Arts in Dramatics, graduating First Class First and receiving a Gold Medal. My mission is to be a guardian of couple relationships."
        canonical="/about"
      />

      {/* ══════════════════════════════════════════════════════════════════
          1. ABOUT ME SECTION (As per Wireframe Page 2)
          Text on Left, Professional Photo on Right
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 bg-[#FFFFFC] overflow-hidden">
        {/* Ambient mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <MeshGradient />
        </div>

        <MandalaPattern
          type="lotus"
          className="absolute -left-20 top-20 w-[450px] h-[450px] text-[#166D74]"
          opacity={0.025}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Exact Biography Text from Wireframe */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-left"
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF7F7] border border-[#00AAC1]/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#00AAC1]" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#006B7D]">
                  Founder &amp; Relationship Guardian
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1F2937] tracking-tight">
                About Me
              </h1>

              {/* Exact content paragraphs from user's wireframe */}
              <div className="space-y-4 font-sans text-base sm:text-lg text-[#4B5563] leading-relaxed">
                <p className="font-semibold text-[#006B7D] text-lg sm:text-xl font-serif">
                  I completed my Bachelor of Performing Arts in Dramatics, graduating First Class First and receiving a Gold Medal.
                </p>

                <p>
                  I moved to Mumbai in 1997 and began my career as an actor in Gujarati commercial theatre. Over the years, I have written and directed plays and performed in more than 3,500 stage shows and 3,500 Hindi television episodes.
                </p>

                <p>
                  For decades, I have studied and portrayed human characters. Today, I bring that experience beyond the stage — to understanding real people, their emotions, behaviours, and relationships.
                </p>

                <p className="p-4 rounded-2xl bg-[#EBF7F7] border-l-4 border-[#00AAC1] italic font-serif text-[#006B7D]">
                  My focus is on couple relationships, because I believe healthy relationships are at the foundation of individual happiness and a happier society.
                </p>

                <p className="font-bold text-[#00AAC1]">
                  My mission is to be a guardian of couple relationships — helping couples understand each other, navigate differences, and build healthier, more meaningful relationships.
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/book"
                  className="px-8 py-3.5 rounded-full font-sans text-sm font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#stories"
                  className="px-6 py-3.5 rounded-full font-sans text-sm font-bold text-[#00AAC1] bg-white border-2 border-[#00AAC1] hover:bg-[#EBF7F7] transition-all"
                >
                  <span>Read Stories</span>
                </Link>
              </div>
            </motion.div>

            {/* Right: Original Professional Photo with full background */}
            <motion.div
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[36px] p-2">
                <div
                  className="absolute inset-0 rounded-[36px] -z-10 blur-xl opacity-60 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0,170,193,0.2) 0%, rgba(0,107,125,0.1) 60%, transparent 80%)'
                  }}
                />
                
                <div
                  className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl group flex items-center justify-center bg-gray-100"
                  style={{
                    border: '4px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 24px 60px -12px rgba(0, 170, 193, 0.18)'
                  }}
                >
                  <img
                    src={abhay}
                    alt="Abhay Harpale — Founder & Relationship Guardian"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#00AAC1]/20 shadow-md text-left z-10">
                    <h4 className="font-serif text-lg font-bold text-[#1F2937]">Abhay Harpale</h4>
                    <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#00AAC1]">Gold Medalist · Relationship Guardian</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. STORIES SECTION (As per Wireframe Page 2)
          Personal experiences dealt with clients
      ══════════════════════════════════════════════════════════════════ */}
      <section id="stories" className="py-24 px-6 md:px-12 bg-[#F7FAF9] border-t border-[rgba(22,109,116,0.08)] relative">
        <MandalaPattern
          type="sacred"
          className="absolute right-0 bottom-0 w-[500px] h-[500px] text-[#C9A646]"
          opacity={0.02}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Heading & Wireframe Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D0EAE4] shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#C9A646]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#166D74]">
                Client Journeys
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F5D66]">
              Stories
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#B8943A]">
              These are some personal experience that I have dealt with my clients
            </p>
          </div>

          {/* Stories Grid (As per wireframe 3 columns with Catchy Heading, First 2 lines, Read More) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.article
                key={story.id || index}
                className="bg-white rounded-3xl p-8 border border-[rgba(22,109,116,0.1)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="space-y-4">
                  {/* Category */}
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F8F6] text-[#166D74] border border-[#D0EAE4]">
                    {story.category_name || 'Client Experience'}
                  </span>

                  {/* Catchy Headline */}
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#0F5D66] group-hover:text-[#166D74] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  {/* First Two lines... */}
                  <p className="font-sans text-sm text-[#5E6E72] leading-relaxed line-clamp-2">
                    {story.excerpt || story.content?.substring(0, 140) + '...'}
                  </p>
                </div>

                {/* Read More Button (Leads to single story page) */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/stories/${story.slug}`}
                    className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-[#166D74] group-hover:text-[#0F5D66] hover:underline"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <span className="text-[11px] font-sans text-slate-400">
                    {story.reading_time || '4 min read'}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

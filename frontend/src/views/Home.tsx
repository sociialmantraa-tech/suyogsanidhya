'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Play, X, Heart, Shield, Check, Star, BookOpen, Quote, ChevronDown, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { usePublicData } from '../context/PublicDataContext';
import gsap from 'gsap';
import abhayImg from '../assets/abhay.jpg';
import connectionImg from '../assets/connection.png';
import videoSessionImg from '../assets/video_session.png';

const abhayImage = typeof abhayImg === 'string' ? abhayImg : (abhayImg as any)?.src || abhayImg;
const connectionImage = typeof connectionImg === 'string' ? connectionImg : (connectionImg as any)?.src || connectionImg;
const videoSessionImage = typeof videoSessionImg === 'string' ? videoSessionImg : (videoSessionImg as any)?.src || videoSessionImg;
import SEO from '../components/SEO';

// Static Fallback Datasets
import BackgroundWrapper from '../components/BackgroundWrapper';
import HeroBackground from '../components/HeroBackground';
import HeroImage from '../components/HeroImage';
import SectionDivider from '../components/SectionDivider';
import Button from '../components/Button';
import { demoServices } from '../data/demoServices';
import { demoBlogs } from '../data/demoBlogs';
import { demoTestimonials } from '../data/demoTestimonials';
import { demoFaqs } from '../data/demoFaqs';
import { demoVideos } from '../data/demoVideos';
import { demoConcerns } from '../data/demoConcerns';

import { Blog, Faq, Video, Testimonial, Service } from '../types';

export default function Home() {
  const [pageData, setPageData] = useState<any>(null);
  const { services, loading: publicDataLoading } = usePublicData();
  const servicesLoading = publicDataLoading;
  const [concerns, setConcerns] = useState<any[]>([]);
  const [activeConcernTab, setActiveConcernTab] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Loading States
  const [testimonialsLoading, setTestimonialsLoading] = useState<boolean>(true);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const [faqsLoading, setFaqsLoading] = useState<boolean>(true);
  const [videosLoading, setVideosLoading] = useState<boolean>(true);
  
  const getYoutubeId = (url: string) => {
    try {
      let videoId: string | null = '';
      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop()?.split('?')[0] || '';
      } else if (url.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/').pop()?.split('?')[0] || '';
      }
      return videoId || '';
    } catch (e) {
      return '';
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = getYoutubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
  };

  const getThumbnailUrl = (video: Video) => {
    if (video.thumbnail_url && (video.thumbnail_url.startsWith('http') || video.thumbnail_url.startsWith('/'))) {
      return video.thumbnail_url;
    }
    const ytId = getYoutubeId(video.video_url);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return videoSessionImage;
  };
  
  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch Page Sections and Settings
    api.get<any>('/pages/detail.php?slug=home')
      .then(data => {
        setPageData(data);
      })
      .catch(err => console.error("Home Page: Failed to load page sections", err));

    // 3. Populate Concerns
    api.get<{ concerns: any[] }>('/concerns/list.php')
      .then(data => {
        if (data && data.concerns && data.concerns.length > 0) {
          setConcerns(data.concerns);
        } else {
          setConcerns(demoConcerns);
        }
      })
      .catch(err => {
        console.error("Home Page: Failed to load concerns, using demo:", err);
        setConcerns(demoConcerns);
      });
    setActiveConcernTab(1);

    // 4. Fetch Testimonials
    api.get<{ testimonials: Testimonial[] }>('/testimonials/list.php')
      .then(data => {
        if (data && data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        } else {
          setTestimonials(demoTestimonials);
        }
      })
      .catch(err => {
        console.error("Home Page: Failed to load testimonials, using demo:", err);
        setTestimonials(demoTestimonials);
      })
      .finally(() => setTestimonialsLoading(false));

    // 5. Fetch Videos
    api.get<{ videos: Video[] }>('/videos/list.php')
      .then(data => {
        if (data && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          setVideos(demoVideos);
        }
      })
      .catch(err => {
        console.error("Home Page: Failed to load videos, using demo:", err);
        setVideos(demoVideos);
      })
      .finally(() => setVideosLoading(false));

    // 6. Fetch Blogs
    api.get<{ blogs: Blog[] }>('/blogs/list.php?limit=4')
      .then(data => {
        if (data && data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        } else {
          setBlogs(demoBlogs);
        }
      })
      .catch(err => {
        console.error("Home Page: Failed to load blogs, using demo:", err);
        setBlogs(demoBlogs);
      })
      .finally(() => setBlogsLoading(false));

    // 7. Fetch FAQs
    api.get<{ faqs: Faq[] }>('/faqs/list.php')
      .then(data => {
        if (data && data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        } else {
          setFaqs(demoFaqs);
        }
      })
      .catch(err => {
        console.error("Home Page: Failed to load FAQs, using demo:", err);
        setFaqs(demoFaqs);
      })
      .finally(() => setFaqsLoading(false));

    // GSAP Page Load Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power4.out', 
          delay: 0.2,
          onComplete: () => {
            gsap.set(titleRef.current, { clearProps: "transform,willChange" });
          }
        }
      );
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out', 
          delay: 0.6,
          onComplete: () => {
            gsap.set(subtitleRef.current, { clearProps: "transform,willChange" });
          }
        }
      );
      gsap.fromTo(ctaRef.current, 
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out', 
          delay: 0.9,
          onComplete: () => {
            gsap.set(ctaRef.current, { clearProps: "transform,willChange" });
          }
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const heroContent = pageData?.sections?.hero?.content || {
    badge: "RELATIONSHIP & INTIMACY GUIDANCE",
    heading_main: "Guidance for Stronger,",
    heading_highlight: "Healthier Relationships",
    subheading: "Explore personalized relationship and intimacy guidance designed to help individuals and couples improve communication, deepen emotional connection, rebuild trust, and navigate relationship challenges with greater clarity.",
    cta_primary_text: "Book a Private Consultation",
    cta_primary_link: "/book",
    cta_secondary_text: "Explore Guidance Areas",
    cta_secondary_link: "/services",
    trust_indicator: "Confidential â€¢ Respectful â€¢ Support for individuals and couples."
  };

  const statsContent = pageData?.sections?.stats?.content || {
    items: [
      { label: "Years of Guidance", value: "12+" },
      { label: "Private Consultations", value: "2,400+" },
      { label: "Guidance Milestones", value: "85+" },
      { label: "Client Progress Rate", value: "98%" }
    ]
  };

  const aboutPreviewContent = pageData?.sections?.about_preview?.content || {
    eyebrow: "THE APPROACH",
    heading: "Building Stronger Relationships Through Understanding & Communication",
    text_1: "Every relationship faces moments of distance, misunderstanding and change. Abhay Harpale offers thoughtful, confidential guidance to individuals and couples seeking greater clarity, healthier communication and a deeper emotional connection in their relationships.",
    text_2: "â€œMeaningful relationships grow when people feel heard, understood and emotionally connected. The right guidance can help create space for honest conversations, renewed trust and positive change.â€",
    cta_text: "Discover My Approach",
    cta_link: "/about"
  };

  const finalCtaContent = pageData?.sections?.final_cta?.content || {
    heading: "Ready to Build a Stronger Connection?",
    subheading: "Select a time that suits you best for a private, confidential relationship clarity consultation. Let's start the conversation.",
    cta_text: "Book Clarity Consultation",
    cta_link: "/book"
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleNextTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const handlePrevTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  // â”€â”€â”€ Animation helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.12 } },
  };

  // Reusable scroll-triggered fade-up section wrapper
  const SectionReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  // Animated stat counter with spring easing
  const AnimatedCounter = ({ value, label, index }: { value: string; label: string; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    // Extract numeric part and suffix
    const match = value.match(/^([\d,]+)(.*?)$/);
    const numStr = match ? match[1].replace(/,/g, '') : '0';
    const suffix = match ? match[2] : '';
    const numTarget = parseInt(numStr, 10) || 0;
    const [display, setDisplay] = React.useState(0);

    React.useEffect(() => {
      if (!inView) return;
      const prefersReducedMotion = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
      if (prefersReducedMotion) { setDisplay(numTarget); return; }
      let start: number | null = null;
      const duration = 1600 + index * 120;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(eased * numTarget));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [inView, numTarget, index]);

    const formatted = display >= 1000 ? display.toLocaleString() : display.toString();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`flex flex-col items-center text-center py-8 ${
          index < 3 ? 'lg:border-r border-[#40C0C0]/12' : ''
        } ${
          index % 2 === 0 ? 'border-r lg:border-r border-[#40C0C0]/12 lg:border-none' : ''
        }`}
      >
        <span className="stat-value text-[2.6rem] lg:text-[3.2rem] mb-1">
          {inView ? formatted : '0'}{suffix}
        </span>
        <span className="eyebrow-label" style={{ color: '#5F6C72', fontSize: '10px' }}>{label}</span>
      </motion.div>
    );
  };

  return (
    <div className="w-full relative" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <SEO
        fullTitle="Abhay Harpale | Relationship & Intimacy Guidance"
        description="Premium relationship and intimacy guidance for individuals and couples seeking deeper communication, trust and meaningful connection."
        canonical="/"
      />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO SECTION
          Layered visual composition & editorial typography.
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ paddingTop: '6rem', paddingBottom: '4rem', backgroundColor: 'var(--color-bg-primary)' }}
      >
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Typography — left 7 cols */}
          <motion.div
            className="lg:col-span-7 space-y-7 text-left py-12 lg:pr-8"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Editorial eyebrow */}
            <motion.span
              variants={fadeUp}
              className="eyebrow"
            >
              {heroContent.badge}
            </motion.span>

            {/* Main heading — refined scale */}
            <motion.h1
              ref={titleRef}
              variants={fadeUp}
              className="font-serif leading-[1.06] tracking-tight hero-title-clamp"
              style={{ color: '#166D74' }}
            >
              <span className="block">
                {heroContent.heading_main}
              </span>
              <span className="block mt-1 italic" style={{ color: '#40C0C0' }}>
                {heroContent.heading_highlight}
              </span>
            </motion.h1>

            {/* Editorial Sanskrit line */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="py-1.5 px-4 rounded-full border inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'rgba(184, 148, 58, 0.25)' }}>
                <span className="font-serif italic font-semibold text-[13.5px]" style={{ color: 'var(--color-accent-gold)', letterSpacing: '0.04em' }}>
                  The Art of Deeper Connection
                </span>
              </div>
            </motion.div>

            <motion.p
              ref={subtitleRef}
              variants={fadeUp}
              className="leading-[1.85] max-w-[500px] font-sans"
              style={{ fontSize: '16px', color: '#5F6C72' }}
            >
              {heroContent.subheading}
            </motion.p>

            {/* CTA buttons */}
            <motion.div ref={ctaRef} variants={fadeUp} className="hero-cta-container">
              <Button to={heroContent.cta_primary_link} variant="primary" showArrow={true}>
                {heroContent.cta_primary_text}
              </Button>
              <Button to={heroContent.cta_secondary_link} variant="outline">
                {heroContent.cta_secondary_text}
              </Button>
            </motion.div>

            {/* Trust indicator */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 pt-5"
              style={{ borderTop: '1px solid rgba(64,192,192,0.1)', maxWidth: '480px' }}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full"
                  style={{ backgroundColor: '#C9A646', opacity: 0.6 }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#C9A646' }} />
              </span>
              <span className="font-sans" style={{ fontSize: '12.5px', color: '#5F6C72', fontWeight: 500 }}>
                {heroContent.trust_indicator}
              </span>
            </motion.div>
          </motion.div>

          {/* Hero Portrait Visual Collage — right 5 cols */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-12 lg:py-0">
            <HeroImage />
          </div>

        </div>
      </section>

      <SectionDivider type="line" />

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — STATS STRIP
          Animated counters with spring easing.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="secondary"
        sectionMode="stats"
        className="py-16"
        style={{ borderTop: '1px solid rgba(201,166,70,0.12)', borderBottom: '1px solid rgba(201,166,70,0.12)' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-0 relative z-10">
          {statsContent.items.map((stat: { value: string; label: string }, i: number) => (
            <AnimatedCounter key={i} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — SERVICES
          Magazine-style grid layout. Asymmetrical focus card.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="primary"
        patternType="curves"
        sectionMode="services"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal className="mb-20 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-6 space-y-4">
                <span className="eyebrow">Consultation Paths</span>
                <h2 className="font-serif leading-tight">Supportive Programs</h2>
              </div>
              <div className="lg:col-span-6">
                <p className="font-sans leading-relaxed text-base lg:text-lg" style={{ color: '#5F6C72', maxWidth: '520px' }}>
                  Explore specialized guidance categories structured to support connection, clarify relationship paths, and rebuild intimacy.
                </p>
              </div>
            </div>
          </SectionReveal>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="h-72 bg-[#FFFFFF] rounded-[28px] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              {services.slice(0, 6).map((service: Service, idx: number) => {
                // Style the first card as a larger horizontal magazine featured card
                const isFeatured = idx === 0;
                return (
                  <motion.div
                    key={service.id}
                    variants={{
                      initial: { opacity: 0, y: 35 },
                      animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    whileHover={{ y: -8 }}
                    className={`service-card p-10 flex flex-col justify-between group md:col-span-1 ${isFeatured ? 'lg:col-span-2' : 'lg:col-span-1'}`}
                    style={{ 
                      minHeight: '360px',
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: '28px',
                      border: '1.5px solid rgba(64,192,192,0.08)',
                      boxShadow: '0 10px 40px rgba(22,109,116,0.03)'
                    }}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-serif italic font-medium"
                          style={{ fontSize: '3rem', color: '#166D74', opacity: 0.85, lineHeight: 1 }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="px-4 py-1.5 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider bg-[#FFFDF7] border border-[#40C0C0]/20" style={{ color: '#C9A646' }}>
                          {service.duration} mins
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl group-hover:text-[#40C0C0] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="font-sans text-sm leading-relaxed line-clamp-3" style={{ color: '#5F6C72' }}>
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#40C0C0]/10 flex items-center justify-between mt-8">
                      <span className="font-sans font-bold text-[15px]" style={{ color: '#166D74' }}>
                        {service.sale_price ? (
                          <span className="flex items-center gap-2">
                            <span className="line-through text-xs font-normal" style={{ color: '#88949B' }}>INR {service.price}</span>
                            <span>INR {service.sale_price}</span>
                          </span>
                        ) : `INR ${service.price}`}
                      </span>
                      <Link
                        href={`/services/${service.slug}`}
                        className="animated-link font-sans font-bold uppercase tracking-wider text-[11px]"
                        style={{ color: '#166D74' }}
                      >
                        Explore Program →
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </BackgroundWrapper>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — APPROACH
          Image-left editorial layout with offset overlapping panel.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="alternate"
        patternType="lotus"
        sectionMode="about"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Side — left 5 cols */}
          <SectionReveal className="lg:col-span-5 relative flex justify-center">
            {/* Elegant golden thin frame background decoration */}
            <div 
              className="absolute border border-[#C9A646] rounded-[28px] pointer-events-none"
              style={{
                width: '100%',
                height: '100%',
                transform: 'translate(-20px, 20px) rotate(-1.5deg)',
                opacity: 0.25,
                zIndex: 1,
              }}
            />
            
            <motion.div
              className="premium-image-frame relative z-10 w-full overflow-hidden rounded-[28px]"
              style={{ aspectRatio: '3/4', backgroundColor: 'var(--color-bg-card)', border: '1.5px solid rgba(64,192,192,0.12)' }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={connectionImage}
                alt="Guidance That Understands You"
                width={500}
                height={667}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Sleek bottom glass bar */}
              <div
                className="absolute bottom-0 inset-x-0 p-8 z-10 text-left"
                style={{
                  background: 'linear-gradient(to top, rgba(22,109,116,0.95) 0%, rgba(22,109,116,0.4) 70%, transparent 100%)',
                }}
              >
                <h4 className="font-serif text-2xl text-white mb-2">{aboutPreviewContent.eyebrow}</h4>
                <p className="font-sans text-xs leading-relaxed" style={{ color: '#FFFDF7', opacity: 0.9 }}>
                  Personalized and confidential guidance for meaningful relationships.
                </p>
              </div>
            </motion.div>
          </SectionReveal>

          {/* Text Content Side — right 7 cols */}
          <SectionReveal className="lg:col-span-7 space-y-8 lg:pl-10" delay={0.1}>
            <span className="eyebrow">{aboutPreviewContent.eyebrow}</span>
            <h2 className="font-serif leading-tight text-[#166D74]">{aboutPreviewContent.heading}</h2>
            
            <p className="font-sans text-base leading-relaxed text-justify" style={{ color: '#5F6C72' }}>
              {aboutPreviewContent.text_1}
            </p>

            <blockquote className="pull-quote py-1 my-4">
              {aboutPreviewContent.text_2}
            </blockquote>

            <div className="pt-4 text-left">
              <Button to={aboutPreviewContent.cta_link} variant="outline" showArrow={true}>
                {aboutPreviewContent.cta_text}
              </Button>
            </div>
          </SectionReveal>

        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — CONCERNS
          Asymmetrical layout with elegant vertical timeline accents.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="primary"
        patternType="waves"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal className="mb-20 text-center">
            <span className="eyebrow justify-center">Assistance Parameters</span>
            <h2 className="font-serif text-[#166D74]">Partnership Challenges</h2>
            <p className="font-sans text-sm mx-auto mt-4" style={{ color: '#5F6C72', maxWidth: '480px' }}>
              Identifying specific relationship bottlenecks helps target focus areas.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Vertical tabs menu — left 4 cols */}
            <SectionReveal className="lg:col-span-4" delay={0.05}>
              <div className="space-y-3">
                {concerns.map((concern: { id: number; title: string }) => {
                  const isActive = activeConcernTab === concern.id;
                  return (
                    <motion.button
                      key={concern.id}
                      onClick={() => setActiveConcernTab(concern.id)}
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.3 }}
                      className="w-full text-left py-4 px-6 rounded-2xl font-sans transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? 'var(--color-bg-card)' : 'transparent',
                        borderLeft: `3.5px solid ${isActive ? '#C9A646' : 'transparent'}`,
                        boxShadow: isActive ? '0 10px 30px rgba(22,109,116,0.03)' : 'none',
                        borderTop: isActive ? '1px solid rgba(64,192,192,0.12)' : 'none',
                        borderRight: isActive ? '1px solid rgba(64,192,192,0.12)' : 'none',
                        borderBottom: isActive ? '1px solid rgba(64,192,192,0.12)' : 'none',
                        color: isActive ? '#166D74' : '#5F6C72',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '15px',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{concern.title}</span>
                        {isActive && <span className="text-[10px]" style={{ color: '#C9A646' }}>●</span>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </SectionReveal>

            {/* Tab content panel — right 8 cols */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {activeConcernTab && concerns.length > 0 && (
                  <motion.div
                    key={activeConcernTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="p-10 lg:p-12 h-full flex flex-col justify-between"
                    style={{ 
                      minHeight: '360px',
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1.5px solid rgba(64,192,192,0.12)',
                      borderRadius: '28px',
                      boxShadow: '0 20px 50px rgba(22,109,116,0.04)'
                    }}
                  >
                    <div className="space-y-6 text-left">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: '#C9A646' }} />
                        <h3 className="font-serif text-3xl" style={{ color: '#166D74' }}>
                          {concerns.find((c: any) => c.id === activeConcernTab)?.title}
                        </h3>
                      </div>
                      <p className="font-sans text-base leading-relaxed" style={{ color: '#5F6C72' }}>
                        {concerns.find((c: any) => c.id === activeConcernTab)?.desc}
                      </p>
                    </div>

                    <div className="pt-8 mt-8 space-y-4 border-t border-[#40C0C0]/10 text-left">
                      <p className="eyebrow-label" style={{ color: '#C9A646', fontSize: '10px' }}>Recommended Program Path</p>
                      <div className="flex flex-wrap gap-4">
                        {services
                          .filter((s: Service) => concerns.find((c: any) => c.id === activeConcernTab)?.service_ids?.includes(s.id))
                          .map((s: Service) => (
                            <Link
                              key={s.id}
                              href={`/services/${s.slug}`}
                              className="animated-link font-sans font-bold uppercase tracking-wider text-[11px]"
                              style={{ color: '#166D74' }}
                            >
                              {s.title} →
                            </Link>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </BackgroundWrapper>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — BOOKING JOURNEY
          Asymmetrical wave timeline connecting staggered cards.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="alternate"
        patternType="diamond"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-24">
            <span className="eyebrow justify-center">The Blueprint</span>
            <h2 className="font-serif text-[#166D74]">Your Booking Journey</h2>
            <p className="font-sans text-sm mx-auto mt-4" style={{ color: '#5F6C72', maxWidth: '520px' }}>
              An elegant, fully secured booking procedure to initiate your private relationship consultation.
            </p>
          </SectionReveal>

          {/* Staggered process grid with vertical offsets */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 relative"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {/* Asymmetrical curvy connecting vector line */}
            <div className="hidden md:block absolute top-[60px] left-[5%] right-[5%] h-8 pointer-events-none opacity-20" aria-hidden="true">
              <svg width="100%" height="32" fill="none" stroke="#C9A646" strokeWidth="1.5" strokeDasharray="4 4" className="w-full">
                <path d="M 0 16 Q 150 -10, 300 16 T 600 16 T 900 16" />
              </svg>
            </div>

            {[
              { step: '01', title: 'Discover Program', desc: 'Select from our relationship guidance options.', offsetClass: 'md:translate-y-0' },
              { step: '02', title: 'Choose Slot', desc: 'Select date & available timing from scheduler.', offsetClass: 'md:translate-y-8' },
              { step: '03', title: 'Information', desc: 'Enter secure contact details and core concern.', offsetClass: 'md:translate-y-0' },
              { step: '04', title: 'Payment', desc: 'Process fees securely via the Razorpay gateway.', offsetClass: 'md:translate-y-8' },
              { step: '05', title: 'Confirmation', desc: 'Instant email containing session guidelines.', offsetClass: 'md:translate-y-0' },
            ].map((j, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                }}
                className={`flex flex-col items-center text-center space-y-4 relative z-10 ${j.offsetClass}`}
              >
                <motion.div
                  whileHover={{ scale: 1.06, rotate: 3 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center relative bg-[var(--color-bg-card)] border-2 border-[#40C0C0]/30 shadow-lg"
                >
                  <span className="font-serif text-lg" style={{ color: '#C9A646', fontWeight: 500 }}>{j.step}</span>
                </motion.div>
                
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#166D74', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {j.title}
                </h4>
                
                <p className="font-sans" style={{ fontSize: '12.5px', color: '#5F6C72', lineHeight: 1.6, maxWidth: '180px' }}>
                  {j.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — TESTIMONIALS
          Premium radial watercolor backdrop + gold corners.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="primary"
        patternType="concentric"
        sectionMode="testimonials"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-16">
            <span className="eyebrow justify-center">Client Voices</span>
            <h2 className="font-serif text-[#166D74]">Relational Transformation Stories</h2>
          </SectionReveal>

          {testimonialsLoading ? (
            <div className="h-64 bg-[#FFFFFF] rounded-[28px] animate-pulse" />
          ) : (
            testimonials.length > 0 && (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonialIndex}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[28px] p-10 md:p-16 text-center relative border"
                    style={{ 
                      backgroundColor: 'var(--color-bg-card)',
                      borderColor: 'rgba(64,192,192,0.12)',
                      boxShadow: '0 20px 50px rgba(22,109,116,0.04)',
                    }}
                  >
                    {/* Decorative gold mandala vectors in the top-left and bottom-right corners */}
                    <div className="absolute top-6 left-6 w-12 h-12 opacity-20 text-[#C9A646] pointer-events-none">
                      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="0" cy="0" r="10" /><circle cx="0" cy="0" r="20" /><circle cx="0" cy="0" r="30" />
                        <path d="M0 0 L30 30 M0 0 L40 10 M0 0 L10 40" />
                      </svg>
                    </div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 opacity-20 text-[#C9A646] pointer-events-none" style={{ transform: 'rotate(180deg)' }}>
                      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="0" cy="0" r="10" /><circle cx="0" cy="0" r="20" /><circle cx="0" cy="0" r="30" />
                        <path d="M0 0 L30 30 M0 0 L40 10 M0 0 L10 40" />
                      </svg>
                    </div>

                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[activeTestimonialIndex].rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" style={{ color: '#C9A646', fill: '#C9A646' }} />
                      ))}
                    </div>

                    <p
                      className="font-serif italic mx-auto mb-8 text-lg md:text-xl leading-relaxed"
                      style={{ color: '#166D74', maxWidth: '640px' }}
                    >
                      &ldquo;{testimonials[activeTestimonialIndex].testimonial_text}&rdquo;
                    </p>

                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#166D74', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {testimonials[activeTestimonialIndex].client_name}
                      </h4>
                      <span className="eyebrow-label mt-1.5 block text-xs" style={{ color: '#C9A646' }}>
                        {testimonials[activeTestimonialIndex].service_category}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-4 mt-8">
                  <motion.button
                    onClick={handlePrevTestimonial}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1px solid rgba(64,192,192,0.25)', 
                      color: '#166D74', 
                      boxShadow: '0 4px 12px rgba(64,192,192,0.06)' 
                    }}
                    aria-label="Previous testimonial"
                  >
                    ←
                  </motion.button>
                  <motion.button
                    onClick={handleNextTestimonial}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1px solid rgba(64,192,192,0.25)', 
                      color: '#166D74', 
                      boxShadow: '0 4px 12px rgba(64,192,192,0.06)' 
                    }}
                    aria-label="Next testimonial"
                  >
                    →
                  </motion.button>
                </div>
              </div>
            )
          )}
        </div>
      </BackgroundWrapper>

      {/* ══════════════════════════════════════════════════════
          SECTION 8 — VIDEOS
          Featured video card + vertical list of secondary videos.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="primary"
        patternType="mandala"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          <SectionReveal className="text-center">
            <span className="eyebrow justify-center">Media &amp; Insights</span>
            <h2 className="font-serif text-[#166D74]">Featured Lectures &amp; Discussions</h2>
            <p className="font-sans text-sm mx-auto mt-4" style={{ color: '#5F6C72', maxWidth: '520px' }}>
              Watch selected discussions regarding relationship patterns, connection bids, and communication habits.
            </p>
          </SectionReveal>

          {videosLoading ? (
            <div className="h-96 bg-[var(--color-bg-card)] rounded-[28px] animate-pulse" />
          ) : (
            videos.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Featured Video (Large) — Left 7 cols */}
                <SectionReveal className="lg:col-span-7" delay={0}>
                  <motion.div
                    className="custom-card group h-full flex flex-col overflow-hidden cursor-pointer"
                    onClick={() => setActiveVideoUrl(getYoutubeEmbedUrl(videos[0].video_url))}
                    whileHover={{ y: -6 }}
                    style={{ 
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: '28px',
                      border: '1.5px solid rgba(64,192,192,0.12)',
                      boxShadow: '0 15px 45px rgba(22,109,116,0.03)'
                    }}
                  >
                    <div className="premium-image-frame aspect-video relative flex items-center justify-center rounded-[24px] overflow-hidden">
                      <img
                        src={getThumbnailUrl(videos[0])}
                        alt={videos[0].title}
                        width={640}
                        height={360}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = videoSessionImage;
                        }}
                      />
                      {/* Play button overlay */}
                      <motion.div
                        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.45)' }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Play className="w-6 h-6" style={{ fill: '#FFFFFF', color: '#FFFFFF' }} />
                      </motion.div>
                      <div className="absolute inset-0 bg-black/10" />
                      <div
                        className="absolute bottom-4 right-4 font-mono text-[10px] px-3 py-1 rounded-full z-20 font-bold tracking-wider"
                        style={{ background: 'rgba(22,109,116,0.85)', color: '#FFFDF7' }}
                      >
                        {videos[0].duration}
                      </div>
                    </div>

                    <div className="p-8 space-y-4 flex-1 text-left">
                      <span className="eyebrow-label" style={{ color: '#C9A646' }}>{videos[0].category}</span>
                      <h3 className="font-serif text-2xl group-hover:text-[#40C0C0] transition-colors leading-snug text-[#166D74]">
                        {videos[0].title}
                      </h3>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
                        {videos[0].description}
                      </p>
                    </div>
                  </motion.div>
                </SectionReveal>

                {/* Secondary list of videos — Right 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                  {videos.slice(1, 4).map((video, idx) => (
                    <SectionReveal key={video.id} delay={0.06 * (idx + 1)} className="flex-1">
                      <motion.div
                        className="custom-card p-5 flex gap-5 group items-center h-full cursor-pointer"
                        onClick={() => setActiveVideoUrl(getYoutubeEmbedUrl(video.video_url))}
                        whileHover={{ y: -4 }}
                        style={{ 
                          backgroundColor: 'var(--color-bg-card)',
                          borderRadius: '20px',
                          border: '1.5px solid rgba(64,192,192,0.12)',
                          boxShadow: '0 10px 30px rgba(22,109,116,0.02)'
                        }}
                      >
                        <div className="premium-image-frame w-28 shrink-0 relative flex items-center justify-center aspect-[16/10] rounded-[14px] overflow-hidden">
                          <img 
                            src={getThumbnailUrl(video)} 
                            alt={video.title} 
                            width={112}
                            height={70}
                            className="absolute inset-0 w-full h-full object-cover" 
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = videoSessionImage;
                            }}
                          />
                          <motion.div className="relative z-10" whileHover={{ scale: 1.15 }}>
                            <Play className="w-4 h-4" style={{ fill: '#FFFFFF', color: '#FFFFFF' }} />
                          </motion.div>
                          <div className="absolute inset-0 bg-black/15" />
                        </div>
                        <div className="flex flex-col justify-center space-y-1.5 text-left">
                          <span className="eyebrow-label" style={{ color: '#40C0C0', fontSize: '10px' }}>
                            {video.category} · {video.duration}
                          </span>
                          <h4 className="font-serif group-hover:text-[#40C0C0] transition-colors leading-snug text-base text-[#166D74]">
                            {video.title}
                          </h4>
                        </div>
                      </motion.div>
                    </SectionReveal>
                  ))}
                </div>

              </div>
            )
          )}
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* ══════════════════════════════════════════════════════
          SECTION 9 — BLOG INSIGHTS
          Alternating visual layout grid.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="alternate"
        patternType="geometry"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto space-y-14 relative z-10">
          <SectionReveal>
            <div className="flex justify-between items-end border-b border-[#40C0C0]/15 pb-6">
              <div className="space-y-3 text-left">
                <span className="eyebrow">Insights</span>
                <h2 className="font-serif leading-tight text-[#166D74]">Relationship Advice &amp; Insights</h2>
              </div>
              <Link href="/blog" className="animated-link font-sans font-bold uppercase tracking-wider text-[11px]" style={{ color: '#166D74' }}>
                EXPLORE ALL INSIGHTS →
              </Link>
            </div>
          </SectionReveal>

          {blogsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-28 bg-[#FFFFFF] rounded-[28px] animate-pulse" />)}
            </div>
          ) : (
            blogs.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Featured Blog Card — Left 7 cols */}
                <SectionReveal className="lg:col-span-7" delay={0}>
                  <motion.div
                    className="blog-card group overflow-hidden h-full flex flex-col"
                    whileHover={{ y: -6 }}
                    style={{ 
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: '28px',
                      border: '1.5px solid rgba(64,192,192,0.12)',
                      boxShadow: '0 15px 45px rgba(22,109,116,0.03)'
                    }}
                  >
                    <div
                      className="premium-image-frame aspect-video relative flex items-center justify-center overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(64,192,192,0.06), rgba(201,166,70,0.05))' }}
                    >
                      <span className="font-serif text-lg uppercase tracking-wider opacity-60" style={{ color: '#166D74' }}>
                        Featured Publication
                      </span>
                    </div>
                    <div className="p-8 flex-1 space-y-4 text-left">
                      <span className="eyebrow-label" style={{ color: '#C9A646' }}>
                        {blogs[0].category_name} · {blogs[0].reading_time}
                      </span>
                      <h3 className="font-serif text-3xl group-hover:text-[#40C0C0] transition-colors duration-300 text-[#166D74]">
                        <Link href={`/blog/${blogs[0].slug}`}>{blogs[0].title}</Link>
                      </h3>
                      <p className="font-sans text-sm leading-relaxed line-clamp-3" style={{ color: '#5F6C72' }}>
                        {blogs[0].excerpt}
                      </p>
                    </div>
                    
                    <div className="px-8 pb-8 flex justify-between items-center mt-6 pt-6" style={{ borderTop: '1px solid rgba(64,192,192,0.1)' }}>
                      <span className="font-sans" style={{ fontSize: '12.5px', color: '#88949B', fontWeight: 500 }}>
                        By {blogs[0].author}
                      </span>
                      <Link href={`/blog/${blogs[0].slug}`} className="animated-link font-sans font-bold uppercase tracking-wider text-[11px]" style={{ color: '#166D74' }}>
                        Read Article →
                      </Link>
                    </div>
                  </motion.div>
                </SectionReveal>

                {/* Secondary list of blogs — Right 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                  {blogs.slice(1, 4).map((blog: Blog, idx: number) => (
                    <SectionReveal key={blog.id} delay={0.06 * (idx + 1)} className="flex-1">
                      <motion.div
                        className="blog-card p-6 flex flex-col justify-between h-full"
                        whileHover={{ y: -4 }}
                        style={{ 
                          backgroundColor: 'var(--color-bg-card)',
                          borderRadius: '20px',
                          border: '1.5px solid rgba(64,192,192,0.12)',
                          boxShadow: '0 10px 30px rgba(22,109,116,0.02)'
                        }}
                      >
                        <div className="space-y-2 text-left">
                          <span className="eyebrow-label" style={{ color: '#C9A646' }}>
                            {blog.category_name} · {blog.reading_time}
                          </span>
                          <h4 className="font-serif hover:text-[#40C0C0] transition-colors leading-snug text-lg text-[#166D74]">
                            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                          </h4>
                          <p className="font-sans text-sm leading-relaxed line-clamp-2" style={{ color: '#5F6C72' }}>
                            {blog.excerpt}
                          </p>
                        </div>
                        
                        <div className="pt-4 flex justify-between items-center mt-6" style={{ borderTop: '1px solid rgba(64,192,192,0.1)' }}>
                          <span style={{ fontSize: '12px', color: '#88949B', fontWeight: 500 }}>{blog.publish_date.split(' ')[0]}</span>
                          <Link href={`/blog/${blog.slug}`} className="animated-link font-sans font-bold uppercase tracking-wider text-[11px]" style={{ color: '#166D74' }}>
                            Read →
                          </Link>
                        </div>
                      </motion.div>
                    </SectionReveal>
                  ))}
                </div>

              </div>
            )
          )}
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* ══════════════════════════════════════════════════════
          SECTION 10 — FAQ Accordion
          Delicate dividers + elegant gold icons.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="primary"
        patternType="curves"
        sectionMode="faq"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-3xl mx-auto space-y-16 relative z-10">
          <SectionReveal className="text-center">
            <span className="eyebrow justify-center">COMMON QUESTIONS</span>
            <h2 className="font-serif leading-tight text-[#166D74]">Frequently Asked Questions</h2>
          </SectionReveal>

          {faqsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-[var(--color-bg-card)] rounded-[28px] animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq: Faq, index: number) => {
                const isOpen = activeFaq === index;
                return (
                  <SectionReveal key={faq.id} delay={index * 0.05}>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        background: 'var(--color-bg-card)',
                        borderRadius: '24px',
                        border: `1.5px solid ${isOpen ? 'rgba(64,192,192,0.35)' : 'rgba(64,192,192,0.1)'}`,
                        boxShadow: isOpen ? '0 15px 35px rgba(22,109,116,0.04)' : 'none',
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left py-6 px-8 flex justify-between items-center focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <span className="font-sans font-semibold leading-snug text-[15px]" style={{ color: '#166D74' }}>
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A646' }} />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <p
                              className="font-sans leading-relaxed px-8 pb-6 pt-0 text-left"
                              style={{ fontSize: '15px', color: '#5F6C72' }}
                            >
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          )}
        </div>
      </BackgroundWrapper>

      <SectionDivider type="fade" />

      {/* ══════════════════════════════════════════════════════
          SECTION 11 — FINAL CTA
          Ambient glow + Sanskrit closing statement.
      ══════════════════════════════════════════════════════ */}
      <BackgroundWrapper
        variant="secondary"
        patternType="sacred"
        sectionMode="contact"
        className="py-32 px-6 md:px-12"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <SectionReveal>
            {/* Decorative top element */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(201,166,70,0.5))' }} />
              <span className="sanskrit-text" style={{ fontSize: '18px' }}>संबन्धात् सम्पूर्णता</span>
              <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(201,166,70,0.5))' }} />
            </div>
            <p className="sanskrit-caption mb-8" style={{ letterSpacing: '0.12em' }}>Wholeness through relationships.</p>

            <h2 className="font-serif" style={{ color: '#166D74' }}>{finalCtaContent.heading}</h2>
            <p className="font-sans mx-auto mt-6 leading-relaxed" style={{ fontSize: '16px', color: '#5F6C72', maxWidth: '480px' }}>
              {finalCtaContent.subheading}
            </p>
            <div className="pt-8">
              <Button to={finalCtaContent.cta_link} variant="primary" showArrow={true}>
                {finalCtaContent.cta_text}
              </Button>
            </div>

            {/* Ambient bottom glow */}
            <div
              className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(201,166,70,0.04), transparent)',
              }}
            />
          </SectionReveal>
        </div>
      </BackgroundWrapper>
    </div>
  );
}

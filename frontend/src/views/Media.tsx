'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { demoVideos } from '../data/demoVideos';
import { Video } from '../types';
import BackgroundWrapper from '../components/BackgroundWrapper';

const SectionReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Media() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    api.get<{ videos: Video[] }>('/videos/list.php')
      .then(data => {
        if (data && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          setVideos(demoVideos);
        }
      })
      .catch(err => {
        console.error("Media page failed to load, using fallback:", err);
        setVideos(demoVideos);
      })
      .finally(() => setLoading(false));
  }, []);

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
    return '/src/assets/video_session.png';
  };

  const CardSkeleton = () => (
    <div className="editorial-card p-0 animate-pulse flex flex-col justify-between overflow-hidden bg-white">
      <div className="aspect-video bg-[#40C0C0]/10 w-full"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-[#40C0C0]/10 rounded-full w-1/4"></div>
        <div className="h-6 bg-[#40C0C0]/10 rounded-full w-3/4"></div>
        <div className="h-10 bg-[#40C0C0]/10 rounded-full w-full"></div>
      </div>
    </div>
  );

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="mesh"
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
        
        {/* Header Block */}
        <SectionReveal className="text-center max-w-xl mx-auto space-y-4">
          <span 
            className="inline-block px-4 py-1.5 eyebrow-label uppercase rounded-full"
            style={{ backgroundColor: '#FFFFFF', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
          >
            Video Gallery
          </span>
          <h1 className="font-serif text-[#166D74]">Lectures &amp; Discussions</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            Thoughtful discussions and video insights addressing communication patterns, intimate closeness, and trust recovery in partnerships.
          </p>
        </SectionReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {videos.map((video, idx) => (
              <SectionReveal key={video.id} delay={idx * 0.08}>
                <motion.div 
                  className="service-card flex flex-col justify-between group h-full"
                  whileHover={{ y: -6 }}
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div 
                    className="aspect-video bg-white relative overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() => setActiveVideo(video)}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md z-20"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(64,192,192,0.2)' }}
                    >
                      <Play className="w-5 h-5 ml-0.5" style={{ color: '#166D74' }} />
                    </div>
                    <div className="absolute inset-0 bg-[#176F78]/5 group-hover:bg-[#176F78]/15 transition-all z-10"></div>
                    <img 
                      src={getThumbnailUrl(video)} 
                      alt={video.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/video_session.png';
                      }}
                    />
                  </div>
                  <div className="p-6 space-y-2 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="eyebrow-label uppercase block mb-1 text-[11px] font-bold" style={{ color: '#C9A646' }}>
                        {video.category} &bull; {video.duration}
                      </span>
                      <h3 className="font-serif text-lg leading-snug group-hover:text-[#40C0C0] transition-colors text-[#166D74]">
                        {video.title}
                      </h3>
                      <p className="font-sans text-[14px] leading-relaxed line-clamp-3" style={{ color: '#5F6C72' }}>
                        {video.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        )}

      </div>

      {/* Accessible Video Overlay Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-[#166D74]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="w-full max-w-4xl relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              border: '1.5px solid rgba(64,192,192,0.2)',
            }}
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 bg-white hover:bg-[#FCF8F1] text-[#166D74] hover:text-[#40C0C0] flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 shadow-sm focus:outline-none z-50 transition-all"
              aria-label="Close video modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-video">
              <iframe
                src={getYoutubeEmbedUrl(activeVideo.video_url)}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </BackgroundWrapper>
  );
}

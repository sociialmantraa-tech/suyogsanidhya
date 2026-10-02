import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { demoBlogs } from '../data/demoBlogs';
import { Blog } from '../types';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';

type DetailedBlog = Blog & { related?: Blog[] };

const SectionReveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<DetailedBlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get<{ blog: DetailedBlog }>(`/blogs/detail.php?slug=${slug}`)
      .then(data => {
        if (data && data.blog) {
          setBlog(data.blog);
        } else {
          const found = demoBlogs.find(b => b.slug === slug);
          if (found) {
            // Find related posts in fallback
            const related = demoBlogs.filter(b => b.id !== found.id).slice(0, 3);
            setBlog({ ...found, related });
          } else {
            setError("Article publication not found.");
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load blog details, trying fallback:", err);
        const found = demoBlogs.find(b => b.slug === slug);
        if (found) {
          const related = demoBlogs.filter(b => b.id !== found.id).slice(0, 3);
          setBlog({ ...found, related });
        } else {
          setError("Failed to load this publication.");
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <BackgroundWrapper variant="primary" className="min-h-screen flex items-center justify-center pt-20">
        <p className="font-sans text-sm" style={{ color: '#5F6C72' }}>Retrieving publication text...</p>
      </BackgroundWrapper>
    );
  }

  if (error || !blog) {
    return (
      <BackgroundWrapper variant="primary" className="min-h-screen flex flex-col items-center justify-center pt-20 space-y-4">
        <h2 className="font-serif text-2xl text-[#166D74]">{error || "Article Not Found"}</h2>
        <Button to="/blog" variant="primary">Back to Publications</Button>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="waves"
      className="pt-32 pb-20"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12 relative z-10">
        
        {/* Navigation back */}
        <Link 
          to="/blog" 
          className="animated-link font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
          style={{ color: '#166D74' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Publications
        </Link>

        {/* Title block */}
        <div className="space-y-4 text-left pb-8" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
          <span className="eyebrow-label uppercase" style={{ color: '#C9A646' }}>
            {blog.category_name}
          </span>
          <h1 className="font-serif leading-tight text-[#166D74]">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-sans pt-2" style={{ color: '#88949B' }}>
            <span className="flex items-center gap-1 text-[#166D74]">
              <User className="w-4 h-4" style={{ color: '#40C0C0' }} /> By {blog.author}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" style={{ color: '#40C0C0' }} /> {blog.publish_date.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Rich article text */}
        <SectionReveal>
          <article 
            className="font-sans text-sm leading-relaxed space-y-6 markdown-content text-left"
            style={{ color: '#5F6C72' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </SectionReveal>

        {/* Related Posts */}
        {blog.related && blog.related.length > 0 && (
          <SectionReveal className="pt-16 mt-16 text-left" style={{ borderTop: '1px solid rgba(64,192,192,0.12)' }}>
            <h3 className="font-serif text-2xl mb-8 text-[#166D74]">Related Publications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blog.related.map((item: Blog, idx: number) => (
                <SectionReveal key={item.id} delay={idx * 0.08}>
                  <motion.div 
                    className="blog-card p-6 flex flex-col justify-between group h-full"
                    whileHover={{ y: -4 }}
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="space-y-4">
                      <span className="eyebrow-label uppercase" style={{ color: '#C9A646' }}>{item.category_name}</span>
                      <h4 className="font-serif text-base group-hover:text-[#40C0C0] transition-colors text-[#166D74]">
                        <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                      </h4>
                    </div>
                    <Link 
                      to={`/blog/${item.slug}`} 
                      className="animated-link font-sans text-xs font-bold block pt-6 mt-6"
                      style={{ color: '#166D74', borderTop: '1px solid rgba(64,192,192,0.12)' }}
                    >
                      Read Article &rarr;
                    </Link>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          </SectionReveal>
        )}

      </div>
    </BackgroundWrapper>
  );
}

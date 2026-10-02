import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { User } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { demoBlogs } from '../data/demoBlogs';
import type { Blog as BlogType } from '../types';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';
import SEO from '../components/SEO';

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

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{ current_page: number; total_pages: number }>({ current_page: 1, total_pages: 1 });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch parameters from URL query
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    const endpoint = `/blogs/list.php?page=${page}&category=${category}`;
    api.get<{ blogs: BlogType[]; categories: any[]; pagination: any }>(endpoint)
      .then(data => {
        if (data && data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
          setCategories(data.categories || []);
          setPagination(data.pagination || { current_page: 1, total_pages: 1 });
        } else {
          loadFallbacks();
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Blog Index loading failed, using fallback:", err);
        loadFallbacks();
        setLoading(false);
      });
  }, [category, page]);

  const loadFallbacks = () => {
    let filtered = demoBlogs;
    if (category) {
      filtered = demoBlogs.filter(b => b.category_name?.toLowerCase().includes(category) || b.slug.includes(category));
    }
    setBlogs(filtered);
    setCategories([
      { id: 1, name: "Relationship Communication", slug: "communication" },
      { id: 2, name: "Intimacy & Closeness", slug: "intimacy" }
    ]);
    setPagination({ current_page: 1, total_pages: 1 });
  };

  const handleCategorySelect = (slug: string) => {
    setSearchParams(slug ? { category: slug, page: '1' } : { page: '1' });
  };

  const handlePageSelect = (pageNum: number) => {
    const params: Record<string, string> = { page: pageNum.toString() };
    if (category) params.category = category;
    setSearchParams(params);
  };

  const CardSkeleton = () => (
    <div className="editorial-card p-8 animate-pulse space-y-6 bg-white">
      <div className="h-4 bg-[#40C0C0]/10 rounded-full w-1/4"></div>
      <div className="h-8 bg-[#40C0C0]/10 rounded-full w-3/4"></div>
      <div className="h-16 bg-[#40C0C0]/10 rounded-full w-full"></div>
      <div className="h-6 bg-[#40C0C0]/10 rounded-full w-1/2"></div>
    </div>
  );

  return (
    <>
      <SEO
        title="Insights & Articles"
        description="Explore Abhay Harpale's articles on relationship communication, intimacy, trust and emotional connection for individuals and couples."
        canonical="/blog"
      />
      <BackgroundWrapper
        variant="primary"
        patternType="waves"
        className="pt-32 pb-20"
      >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
        
        {/* Header Block */}
        <SectionReveal className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold animate-pulse" style={{ color: '#C9A646' }}>Publications</span>
          <h1 className="font-serif text-[#166D74]">Relationship Guidance &amp; Insights</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            Thoughtful entries exploring communication patterns, intimacy building, conflict resolution, and trust recovery in partnerships.
          </p>
        </SectionReveal>

        {/* Category Filter Tabs (Frosted glass capsules) */}
        <SectionReveal className="flex flex-wrap justify-center gap-3 border-b pb-8" style={{ borderColor: 'rgba(64,192,192,0.15)' }}>
          <button
            onClick={() => handleCategorySelect('')}
            className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold font-sans border transition-all duration-300 shadow-sm"
            style={category === '' ? {
              backgroundColor: '#166D74',
              borderColor: '#166D74',
              color: '#FFFFFF'
            } : {
              borderColor: 'rgba(64,192,192,0.2)',
              color: '#5F6C72',
              backgroundColor: '#FFFFFF'
            }}
          >
            All Publications
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold font-sans border transition-all duration-300 shadow-sm"
              style={category === cat.slug ? {
                backgroundColor: '#166D74',
                borderColor: '#166D74',
                color: '#FFFFFF'
              } : {
                borderColor: 'rgba(64,192,192,0.2)',
                color: '#5F6C72',
                backgroundColor: '#FFFFFF'
              }}
            >
              {cat.name}
            </button>
          ))}
        </SectionReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : (
          <div className="space-y-16 text-left">
            
            {/* Featured Post */}
            {blogs.length > 0 && page === 1 && (
              <SectionReveal>
                <div 
                  className="blog-card p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div 
                    className="lg:col-span-6 aspect-video flex items-center justify-center text-xs font-sans rounded-[20px] overflow-hidden relative shadow-md"
                    style={{ background: 'linear-gradient(135deg, rgba(64,192,192,0.08), rgba(201,166,70,0.06))' }}
                  >
                    {blogs[0].featured_image ? (
                      <img src={blogs[0].featured_image} alt={blogs[0].title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif text-lg opacity-60 text-[#166D74]">Featured Publication</span>
                    )}
                  </div>
                  <div className="lg:col-span-6 space-y-6">
                    <span className="eyebrow-label uppercase" style={{ color: '#C9A646' }}>{blogs[0].category_name}</span>
                    <h2 className="font-serif text-3xl leading-[1.25] hover:text-[#40C0C0] transition-colors text-[#166D74]">
                      <Link to={`/blog/${blogs[0].slug}`}>{blogs[0].title}</Link>
                    </h2>
                    <p className="font-sans text-[15px] font-normal leading-[1.65]" style={{ color: '#5F6C72' }}>
                      {blogs[0].excerpt}
                    </p>
                    <div 
                      className="pt-4 flex justify-between items-center text-[13px]"
                      style={{ color: '#88949B', borderTop: '1px solid rgba(64,192,192,0.12)' }}
                    >
                      <span className="flex items-center gap-1.5 font-medium text-[#166D74]">
                        <User className="w-4 h-4" style={{ color: '#40C0C0' }} /> By {blogs[0].author}
                      </span>
                      <span className="font-medium">{blogs[0].publish_date.split(' ')[0]}</span>
                    </div>
                    <Button to={`/blog/${blogs[0].slug}`} variant="primary" showArrow={true}>
                      Read Article
                    </Button>
                  </div>
                </div>
              </SectionReveal>
            )}

            {/* Standard Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(page === 1 ? blogs.slice(1) : blogs).map((blog: BlogType, idx: number) => (
                <SectionReveal key={blog.id} delay={idx * 0.06}>
                  <motion.div 
                    className="blog-card p-8 flex flex-col justify-between group h-full"
                    whileHover={{ y: -6 }}
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="space-y-6">
                      <span className="eyebrow-label uppercase block" style={{ color: '#C9A646' }}>
                        {blog.category_name}
                      </span>
                      <h3 className="font-serif text-xl group-hover:text-[#40C0C0] transition-colors leading-[1.25] text-[#166D74]">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>
                      <p className="font-sans text-[15px] font-normal leading-[1.65] line-clamp-3" style={{ color: '#5F6C72' }}>
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 mt-8 space-y-4" style={{ borderTop: '1px solid rgba(64,192,192,0.12)' }}>
                      <div className="flex justify-between items-center text-[13px] text-[#88949B]">
                        <span className="font-medium text-[#166D74]">By {blog.author}</span>
                        <span className="font-medium">{blog.publish_date.split(' ')[0]}</span>
                      </div>
                      <Link 
                        to={`/blog/${blog.slug}`} 
                        className="animated-link font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-1"
                        style={{ color: '#166D74' }}
                      >
                        Read Article &rarr;
                      </Link>
                    </div>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <SectionReveal className="flex justify-center space-x-2 pt-8 border-t" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
                {[...Array(pagination.total_pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageSelect(i + 1)}
                    className="w-10 h-10 rounded-full border text-xs font-bold transition-all duration-300 shadow-sm"
                    style={pagination.current_page === i + 1 ? {
                      backgroundColor: '#166D74',
                      borderColor: '#166D74',
                      color: '#FFFFFF'
                    } : {
                      borderColor: 'rgba(64,192,192,0.2)',
                      color: '#5F6C72',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </SectionReveal>
            )}

          </div>
        )}

      </div>
    </BackgroundWrapper>
    </>
  );
}

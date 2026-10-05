'use client';

import { useEffect } from 'react';

interface SEOProps {
  /** Page-specific title. Will be appended with " | Abhay Harpale" */
  title?: string;
  /** Page-specific meta description */
  description?: string;
  /** Canonical URL for this page */
  canonical?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Override the full title (without appending brand name) */
  fullTitle?: string;
}

const BRAND = 'Abhay Harpale';
const DEFAULT_DESCRIPTION = 'Premium relationship and intimacy guidance for individuals and couples seeking deeper communication, trust and meaningful connection.';
const DEFAULT_OG_IMAGE = 'https://abhayharpale.com/og-image.jpg';
const BASE_URL = 'https://abhayharpale.com';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  fullTitle,
}: SEOProps) {
  const computedTitle = fullTitle
    ? fullTitle
    : title
      ? `${title} | ${BRAND}`
      : `${BRAND} | Relationship & Intimacy Guidance`;

  useEffect(() => {
    // Browser tab title
    document.title = computedTitle;

    // Helper: upsert a <meta> tag by attribute selector
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Primary description
    setMeta('meta[name="description"]', 'content', description);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', computedTitle);
    setMeta('meta[property="og:title"]', 'property', 'og:title');
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:description"]', 'property', 'og:description');
    if (canonical) {
      setMeta('meta[property="og:url"]', 'content', `${BASE_URL}${canonical}`);
      setMeta('meta[property="og:url"]', 'property', 'og:url');
    }
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:image"]', 'property', 'og:image');

    // Twitter Card
    setMeta('meta[name="twitter:title"]', 'content', computedTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);

    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = `${BASE_URL}${canonical}`;
    }

    // Cleanup: reset to default on unmount
    return () => {
      document.title = `${BRAND} | Relationship & Intimacy Guidance`;
    };
  }, [computedTitle, description, canonical, ogImage]);

  return null; // No DOM output — side-effects only
}

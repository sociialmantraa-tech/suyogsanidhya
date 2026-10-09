export interface Service {
  id: number;
  category_id: number;
  category_name: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  image: string;
  icon: string;
  duration: number;
  price: number | null;
  sale_price: number | null;
  price_text?: string;
  display_order: number;
  status: string;
  seo_title: string;
  seo_description: string;
  concerns?: { title: string; description?: string }[] | any[];
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_initials: string;
  service_category: string;
  rating: number;
  testimonial_text: string;
  created_at?: string;
  display_order?: number;
  status?: string;
}

export interface Program {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  duration: number;
  price: number | null;
  salePrice: number | null;
  priceText?: string;
  category: string;
  active: boolean;
}

export interface SiteSettings {
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  business_hours: string;
  social_linkedin: string;
  social_twitter: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: number;
  category_name: string;
  author: string;
  publish_date: string;
  reading_time: string;
  status: string;
  is_featured: number;
  seo_title?: string;
  seo_description?: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  status: string;
}

export interface Video {
  id: number;
  title: string;
  video_url: string;
  duration: string;
  category: string;
  description: string;
  thumbnail_url?: string;
  display_order?: number;
  status?: string;
}

export interface PublicDataContextType {
  services: Service[];
  programs: Program[];
  siteSettings: SiteSettings;
  loading: boolean;
  error: string | null;
}

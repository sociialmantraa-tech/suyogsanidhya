import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';
import { demoServices } from '../data/demoServices';
import { demoConsultationPrograms } from '../data/demoConsultationPrograms';
import { Service, Program, SiteSettings, PublicDataContextType } from '../types';

const PublicDataContext = createContext<PublicDataContextType | null>(null);

const fallbackSettings: SiteSettings = {
  contact_email: 'contact@abhayharpale.com',
  contact_phone: '+91 98206 19636',
  contact_whatsapp: '+91 98206 19636',
  contact_address: 'Online Sessions Only',
  business_hours: 'By Appointment Only',
  social_linkedin: '#',
  social_twitter: '#',
  social_youtube: '#'
};

interface ProviderProps {
  children: React.ReactNode;
}

export function PublicDataProvider({ children }: ProviderProps): React.ReactNode {
  const [services, setServices] = useState<Service[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(fallbackSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPublicData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch home sections details to get contact/social coordinates
        const homeData = await api.get<any>('/pages/detail.php?slug=home');
        
        // Fetch services database listing
        const servicesData = await api.get<any>('/services/list.php');

        if (!active) return;

        // Process Settings
        if (homeData && homeData.settings) {
          // Filter out fake physical address placeholders in production
          const merged = { ...fallbackSettings, ...homeData.settings };
          if (merged.contact_address && (merged.contact_address.includes('Rostov') || merged.contact_address.includes('Studio 402'))) {
            merged.contact_address = 'Online Sessions Only';
          }
          if (merged.business_hours && merged.business_hours.includes('9:00 AM')) {
            merged.business_hours = 'By Appointment Only';
          }
          setSiteSettings(merged);
        } else {
          setSiteSettings(fallbackSettings);
        }

        // Process Services and programs
        if (servicesData && servicesData.services && servicesData.services.length > 0) {
          setServices(servicesData.services);
          
          // Map to booking model format
          const mappedPrograms: Program[] = servicesData.services.map((s: Service) => ({
            id: s.id,
            title: s.title,
            slug: s.slug,
            shortDescription: s.short_description,
            duration: parseInt(s.duration.toString()) || 60,
            price: parseFloat(s.price.toString()),
            salePrice: s.sale_price ? parseFloat(s.sale_price.toString()) : parseFloat(s.price.toString()),
            category: s.category_name,
            active: s.status === 'published'
          }));
          setPrograms(mappedPrograms);
        } else {
          throw new Error('Database returned empty services');
        }

      } catch (err: unknown) {
        if (!active) return;
        
        const errorMessage = err instanceof Error ? err.message : String(err);
        // DEVELOPMENT FALLBACK
        console.error('API Fetch failed, using development fallbacks:', errorMessage);
        setServices(demoServices);
        setPrograms(demoConsultationPrograms);
        setSiteSettings(fallbackSettings);

        // Do not block rendering in development mode
        if (import.meta.env.PROD) {
          setError('We’re having trouble loading consultation options right now. Please try again in a moment.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPublicData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <PublicDataContext.Provider value={{ services, programs, siteSettings, loading, error }}>
      {children}
    </PublicDataContext.Provider>
  );
}

export function usePublicData(): PublicDataContextType {
  const context = useContext(PublicDataContext);
  if (!context) {
    throw new Error('usePublicData must be used inside a PublicDataProvider');
  }
  return context;
}

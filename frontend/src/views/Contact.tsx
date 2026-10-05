'use client';

import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { usePublicData } from '../context/PublicDataContext';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';
import SEO from '../components/SEO';

const SectionReveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => {
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
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const { siteSettings } = usePublicData();
  const settings = siteSettings;

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg({ type: '', text: '' });

    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setResponseMsg({ type: 'error', text: 'All form fields are required.' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<{ success: boolean; message?: string; error?: string }>('/contact/create.php', formData);
      if (response && response.success) {
        setResponseMsg({ type: 'success', text: response.message || 'Thank you! Your message has been submitted successfully.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // Reset
      } else {
        throw new Error(response?.error || "Failed to submit message.");
      }
    } catch (err: any) {
      setResponseMsg({ type: 'error', text: err.message || 'An error occurred during submission. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getWhatsappLink = () => {
    const cleaned = settings.contact_whatsapp.replace(/[^\d+]/g, '');
    const formatted = cleaned.startsWith('+') ? cleaned.replace('+', '') : `91${cleaned}`;
    return `https://wa.me/${formatted}?text=Hello%20Abhay%20Harpale,%20I%20would%20like%20to%20enquire%20about%20a%20consultation.`;
  };

  return (
    <>
      <SEO
        title="Contact Abhay Harpale"
        description="Reach out to Abhay Harpale for a confidential relationship or intimacy guidance consultation. Book your personalised session today."
        canonical="/contact"
      />
      <BackgroundWrapper
        variant="primary"
        patternType="geometry"
        className="pt-32 pb-20"
      >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
        
        {/* Header Block */}
        <SectionReveal className="text-center max-w-xl mx-auto space-y-4">
          <span 
            className="inline-block px-4 py-1.5 eyebrow-label uppercase rounded-full"
            style={{ backgroundColor: '#FFFFFF', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
          >
            Connect
          </span>
          <h1 className="font-serif text-[#166D74]">Contact My Desk</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72' }}>
            Reach out to inquire about custom guidance packages, private online session slot scheduling, or to ask questions before booking.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: Coordinates (5 columns) */}
          <SectionReveal className="lg:col-span-5 space-y-8 p-8 md:p-12 rounded-[28px]" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(64,192,192,0.12)', boxShadow: '0 10px 30px rgba(22,109,116,0.02)' }}>
            <h3 className="font-serif text-xl border-b pb-4 text-left font-semibold text-[#166D74]" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
              General Contact Coordinates
            </h3>
            
            <ul className="space-y-6 font-sans text-sm text-left" style={{ color: '#5F6C72' }}>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#40C0C0' }} />
                <div>
                  <strong className="block mb-1" style={{ color: '#166D74' }}>Advisory Office</strong>
                  <span>{settings.contact_address}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#40C0C0' }} />
                <div>
                  <strong className="block mb-1" style={{ color: '#166D74' }}>Telephone</strong>
                  <a href={`tel:${settings.contact_phone}`} className="animated-link" style={{ color: '#5F6C72' }}>
                    {settings.contact_phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#40C0C0' }} />
                <div>
                  <strong className="block mb-1" style={{ color: '#166D74' }}>Secure Email</strong>
                  <a href={`mailto:${settings.contact_email}`} className="animated-link" style={{ color: '#5F6C72' }}>
                    {settings.contact_email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#40C0C0' }} />
                <div>
                  <strong className="block mb-1" style={{ color: '#166D74' }}>Business Hours</strong>
                  <span>{settings.business_hours}</span>
                </div>
              </li>
            </ul>

            <div className="pt-6 border-t flex flex-col justify-center items-stretch" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
              <Button
                to={getWhatsappLink()}
                variant="outline"
                className="w-full justify-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> Chat on WhatsApp
              </Button>
            </div>
          </SectionReveal>

          {/* Column 2: Inquiry Form (7 columns) */}
          <SectionReveal className="lg:col-span-7 p-8 md:p-12 rounded-[28px] text-left" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(64,192,192,0.12)', boxShadow: '0 10px 30px rgba(22,109,116,0.02)' }}>
            <h3 className="font-serif text-xl border-b pb-4 mb-6 font-semibold text-[#166D74]" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
              Send An Enquiry
            </h3>
            
            {responseMsg.text && (
              <div className={`p-4 mb-6 text-sm font-sans border-l-4 rounded-r-xl ${
                responseMsg.type === 'success' 
                  ? 'bg-green-50/50 border-green-500 text-green-700' 
                  : 'bg-red-50/50 border-red-500 text-red-700'
              }`}>
                {responseMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#88949B]">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#40C0C0] rounded-xl text-sm transition-all shadow-sm"
                    style={{ backgroundColor: '#FFFDF7', borderColor: 'rgba(64,192,192,0.2)' }}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#88949B]">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#40C0C0] rounded-xl text-sm transition-all shadow-sm"
                    style={{ backgroundColor: '#FFFDF7', borderColor: 'rgba(64,192,192,0.2)' }}
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#88949B]">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#40C0C0] rounded-xl text-sm transition-all shadow-sm"
                    style={{ backgroundColor: '#FFFDF7', borderColor: 'rgba(64,192,192,0.2)' }}
                    placeholder="Phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#88949B]">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#40C0C0] rounded-xl text-sm transition-all shadow-sm"
                    style={{ backgroundColor: '#FFFDF7', borderColor: 'rgba(64,192,192,0.2)' }}
                    placeholder="Enquiry subject"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#88949B]">Your Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border p-3.5 focus:outline-none focus:border-[#40C0C0] rounded-xl text-sm h-32 resize-none transition-all shadow-sm"
                  style={{ backgroundColor: '#FFFDF7', borderColor: 'rgba(64,192,192,0.2)' }}
                  placeholder="Detail your request..."
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col items-stretch">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="w-full"
                  showArrow={true}
                >
                  {loading ? "Sending Enquiry..." : "Send Secure Enquiry"}
                </Button>
              </div>
            </form>
          </SectionReveal>

        </div>

      </div>
    </BackgroundWrapper>
    </>
  );
}

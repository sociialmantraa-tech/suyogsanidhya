import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Layout
import RootLayout from './layouts/RootLayout';

// Pages - Lazy loaded
const Home = lazy(() => import('./views/Home'));
const About = lazy(() => import('./views/About'));
const Services = lazy(() => import('./views/Services'));
const ServiceDetail = lazy(() => import('./views/ServiceDetail'));
const Consultation = lazy(() => import('./views/Consultation'));
const Booking = lazy(() => import('./views/Booking'));
const Payment = lazy(() => import('./views/Payment'));
const PaymentSuccess = lazy(() => import('./views/PaymentSuccess'));
const PaymentFailed = lazy(() => import('./views/PaymentFailed'));
const Blog = lazy(() => import('./views/Blog'));
const BlogDetail = lazy(() => import('./views/BlogDetail'));
const Testimonials = lazy(() => import('./views/Testimonials'));
const Media = lazy(() => import('./views/Media'));
const FAQ = lazy(() => import('./views/FAQ'));
const Contact = lazy(() => import('./views/Contact'));
const PrivacyPolicy = lazy(() => import('./views/PrivacyPolicy'));
const Terms = lazy(() => import('./views/Terms'));
const RefundPolicy = lazy(() => import('./views/RefundPolicy'));

import { PublicDataProvider } from './context/PublicDataContext';

const LoadingSpinner = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#267E85]/20 border-t-[#267E85] rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <PublicDataProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="consultation" element={<Consultation />} />
              <Route path="book" element={<Booking />} />
              <Route path="payment/:bookingId" element={<Payment />} />
              <Route path="payment/success" element={<PaymentSuccess />} />
              <Route path="payment/failed" element={<PaymentFailed />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="media" element={<Media />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="refund-policy" element={<RefundPolicy />} />
              <Route path="*" element={
                <div className="w-full pt-40 pb-20 text-center space-y-4">
                  <h2 className="font-serif text-3xl">404 - Page Not Found</h2>
                  <p className="text-secondaryText font-sans text-sm">We couldn't find the page you were looking for.</p>
                  <Link href="/" className="btn-primary py-2 px-6 text-xs inline-block">Back Home</Link>
                </div>
              } />
            </Route>
          </Routes>
        </Suspense>
      </PublicDataProvider>
    </BrowserRouter>
  );
}

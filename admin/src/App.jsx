import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Concerns from './pages/Concerns';
import Blogs from './pages/Blogs';
import Testimonials from './pages/Testimonials';
import FAQs from './pages/FAQs';
import Settings from './pages/Settings';
import ActivityLogs from './pages/ActivityLogs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="services" element={<Services />} />
          <Route path="concerns" element={<Concerns />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
        </Route>

        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <h2 className="font-serif text-2xl text-gray-800">404 - Panel Path Not Found</h2>
            <p className="text-gray-500 font-sans text-xs mt-1">Verify link address coordinates.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, ArrowRight, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import { usePublicData } from '../context/PublicDataContext';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';
import { Program } from '../types';

const SectionReveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function Booking() {
  const navigate = useNavigate();
  const { programs, loading: dataLoading, error: dataError } = usePublicData();

  const [step, setStep] = useState<number>(1);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  // Date and Time State
  const [bookingDate, setBookingDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);

  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    concernMessage: ''
  });

  // Validation & Submission State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');

  // Handle pre-selection from url/localStorage
  useEffect(() => {
    if (programs && programs.length > 0) {
      const preSelectedId = localStorage.getItem('selected_booking_service_id');
      if (preSelectedId) {
        const found = programs.find(p => p.id === parseInt(preSelectedId));
        if (found) {
          setSelectedProgram(found);
          setStep(2); // Jump directly to date selection
        }
        localStorage.removeItem('selected_booking_service_id');
      }
    }
  }, [programs]);

  // Fetch slots from backend or fallback to demo slots on error
  useEffect(() => {
    if (bookingDate && selectedProgram) {
      setSlotsLoading(true);
      setAvailableSlots([]);
      setSelectedSlot('');
      
      api.get<{ slots: string[] }>(`/bookings/available-slots.php?date=${bookingDate}&service_id=${selectedProgram.id}`)
        .then(data => {
          if (data && data.slots && data.slots.length > 0) {
            setAvailableSlots(data.slots);
          } else {
            // Safe demo slots fallback
            setAvailableSlots(['10:00:00', '11:30:00', '14:00:00', '15:30:00', '17:00:00']);
          }
          setSlotsLoading(false);
        })
        .catch(err => {
          console.warn("Booking slots API failed, using fallbacks:", err);
          setAvailableSlots(['10:00:00', '11:30:00', '14:00:00', '15:30:00', '17:00:00']);
          setSlotsLoading(false);
        });
    }
  }, [bookingDate, selectedProgram]);

  // Enforce no-past-slots filtering if selecting today's date
  const getFilteredSlots = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingDate === todayStr) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();

      return availableSlots.filter(slot => {
        const parts = slot.split(':');
        const h = parseInt(parts[0]) || 0;
        const m = parseInt(parts[1]) || 0;
        return h > currentHour || (h === currentHour && m > currentMin);
      });
    }
    return availableSlots;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  const formatSlotTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const h = parseInt(parts[0]) || 12;
    const min = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  };

  const validateInfoStep = () => {
    const errors: Record<string, string> = {};
    if (!customerInfo.name.trim()) {
      errors.name = "Full name is required.";
    }
    if (!customerInfo.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = "Please provide a valid email address.";
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{7,15}$/.test(customerInfo.phone.trim().replace(/[-\s]/g, ''))) {
      errors.phone = "Please enter a valid phone number (7 to 15 digits).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    setBookingError('');
    if (step === 1 && !selectedProgram) {
      setBookingError("Please select a consultation type to continue.");
      return;
    }
    if (step === 2 && (!bookingDate || !selectedSlot)) {
      setBookingError("Please pick both a date and an available slot.");
      return;
    }
    if (step === 3) {
      if (!validateInfoStep()) return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setBookingError('');
    setStep(prev => prev - 1);
  };

  const handleBookingSubmit = async () => {
    if (!selectedProgram || !bookingDate || !selectedSlot) return;
    setSubmitLoading(true);
    setBookingError('');

    const payload = {
      service_id: selectedProgram.id,
      booking_date: bookingDate,
      booking_time: selectedSlot,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      country_code: customerInfo.countryCode,
      concern_message: customerInfo.concernMessage
    };

    try {
      const response = await api.post<{ success: boolean; booking_id?: number; error?: string }>('/bookings/create-pending.php', payload);
      if (response && response.success && response.booking_id) {
        navigate(`/payment/${response.booking_id}`);
      } else {
        throw new Error(response.error || "Failed to create booking transaction.");
      }
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setBookingError(err.message || 'We encountered an error setting up your clarity booking. Please try again.');
      setSubmitLoading(false);
    }
  };

  if (dataError && (!programs || programs.length === 0)) {
    return (
      <BackgroundWrapper variant="primary" className="min-h-screen flex flex-col items-center justify-center pt-32 space-y-6 max-w-md mx-auto px-6">
        <h2 className="font-serif text-2xl text-[#166D74]">Unable to Load Options</h2>
        <p className="font-sans text-sm text-[#5F6C72] text-center">{dataError}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="primary"
        >
          Retry Load
        </Button>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="pt-32 pb-20"
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-12 relative z-10">
        
        {/* Page Titles */}
        <SectionReveal className="text-center space-y-4">
          <span className="eyebrow-label uppercase" style={{ color: '#C9A646' }}>PRIVATE CONSULTATION</span>
          <h1 className="font-serif text-[#166D74]">Book Your Consultation</h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: '#5F6C72', maxWidth: '480px', margin: '0 auto' }}>
            Choose the guidance area that best matches your current needs, select a convenient time and complete your booking securely.
          </p>
        </SectionReveal>

        {/* Human Friendly Progress Bar */}
        <SectionReveal className="space-y-4">
          <div className="grid grid-cols-4 text-center text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider text-secondaryText">
            <span style={{ color: step >= 1 ? '#008B8B' : '#74858C' }}>1. Consultation</span>
            <span style={{ color: step >= 2 ? '#008B8B' : '#74858C' }}>2. Date &amp; Time</span>
            <span style={{ color: step >= 3 ? '#008B8B' : '#74858C' }}>3. Your Details</span>
            <span style={{ color: step >= 4 ? '#008B8B' : '#74858C' }}>4. Review &amp; Pay</span>
          </div>
          <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(64,192,192,0.12)' }}>
            <div 
              className="h-full transition-all duration-500 rounded-full" 
              style={{ width: `${(step / 4) * 100}%`, backgroundColor: '#008B8B' }}
            ></div>
          </div>
        </SectionReveal>

        {bookingError && (
          <SectionReveal className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-sans text-left rounded-r-xl">
            {bookingError}
          </SectionReveal>
        )}

        <SectionReveal 
          className="p-8 md:p-12 shadow-lg"
          style={{
            backgroundColor: '#FFFCF8',
            borderRadius: '28px',
            border: '1.5px solid rgba(64,192,192,0.1)',
          }}
        >
          
          {/* STEP 1: SELECT CONSULTATION */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              <h2 className="font-serif text-xl pb-4 font-semibold" style={{ color: '#176F78', borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
                Select Consultation Type
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {programs.map((prog: Program) => {
                  const isSelected = selectedProgram?.id === prog.id;
                  return (
                    <button
                      key={prog.id}
                      onClick={() => setSelectedProgram(prog)}
                      className="w-full text-left p-6 border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-2xl"
                      style={isSelected ? {
                        borderColor: '#008B8B',
                        backgroundColor: 'rgba(64,192,192,0.04)',
                        boxShadow: '0 8px 24px rgba(23,111,120,0.03)'
                      } : {
                        borderColor: 'rgba(64,192,192,0.12)',
                        backgroundColor: '#FFFCF8'
                      }}
                    >
                      <div className="space-y-2 max-w-lg">
                        <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#C9A646' }}>{prog.category}</span>
                        <h4 className="font-serif text-base font-semibold" style={{ color: '#176F78' }}>{prog.title}</h4>
                        <p className="font-sans text-xs leading-relaxed line-clamp-2" style={{ color: '#5E6E72' }}>{prog.shortDescription}</p>
                        <span 
                          className="inline-block text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1 mt-2 rounded-full"
                          style={{ backgroundColor: '#FFFFF5', color: '#008B8B', border: '1px solid rgba(64,192,192,0.15)' }}
                        >
                          {prog.duration} Minutes
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-sans text-[16px] font-bold" style={{ color: '#008B8B' }}>INR {prog.salePrice || prog.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="pt-6 flex justify-end" style={{ borderTop: '1px solid rgba(64,192,192,0.12)' }}>
                <button 
                  onClick={handleNextStep}
                  disabled={!selectedProgram}
                  className={`btn btn-primary px-8 ${!selectedProgram ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Continue to Select Slot <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && selectedProgram && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
                <h2 className="font-serif text-xl font-semibold" style={{ color: '#176F78' }}>Choose Date &amp; Time</h2>
                <span 
                  className="font-sans text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                  style={{ backgroundColor: '#FFFFF5', color: '#008B8B', border: '1px solid rgba(64,192,192,0.15)' }}
                >
                  {selectedProgram.title}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Picker */}
                <div className="space-y-3">
                  <label className="font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#176F78' }}>
                    <CalendarIcon className="w-4 h-4" style={{ color: '#40C0C0' }} />
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#008B8B] rounded-xl font-sans text-sm transition-all"
                    style={{ backgroundColor: 'rgba(255,255,245,0.4)', borderColor: 'rgba(64,192,192,0.2)' }}
                  />
                </div>

                {/* Slots Picker */}
                <div className="space-y-3">
                  <label className="font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#176F78' }}>
                    <Clock className="w-4 h-4" style={{ color: '#40C0C0' }} />
                    Available Slots
                  </label>
                  
                  {slotsLoading ? (
                    <div className="py-8 text-center text-xs text-secondaryText">Retrieving slots...</div>
                  ) : bookingDate ? (
                    getFilteredSlots().length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                        {getFilteredSlots().map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className="p-3 text-center text-xs font-semibold uppercase tracking-wider transition-all border rounded-xl"
                            style={selectedSlot === slot ? {
                              backgroundColor: '#008B8B',
                              borderColor: '#008B8B',
                              color: '#FFFFFF'
                            } : {
                              borderColor: 'rgba(64,192,192,0.2)',
                              color: '#5E6E72',
                              backgroundColor: '#FFFCF8'
                            }}
                          >
                            {formatSlotTime(slot)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-secondaryText pt-2 italic">All slots are booked out or expired for today. Please pick another date.</p>
                    )
                  ) : (
                    <p className="text-xs text-secondaryText pt-2 italic">Please select a date first to view slots.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
                <button onClick={handlePrevStep} className="btn btn-outline px-6">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button 
                  onClick={handleNextStep}
                  disabled={!bookingDate || !selectedSlot}
                  className={`btn btn-primary px-6 ${(!bookingDate || !selectedSlot) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER INFO */}
          {step === 3 && selectedProgram && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 gap-2" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
                <h2 className="font-serif text-xl font-semibold" style={{ color: '#176F78' }}>Your Details</h2>
                <span 
                  className="font-sans text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                  style={{ backgroundColor: '#FFFFF5', color: '#C9A646', border: '1px solid rgba(64,192,192,0.15)' }}
                >
                  Selected: {bookingDate} @ {formatSlotTime(selectedSlot)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondaryText">Full Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#008B8B] rounded-xl text-sm transition-all shadow-sm"
                    style={{
                      backgroundColor: 'rgba(255,255,245,0.4)',
                      borderColor: formErrors.name ? '#EF4444' : 'rgba(64,192,192,0.2)'
                    }}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondaryText">Email Address *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#008B8B] rounded-xl text-sm transition-all shadow-sm"
                    style={{
                      backgroundColor: 'rgba(255,255,245,0.4)',
                      borderColor: formErrors.email ? '#EF4444' : 'rgba(64,192,192,0.2)'
                    }}
                    placeholder="name@domain.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-[11px] mt-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondaryText">Phone Number *</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={customerInfo.countryCode}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, countryCode: e.target.value }))}
                      className="w-16 border border-r-0 p-3.5 focus:outline-none focus:border-[#008B8B] rounded-l-xl text-sm text-center transition-all shadow-sm font-semibold"
                      style={{ backgroundColor: 'rgba(255,255,245,0.4)', borderColor: 'rgba(64,192,192,0.2)', color: '#176F78' }}
                    />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border p-3.5 focus:outline-none focus:border-[#008B8B] rounded-r-xl text-sm transition-all shadow-sm"
                      style={{
                        backgroundColor: 'rgba(255,255,245,0.4)',
                        borderColor: formErrors.phone ? '#EF4444' : 'rgba(64,192,192,0.2)'
                      }}
                      placeholder="9820619636"
                    />
                  </div>
                  {formErrors.phone && <p className="text-red-500 text-[11px] mt-1">{formErrors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondaryText">Optional Message / Concerns</label>
                  <textarea
                    value={customerInfo.concernMessage}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, concernMessage: e.target.value }))}
                    className="w-full border p-3.5 focus:outline-none focus:border-[#008B8B] rounded-xl text-sm h-24 resize-none transition-all shadow-sm"
                    style={{ backgroundColor: 'rgba(255,255,245,0.4)', borderColor: 'rgba(64,192,192,0.2)' }}
                    placeholder="Briefly describe what you would like to address during the guidance consultation."
                  ></textarea>
                </div>
              </div>

              {/* Confidential Privacy Note */}
              <div 
                className="flex items-center gap-2 p-4 text-xs font-sans rounded-2xl"
                style={{ backgroundColor: '#FFFFF5', border: '1px solid rgba(64,192,192,0.15)', color: '#5E6E72' }}
              >
                <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: '#40C0C0' }} />
                <span><strong>Privacy Note:</strong> Your contact information and consultation content are strictly confidential. We never share your data.</span>
              </div>

              <div className="flex justify-between items-center pt-8 border-t" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
                <button onClick={handlePrevStep} className="btn btn-outline px-6">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button onClick={handleNextStep} className="btn btn-primary px-6">
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PAYMENT */}
          {step === 4 && selectedProgram && (
            <div className="space-y-8 animate-fade-in font-sans text-left">
              <div className="pb-4" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
                <h2 className="font-serif text-xl font-semibold" style={{ color: '#176F78' }}>Review &amp; Payment</h2>
                <p className="text-xs text-secondaryText mt-1">Please review all consultation parameters before initiating payments.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-bgSecondary">
                
                {/* Left: Summary */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C9A646' }}>Schedule Details</h4>
                  <div className="space-y-2.5 text-sm text-secondaryText">
                    <p><strong style={{ color: '#176F78' }}>Program:</strong> {selectedProgram.title}</p>
                    <p><strong style={{ color: '#176F78' }}>Duration:</strong> {selectedProgram.duration} Minutes</p>
                    <p><strong style={{ color: '#176F78' }}>Date:</strong> {bookingDate}</p>
                    <p><strong style={{ color: '#176F78' }}>Time slot:</strong> {formatSlotTime(selectedSlot)} (IST)</p>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider pt-4" style={{ color: '#C9A646' }}>Your Contact Information</h4>
                  <div className="space-y-2.5 text-sm text-secondaryText">
                    <p><strong style={{ color: '#176F78' }}>Name:</strong> {customerInfo.name}</p>
                    <p><strong style={{ color: '#176F78' }}>Email:</strong> {customerInfo.email}</p>
                    <p><strong style={{ color: '#176F78' }}>Phone:</strong> {customerInfo.countryCode} {customerInfo.phone}</p>
                  </div>
                </div>

                {/* Right: Price calculation */}
                <div className="space-y-6 md:pl-8 pt-6 md:pt-0" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C9A646' }}>Financial breakdown</h4>
                  <div className="space-y-3 text-sm pb-4" style={{ borderBottom: '1px solid rgba(64,192,192,0.12)' }}>
                    <div className="flex justify-between">
                      <span className="text-secondaryText">Consultation Fee</span>
                      <span style={{ color: '#176F78', fontWeight: 600 }}>INR {((selectedProgram.salePrice || selectedProgram.price) / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryText">GST (18% inclusive)</span>
                      <span style={{ color: '#176F78', fontWeight: 600 }}>INR {((selectedProgram.salePrice || selectedProgram.price) - ((selectedProgram.salePrice || selectedProgram.price) / 1.18)).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-base" style={{ color: '#176F78' }}>Total Charge</span>
                    <span className="text-2xl font-serif" style={{ color: '#008B8B' }}>INR {selectedProgram.salePrice || selectedProgram.price}</span>
                  </div>

                  <button
                    onClick={handleBookingSubmit}
                    disabled={submitLoading}
                    className="btn btn-primary w-full text-center py-4 flex items-center justify-center gap-2 shadow-md"
                  >
                    {submitLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Initializing secure checkout...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" /> Proceed to Secure Payment
                      </>
                    )}
                  </button>
                </div>

              </div>

              {!submitLoading && (
                <div className="flex justify-start pt-8 border-t" style={{ borderColor: 'rgba(64,192,192,0.12)' }}>
                  <button onClick={handlePrevStep} className="btn btn-outline px-6">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </button>
                </div>
              )}
            </div>
          )}

        </SectionReveal>

      </div>
    </BackgroundWrapper>
  );
}

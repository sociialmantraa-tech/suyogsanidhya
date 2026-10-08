'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, ArrowRight, ArrowLeft, CreditCard, ShieldCheck, Check, Lock, Sparkles } from 'lucide-react';
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
  const router = useRouter();
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
    // Booking calendar operational start date: 08th November
    const startAvailableDate = new Date(today.getFullYear(), 10, 8); // Month 10 = November (0-indexed)
    
    const targetDate = today < startAvailableDate ? startAvailableDate : today;
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const minStr = getMinDate();
    const minDateObj = new Date(minStr);
    minDateObj.setDate(minDateObj.getDate() + 60); // Allow selection up to 60 days from start date
    const year = minDateObj.getFullYear();
    const month = String(minDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(minDateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    if (step === 1) {
      if (!selectedProgram) {
        setBookingError("Please select a consultation type to continue.");
        return;
      }
      if (!bookingDate) {
        setBookingDate(getMinDate());
      }
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
        router.push(`/payment/${response.booking_id}`);
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

  const stepsList = [
    { num: 1, label: 'Consultation' },
    { num: 2, label: 'Date & Time' },
    { num: 3, label: 'Your Details' },
    { num: 4, label: 'Review & Pay' },
  ];

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="pt-32 pb-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10 relative z-10">
        
        {/* Page Header */}
        <SectionReveal className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#00AAC1]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00AAC1]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#006B7D]">
              Private Consultation
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1F2937] tracking-tight">
            Book Your Guidance Session
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#4B5563] max-w-lg mx-auto leading-relaxed">
            Select your consultation area, pick your preferred date and time, and securely confirm your session slot.
          </p>
        </SectionReveal>

        {/* Stepped Progress Bar */}
        <SectionReveal className="w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-[#00AAC1]/15 shadow-sm">
            <div className="grid grid-cols-4 gap-2 relative">
              {/* Line connector background */}
              <div className="absolute top-4 sm:top-5 left-[12%] right-[12%] h-[2px] bg-[#EBF7F7] -z-0" />
              
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center text-center relative z-10 space-y-2">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans text-xs sm:text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#00C4D9] to-[#008496] text-white shadow-md'
                          : isActive
                          ? 'bg-gradient-to-r from-[#00C4D9] to-[#008496] text-white ring-4 ring-[#00AAC1]/20 shadow-lg scale-105'
                          : 'bg-[#F4F8F8] text-[#6B7280] border border-[#00AAC1]/20'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 text-white" /> : s.num}
                    </div>
                    <span
                      className={`font-sans text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                        isActive ? 'text-[#00AAC1]' : isCompleted ? 'text-[#006B7D]' : 'text-[#6B7280]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        {/* Error Alert */}
        {bookingError && (
          <SectionReveal className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-sans text-left rounded-r-2xl shadow-sm">
            {bookingError}
          </SectionReveal>
        )}

        {/* Main Card Container */}
        <SectionReveal 
          className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#00AAC1]/15 shadow-2xl shadow-[#00AAC1]/5"
        >
          
          {/* STEP 1: SELECT CONSULTATION */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="font-serif text-2xl font-semibold text-[#1F2937]">
                  Select Consultation Type
                </h2>
                <p className="font-sans text-xs text-[#4B5563] mt-1">
                  Choose the specialized guidance area suited for your current relationship or personal situation.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {programs.map((prog: Program) => {
                  const isSelected = selectedProgram?.id === prog.id;
                  return (
                    <div
                      key={prog.id}
                      onClick={() => setSelectedProgram(prog)}
                      className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer ${
                        isSelected
                          ? 'border-[#00AAC1] bg-[#EBF7F7] shadow-md ring-2 ring-[#00AAC1]/20'
                          : 'border-slate-100 bg-white hover:border-[#00AAC1]/40 hover:bg-[#F4F8F8]'
                      }`}
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-[#00AAC1] flex items-center justify-center shrink-0">
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#00AAC1]" />}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#00AAC1]">
                            {prog.category}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg font-bold text-[#1F2937] pl-6">
                          {prog.title}
                        </h4>
                        <p className="font-sans text-xs text-[#4B5563] leading-relaxed line-clamp-2 pl-6">
                          {prog.shortDescription}
                        </p>
                        <div className="pl-6 pt-1">
                          <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20">
                            {prog.duration} Minutes Session
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 self-end md:self-center">
                        <span className="font-serif text-xl font-bold text-[#00AAC1]">
                          INR {prog.salePrice || prog.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-6 flex justify-end border-t border-slate-100">
                <button 
                  onClick={handleNextStep}
                  disabled={!selectedProgram}
                  className={`px-8 py-3.5 rounded-full font-sans text-sm font-bold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${
                    !selectedProgram ? 'opacity-50 cursor-not-allowed bg-slate-300' : 'bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-xl'
                  }`}
                >
                  <span>Continue to Select Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && selectedProgram && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#1F2937]">Choose Date &amp; Time</h2>
                  <p className="font-sans text-xs text-[#4B5563] mt-1">Select an available date and suitable time slot for your consultation.</p>
                </div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20 shrink-0">
                  {selectedProgram.title}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#1F2937]">
                      <CalendarIcon className="w-4 h-4 text-[#00AAC1]" />
                      Select Date
                    </label>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20">
                      Available from 8th Nov
                    </span>
                  </div>
                  <input
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={bookingDate || getMinDate()}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-[#00AAC1]/25 p-3.5 focus:outline-none focus:border-[#00AAC1] focus:ring-2 focus:ring-[#00AAC1]/20 rounded-xl font-sans text-sm bg-white text-[#1F2937] font-medium shadow-xs transition-all"
                  />
                  <p className="text-[11px] font-sans text-[#6B7280]">
                    * Consultation calendar opens for session bookings starting 8th November 2026.
                  </p>
                </div>

                {/* Slots Picker */}
                <div className="space-y-3">
                  <label className="font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#1F2937]">
                    <Clock className="w-4 h-4 text-[#00AAC1]" />
                    Available Slots
                  </label>
                  
                  {slotsLoading ? (
                    <div className="py-8 text-center text-xs text-[#6B7280] flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#00AAC1] border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving available slots...</span>
                    </div>
                  ) : bookingDate ? (
                    getFilteredSlots().length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                        {getFilteredSlots().map(slot => {
                          const isSlotSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 text-center text-xs font-bold uppercase tracking-wider transition-all border rounded-full cursor-pointer ${
                                isSlotSelected
                                  ? 'bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] border-transparent text-white shadow-md scale-[1.03]'
                                  : 'border-[#00AAC1]/20 text-[#4B5563] bg-white hover:border-[#00AAC1] hover:bg-[#EBF7F7] hover:text-[#00AAC1]'
                              }`}
                            >
                              {formatSlotTime(slot)}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B7280] pt-2 italic">All slots are booked out or expired for today. Please pick another date.</p>
                    )
                  ) : (
                    <p className="text-xs text-[#6B7280] pt-2 italic">Please select a date first to view slots.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <button 
                  onClick={handlePrevStep} 
                  className="px-6 py-3 rounded-full border-2 border-[#00AAC1] font-sans text-xs sm:text-sm font-bold text-[#00AAC1] hover:bg-[#EBF7F7] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={handleNextStep}
                  disabled={!bookingDate || !selectedSlot}
                  className={`px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${
                    (!bookingDate || !selectedSlot) ? 'opacity-50 cursor-not-allowed bg-slate-300' : 'bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-xl'
                  }`}
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER INFO */}
          {step === 3 && selectedProgram && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#1F2937]">Your Contact Details</h2>
                  <p className="font-sans text-xs text-[#4B5563] mt-1">Provide authentic contact information for session confirmation and private video link access.</p>
                </div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#EBF7F7] text-[#00AAC1] border border-[#00AAC1]/20 shrink-0">
                  {bookingDate} @ {formatSlotTime(selectedSlot)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2937] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#00AAC1]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full border p-3.5 focus:outline-none focus:border-[#00AAC1] focus:ring-2 focus:ring-[#00AAC1]/20 rounded-xl text-sm transition-all shadow-xs bg-white ${
                      formErrors.name ? 'border-red-500' : 'border-[#00AAC1]/25'
                    }`}
                    placeholder="e.g. Rahul Sharma"
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2937] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#00AAC1]" /> Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full border p-3.5 focus:outline-none focus:border-[#00AAC1] focus:ring-2 focus:ring-[#00AAC1]/20 rounded-xl text-sm transition-all shadow-xs bg-white ${
                      formErrors.email ? 'border-red-500' : 'border-[#00AAC1]/25'
                    }`}
                    placeholder="name@domain.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-[11px] mt-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2937] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00AAC1]" /> Phone Number *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={customerInfo.countryCode}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, countryCode: e.target.value }))}
                      className="w-16 border border-r-0 border-[#00AAC1]/25 p-3.5 focus:outline-none focus:border-[#00AAC1] rounded-l-xl text-sm text-center font-bold text-[#00AAC1] bg-[#EBF7F7]"
                    />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full border border-l-0 p-3.5 focus:outline-none focus:border-[#00AAC1] focus:ring-2 focus:ring-[#00AAC1]/20 rounded-r-xl text-sm transition-all shadow-xs bg-white ${
                        formErrors.phone ? 'border-red-500' : 'border-[#00AAC1]/25'
                      }`}
                      placeholder="9819000000"
                    />
                  </div>
                  {formErrors.phone && <p className="text-red-500 text-[11px] mt-1">{formErrors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2937] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#00AAC1]" /> Primary Concerns / Notes (Optional)
                  </label>
                  <textarea
                    value={customerInfo.concernMessage}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, concernMessage: e.target.value }))}
                    className="w-full border border-[#00AAC1]/25 p-3.5 focus:outline-none focus:border-[#00AAC1] focus:ring-2 focus:ring-[#00AAC1]/20 rounded-xl text-sm h-24 resize-none transition-all shadow-xs bg-white"
                    placeholder="Briefly share what key relationship areas or questions you would like to address."
                  ></textarea>
                </div>
              </div>

              {/* Confidential Privacy Note */}
              <div className="flex items-center gap-3 p-4 text-xs font-sans rounded-2xl bg-[#EBF7F7] border border-[#00AAC1]/20 text-[#006B7D]">
                <ShieldCheck className="w-5 h-5 text-[#00AAC1] shrink-0" />
                <span><strong>Absolute Confidentiality:</strong> Your contact details and session discussion are strictly private and never shared with any third party.</span>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <button 
                  onClick={handlePrevStep} 
                  className="px-6 py-3 rounded-full border-2 border-[#00AAC1] font-sans text-xs sm:text-sm font-bold text-[#00AAC1] hover:bg-[#EBF7F7] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold text-white shadow-md bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-xl"
                >
                  <span>Review &amp; Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PAYMENT */}
          {step === 4 && selectedProgram && (
            <div className="space-y-8 animate-fade-in font-sans text-left">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="font-serif text-2xl font-semibold text-[#1F2937]">Review &amp; Payment</h2>
                <p className="text-xs text-[#4B5563] mt-1">Verify your session details before initializing secure online payment.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Booking & Contact Summary */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Schedule Details Card */}
                  <div className="bg-[#F4F8F8] p-6 rounded-2xl border border-[#00AAC1]/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#00AAC1]/15 pb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#006B7D]">Schedule Summary</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-[#00AAC1] border border-[#00AAC1]/20">
                        Confirmed Slot
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[#6B7280] block">Program</span>
                        <strong className="text-[#1F2937] font-serif text-sm block">{selectedProgram.title}</strong>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block">Duration</span>
                        <strong className="text-[#1F2937] text-sm block">{selectedProgram.duration} Minutes</strong>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block">Selected Date</span>
                        <strong className="text-[#1F2937] text-sm block">{bookingDate}</strong>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block">Time Slot</span>
                        <strong className="text-[#1F2937] text-sm block">{formatSlotTime(selectedSlot)} (IST)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Client Details Card */}
                  <div className="bg-[#F4F8F8] p-6 rounded-2xl border border-[#00AAC1]/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#006B7D] border-b border-[#00AAC1]/15 pb-2">
                      Client Contact Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[#6B7280] block">Name</span>
                        <strong className="text-[#1F2937] text-sm block">{customerInfo.name}</strong>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block">Email</span>
                        <strong className="text-[#1F2937] text-sm block truncate">{customerInfo.email}</strong>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block">Phone</span>
                        <strong className="text-[#1F2937] text-sm block">{customerInfo.countryCode} {customerInfo.phone}</strong>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Financial Breakdown & High-Impact Payment Button */}
                <div className="lg:col-span-5 bg-[#F4F8F8] p-6 rounded-2xl border border-[#00AAC1]/20 space-y-5">
                  
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#006B7D] border-b border-[#00AAC1]/15 pb-2">
                    Financial Breakdown
                  </h4>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-[#4B5563]">
                      <span>Consultation Fee</span>
                      <span className="font-semibold text-[#1F2937]">
                        INR {((selectedProgram.salePrice || selectedProgram.price) / 1.18).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#4B5563]">
                      <span>GST (18% inclusive)</span>
                      <span className="font-[#1F2937] font-semibold">
                        INR {((selectedProgram.salePrice || selectedProgram.price) - ((selectedProgram.salePrice || selectedProgram.price) / 1.18)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#00AAC1]/15 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-[#1F2937] block">Total Charge</span>
                      <span className="text-[10px] font-bold text-[#00AAC1] uppercase">Inclusive of all taxes</span>
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#00AAC1]">
                      INR {selectedProgram.salePrice || selectedProgram.price}
                    </span>
                  </div>

                  {/* Payment CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleBookingSubmit}
                      disabled={submitLoading}
                      className="w-full py-4 px-6 rounded-full font-sans text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#00C4D9] via-[#00AAC1] to-[#008496] hover:from-[#00D3EA] hover:via-[#00B4C9] hover:to-[#006F7F] transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Initializing Checkout...</span>
                        </span>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 text-white shrink-0" />
                          <span>Proceed to Payment</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security & Trust Credentials */}
                  <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#6B7280] border-t border-[#00AAC1]/15">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#00AAC1]" />
                      <span>256-Bit SSL</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#006B7D]" />
                      <span>Razorpay Verified</span>
                    </div>
                  </div>

                </div>

              </div>

              {!submitLoading && (
                <div className="flex justify-start pt-8 border-t border-slate-100">
                  <button 
                    onClick={handlePrevStep} 
                    className="px-6 py-3 rounded-full border-2 border-[#00AAC1] font-sans text-xs sm:text-sm font-bold text-[#00AAC1] hover:bg-[#EBF7F7] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Details
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


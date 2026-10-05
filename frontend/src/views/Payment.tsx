'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { api } from '../utils/api';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Button from '../components/Button';

interface OrderResponse {
  razorpay_order_id: string;
  key_id: string;
  amount_subunit: number;
  currency: string;
  error?: string;
  success?: boolean;
  booking: {
    service_title: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    country_code: string;
    price: number;
    currency: string;
    [key: string]: any;
  };
}

const SectionReveal = ({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function Payment() {
  const params = useParams();
  const bookingId = params?.bookingId as string;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [booking, setBooking] = useState<any>(null);
  const router = useRouter();

  // Load script helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let orderCreated = false;

    const initializeCheckout = async () => {
      try {
        // 1. Load Razorpay script
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error("Failed to load payment gateway library. Please check your network connection.");
        }

        // 2. Request backend to create Razorpay Order
        const orderData = await api.post<OrderResponse>('/payments/create-order.php', { booking_id: bookingId });
        
        if (!orderData || !orderData.razorpay_order_id) {
          throw new Error(orderData.error || "Failed to create order on payment server.");
        }

        setBooking(orderData.booking);
        setLoading(false);

        // 3. Configure Razorpay checkout options
        const options = {
          key: orderData.key_id,
          amount: orderData.amount_subunit, // in paise/subunits
          currency: orderData.currency,
          name: "Abhay Harpale",
          description: `Consultation: ${orderData.booking.service_title}`,
          image: "https://abhayharpale.com/logo.png",
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            setLoading(true);
            try {
              // 4. Verify payment signature on backend
              const verification = await api.post<{ success: boolean }>('/payments/verify.php', {
                booking_id: bookingId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verification && verification.success) {
                // Navigate to Success
                router.push(`/payment/success?ref=${bookingId}`);
              } else {
                throw new Error("Payment signature verification failed.");
              }
            } catch (err: any) {
              console.error("Verification error:", err);
              router.push('/payment/failed');
            }
          },
          prefill: {
            name: orderData.booking.customer_name,
            email: orderData.booking.customer_email,
            contact: `${orderData.booking.country_code}${orderData.booking.customer_phone}`
          },
          theme: {
            color: "#166D74" // Dark Cyan accent match
          },
          modal: {
            ondismiss: function() {
              router.push('/payment/failed');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error("Razorpay Payment Failure:", response.error);
          router.push('/payment/failed');
        });

        // Open checkout
        rzp.open();
      } catch (err: any) {
        console.error("Payment initialization failed:", err);
        setError(err.message || "An unexpected error occurred during checkout setup.");
        setLoading(false);
      }
    };

    if (bookingId && !orderCreated) {
      initializeCheckout();
      orderCreated = true;
    }
  }, [bookingId, router]);

  return (
    <BackgroundWrapper
      variant="primary"
      patternType="concentric"
      className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6"
    >
      <SectionReveal className="max-w-md w-full p-8 text-center relative z-10 space-y-6 bg-white" style={{ border: '1.5px solid rgba(64,192,192,0.12)', borderRadius: '28px' }}>
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-sm"
          style={{ backgroundColor: 'rgba(64,192,192,0.1)', color: '#166D74', border: '1px solid rgba(64,192,192,0.15)' }}
        >
          <CreditCard className="w-8 h-8" />
        </div>
        
        {loading && (
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#166D74]">Connecting to Gateway...</h3>
            <p className="font-sans text-xs text-[#5F6C72] leading-relaxed">
              Please do not refresh this page or click back. We are preparing your secure checkout portal.
            </p>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="flex justify-center text-red-500">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#166D74]">Setup Failed</h3>
            <p className="font-sans text-xs text-red-800 bg-red-50/50 p-3.5 border-l-2 border-red-500 text-left leading-relaxed rounded-r-xl">
              {error}
            </p>
            <div className="pt-2 flex flex-col items-stretch">
              <Button 
                onClick={() => router.push('/book')}
                variant="primary"
                className="w-full"
              >
                Restart Booking Process
              </Button>
            </div>
          </div>
        )}

        <div 
          className="pt-4 flex items-center justify-center gap-1.5 font-sans text-[10px] uppercase tracking-wider" 
          style={{ color: '#88949B', borderTop: '1px solid rgba(64,192,192,0.12)' }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: '#40C0C0' }} />
          PCI-DSS Compliant 256-bit Encryption
        </div>
      </SectionReveal>
    </BackgroundWrapper>
  );
}

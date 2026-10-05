import { Suspense } from 'react';
import PaymentSuccess from '../../../views/PaymentSuccess';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#166D74]">Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}

import { Suspense } from 'react';
import Blog from '../../views/Blog';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#166D74]">Loading...</div>}>
      <Blog />
    </Suspense>
  );
}

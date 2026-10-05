import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-serif text-2xl text-gray-800">404 - Panel Path Not Found</h2>
      <p className="text-gray-500 font-sans text-xs mt-1 mb-4">Verify link address coordinates.</p>
      <Link href="/" className="px-4 py-2 bg-teal-600 text-white rounded text-xs font-bold">
        Back to Dashboard
      </Link>
    </div>
  );
}

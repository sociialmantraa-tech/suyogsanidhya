import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full pt-40 pb-20 text-center space-y-4">
      <h2 className="font-serif text-3xl">404 - Page Not Found</h2>
      <p className="text-secondaryText font-sans text-sm">We couldn't find the page you were looking for.</p>
      <Link href="/" className="btn-primary py-2 px-6 text-xs inline-block">
        Back Home
      </Link>
    </div>
  );
}

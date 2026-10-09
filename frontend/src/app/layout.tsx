import type { Metadata } from 'next';
import '../index.css';
import { PublicDataProvider } from '../context/PublicDataContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloating from '../components/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'Abhay Harpale — Relationship & Intimacy Consultant',
  description: 'Confidential relationship and intimacy guidance for individuals and couples seeking deeper connection and lasting change.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PublicDataProvider>
          <div className="flex flex-col min-h-screen relative">
            <Header />
            <main className="flex-grow overflow-hidden pt-24 lg:pt-28">
              {children}
            </main>
            <Footer />
            <WhatsAppFloating />
          </div>
        </PublicDataProvider>
      </body>
    </html>
  );
}

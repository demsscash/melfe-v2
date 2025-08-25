// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MELHFA - Voiles Mauritaniens Premium',
    template: '%s | MELHFA'
  },
  description: 'Découvrez l\'art mauritanien à travers nos voiles d\'exception, alliant tradition ancestrale et élégance contemporaine. Boutique en ligne de melhfa premium.',
  keywords: [
    'melhfa',
    'voile mauritanien',
    'melhfa traditionnelle',
    'mode mauritanienne',
    'artisanat mauritanien',
    'melhfa premium',
    'boutique en ligne mauritanie',
    'nouakchott',
    'voile africain'
  ],
  authors: [{ name: 'MELHFA' }],
  creator: 'MELHFA',
  publisher: 'MELHFA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://melhfa.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'MELHFA',
    title: 'MELHFA - Voiles Mauritaniens Premium',
    description: 'Découvrez l\'art mauritanien à travers nos voiles d\'exception, alliant tradition ancestrale et élégance contemporaine.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MELHFA - Voiles Mauritaniens Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MELHFA - Voiles Mauritaniens Premium',
    description: 'Découvrez l\'art mauritanien à travers nos voiles d\'exception, alliant tradition ancestrale et élégance contemporaine.',
    images: ['/images/twitter-image.jpg'],
    creator: '@melhfa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" className={cn(inter.variable, 'scroll-smooth')}>
      <head>
        {/* Preconnect pour optimiser les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/melhfa-hero.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-white font-sans antialiased',
          inter.className
        )}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded-md z-50"
        >
          Aller au contenu principal
        </a>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Scripts for analytics, etc. */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                    `,
                  }}
                />
              </>
            )}

            {/* Facebook Pixel */}
            {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                    fbq('track', 'PageView');
                  `,
                }}
              />
            )}
          </>
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClothingStore',
              name: 'MELHFA',
              description: 'Boutique en ligne de voiles mauritaniens premium et accessoires traditionnels',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://melhfa.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://melhfa.com'}/images/logo.png`,
              image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://melhfa.com'}/images/og-image.jpg`,
              telephone: '+222 XX XX XX XX',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Nouakchott',
                addressLocality: 'Nouakchott',
                addressCountry: 'MR'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '18.0735',
                longitude: '-15.9582'
              },
              sameAs: [
                'https://facebook.com/melhfa',
                'https://instagram.com/melhfa',
                'https://twitter.com/melhfa'
              ],
              paymentAccepted: ['Carte de crédit', 'Virement bancaire', 'Espèces'],
              currenciesAccepted: 'MRU',
              areaServed: 'Mauritanie'
            })
          }}
        />
      </body>
    </html>
  );
}
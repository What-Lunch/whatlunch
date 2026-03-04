import type { Metadata } from 'next';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/shared/components/layout/Header';
import Main from '@/shared/components/layout/Main';
import Footer from '@/shared/components/layout/Footer';
import TanstackProvider from '@/shared/context/TanstackProvider';

import GlobalToast from '@/shared/components/Toast/GlobalToast';
import GoogleProvider from '@/shared/components/Providers/GoogleProvider';
import ThemeProvider from '@/shared/components/Providers/ThemeProvider';

import '@/styles/main.scss';

export const metadata: Metadata = {
  metadataBase: new URL('https://whatlunch.vercel.app'),
  title: {
    default: '오늘 뭐먹지?',
    template: '%s | 오늘 뭐먹지?',
  },
  description: '매일 반복되는 점심 고민, 룰렛으로 해결하세요.',
  icons: {
    icon: '/icons/what-lunch-logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '오늘 뭐먹지?',
  },
  verification: {
    google: 'rVM_MIY-s1O8jHppWwtcmjWxs2e1x3uH7jrUtBRNJfk',
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      {process.env.NODE_ENV === 'development' ? (
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      ) : null}

      <body>
        <ThemeProvider>
          <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
            integrity="sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <GoogleProvider>
            <TanstackProvider>
              <Header />
              <Main>{children}</Main>
              <Footer />
            </TanstackProvider>
            <GlobalToast />
          </GoogleProvider>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}

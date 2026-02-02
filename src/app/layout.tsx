import type { Metadata } from 'next';
import Header from '@/shared/components/layout/Header';
import Main from '@/shared/components/layout/Main';
import TanstackProvider from '@/shared/context/TanstackProvider';

import GlobalToast from '@/shared/components/Toast/GlobalToast';
import GoogleProvider from '@/shared/components/Providers/GoogleProvider';
// import ClientWarmup from './ClientWarmup';

import '@/styles/main.scss';

export const metadata: Metadata = {
  title: '오늘 뭐먹지?',
  icons: {
    icon: '/icons/what-lunch-logo.svg',
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ko">
      {process.env.NODE_ENV === 'development' ? (
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      ) : null}

      <body>
        <GoogleProvider>
          <TanstackProvider>
            {/* <ClientWarmup /> */}
            <Header />
            <Main>{children}</Main>
          </TanstackProvider>
          <GlobalToast />
        </GoogleProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import Header from '@/components/common/Header';

import '@/styles/main.scss';

export const metadata: Metadata = {
  title: '오늘 뭐먹지?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {process.env.NODE_ENV === 'development' ? (
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      ) : null}

      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

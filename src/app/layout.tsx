import type { Metadata } from 'next';
import HeaderLayout from '@/shared/components/layout/HeaderLayout';
import Main from '@/shared/components/layout/Main';
import '@/styles/main.scss';

export const metadata: Metadata = {
  title: '오늘 뭐먹지?',
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
        <HeaderLayout />
        <Main>{children}</Main>
      </body>
    </html>
  );
}

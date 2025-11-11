import type { Metadata } from 'next';
import './globals.scss';

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
      <body>{children}</body>
    </html>
  );
}

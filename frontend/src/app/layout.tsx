import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProviders } from '@/lib/auth/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'nico-cal - シンプルな日記アプリ',
  description: 'シンプルなデザインを特徴とする個人向け日記サービス',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProviders>{children}</AuthProviders>
      </body>
    </html>
  );
}

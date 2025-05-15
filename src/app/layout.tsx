import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import LayoutClient from './layout-client';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WebMatcher - Connect with Web Professionals',
  description: 'Find the best designers and developers for your web projects, or showcase your skills to find exciting opportunities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          'min-h-screen bg-background font-sans antialiased flex flex-col'
        )}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}




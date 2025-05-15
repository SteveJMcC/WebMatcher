'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { Header } from '@/components/global/header';
import { Footer } from '@/components/global/footer';
import { Toaster } from '@/components/ui/toaster';

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <Toaster />
    </AuthProvider>
  );
}

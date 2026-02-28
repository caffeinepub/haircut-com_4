import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import Footer from './Footer';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <Toaster richColors position="top-right" />
    </div>
  );
}

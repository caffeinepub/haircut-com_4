import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Calendar, Rss, Wallet, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Home, label: 'home' },
  { to: '/bookings', icon: Calendar, label: 'bookings' },
  { to: '/feed', icon: Rss, label: 'feed' },
  { to: '/wallet', icon: Wallet, label: 'wallet' },
  { to: '/profile', icon: User, label: 'profile' },
];

export function BottomNav() {
  const { t } = useApp();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive ? 'text-gold-500' : 'text-muted-foreground'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all duration-200',
                isActive ? 'bg-gold-500/15' : ''
              )}>
                <Icon className={cn('w-5 h-5', isActive ? 'stroke-[2.5]' : 'stroke-[1.5]')} />
              </div>
              <span className={cn('text-[10px] font-medium', isActive ? 'font-semibold' : '')}>{t(tab.label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

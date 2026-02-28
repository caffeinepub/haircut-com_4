import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'image' | 'salon-card' | 'post-card';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ variant = 'card', count = 1, className }: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (variant === 'salon-card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className={cn('rounded-2xl overflow-hidden bg-card border border-border', className)}>
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'post-card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className={cn('rounded-2xl overflow-hidden bg-card border border-border p-4 space-y-3', className)}>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'text') {
    return (
      <>
        {items.map((_, i) => (
          <Skeleton key={i} className={cn('h-4 w-full', className)} />
        ))}
      </>
    );
  }

  if (variant === 'circle') {
    return (
      <>
        {items.map((_, i) => (
          <Skeleton key={i} className={cn('h-12 w-12 rounded-full', className)} />
        ))}
      </>
    );
  }

  if (variant === 'image') {
    return (
      <>
        {items.map((_, i) => (
          <Skeleton key={i} className={cn('h-48 w-full rounded-xl', className)} />
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((_, i) => (
        <div key={i} className={cn('rounded-2xl p-4 space-y-3 bg-card border border-border', className)}>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </>
  );
}

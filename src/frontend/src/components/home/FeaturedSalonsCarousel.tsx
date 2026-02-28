import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Star, MapPin } from 'lucide-react';
import { useFeaturedSalons } from '../../hooks/useQueries';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { Badge } from '@/components/ui/badge';
import { Salon } from '../../types';
import { cn } from '@/lib/utils';

export function FeaturedSalonsCarousel() {
  const { data: salons, isLoading } = useFeaturedSalons();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonLoader variant="salon-card" count={4} />
      </div>
    );
  }

  if (!salons || salons.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No featured salons available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {salons.map(salon => (
        <SalonMiniCard key={salon.id} salon={salon} />
      ))}
    </div>
  );
}

function SalonMiniCard({ salon }: { salon: Salon }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate({ to: '/salon/$salonId', params: { salonId: salon.id } })}
      className="group text-left rounded-2xl overflow-hidden bg-card border border-border card-hover shadow-card"
    >
      <div className="relative h-44 overflow-hidden">
        {salon.photos && salon.photos.length > 0 ? (
          <img
            src={salon.photos[0]}
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-3xl">✂️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className={cn('text-xs', salon.isOpen ? 'bg-green-500/90 text-white border-0' : 'bg-red-500/90 text-white border-0')}>
            {salon.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-gold-500 transition-colors">{salon.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{salon.city}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            <span className="text-xs font-semibold text-foreground">{salon.rating}</span>
            <span className="text-xs text-muted-foreground">({salon.reviewCount})</span>
          </div>
          <span className="text-xs font-medium text-gold-600 dark:text-gold-400">{salon.priceRange}</span>
        </div>
      </div>
    </button>
  );
}

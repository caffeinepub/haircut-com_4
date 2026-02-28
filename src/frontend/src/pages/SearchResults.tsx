import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchSalons } from '../hooks/useQueries';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Star, MapPin, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Salon, SalonCategory } from '../types';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { setPageTitle, setMetaDescription } from '../utils/seo';

const CATEGORIES: SalonCategory[] = ['Men', 'Women', 'Kids', 'Unisex'];

export function SearchResults() {
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || '';
  const initialCity = urlParams.get('city') || urlParams.get('location') || '';

  const [category, setCategory] = useState<string>(initialCategory);
  const [minRating, setMinRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [city, setCity] = useState(initialCity);

  const { data: salons, isLoading } = useSearchSalons({ category, minRating, openNow, city });

  useEffect(() => {
    const titleParts: string[] = [];
    if (category) titleParts.push(category);
    if (city) titleParts.push(`in ${city}`);
    const title = titleParts.length > 0
      ? `${titleParts.join(' ')} Salons - Haircut.com`
      : 'Browse Salons - Haircut.com';
    setPageTitle(title);
    setMetaDescription(`Find and book the best ${category || ''} salons ${city ? `in ${city}` : 'near you'} on Haircut.com.`);
  }, [category, city]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Search by city or pincode..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 h-11 rounded-xl">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Category</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategory('')}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                      category === ''
                        ? 'bg-gold-500 text-charcoal-900 border-gold-500'
                        : 'border-border text-muted-foreground hover:border-gold-400'
                    )}
                  >
                    All
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                        category === cat
                          ? 'bg-gold-500 text-charcoal-900 border-gold-500'
                          : 'border-border text-muted-foreground hover:border-gold-400'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-3 block">Min Rating: {minRating}+</Label>
                <Slider
                  value={[minRating]}
                  onValueChange={([v]) => setMinRating(v)}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Open Now</Label>
                <Switch checked={openNow} onCheckedChange={setOpenNow} />
              </div>
              <Button
                onClick={() => {
                  setCategory('');
                  setMinRating(0);
                  setOpenNow(false);
                  setCity('');
                }}
                variant="outline"
                className="w-full rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setCategory('')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all flex-shrink-0',
            category === ''
              ? 'bg-gold-500 text-charcoal-900 border-gold-500'
              : 'border-border text-muted-foreground hover:border-gold-400'
          )}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all flex-shrink-0',
              category === cat
                ? 'bg-gold-500 text-charcoal-900 border-gold-500'
                : 'border-border text-muted-foreground hover:border-gold-400'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader variant="salon-card" count={6} />
        </div>
      ) : salons?.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-semibold text-foreground">No salons found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search in a different area.</p>
          <Button
            onClick={() => { setCategory(''); setMinRating(0); setOpenNow(false); setCity(''); }}
            variant="outline"
            className="rounded-xl"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salons?.map(salon => (
            <SalonCard
              key={salon.id}
              salon={salon}
              onSelect={() => navigate({ to: '/salon/$salonId', params: { salonId: salon.id } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SalonCard({ salon, onSelect }: { salon: Salon; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="group text-left rounded-2xl overflow-hidden bg-card border border-border hover:border-gold-400/50 transition-all shadow-sm hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        {salon.photos && salon.photos.length > 0 ? (
          <img
            src={salon.photos[0]}
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-4xl">✂️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className={cn('text-xs', salon.isOpen ? 'bg-green-500/90 text-white border-0' : 'bg-red-500/90 text-white border-0')}>
            {salon.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-gold-500 transition-colors">{salon.name}</h3>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{salon.address}, {salon.city}</span>
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

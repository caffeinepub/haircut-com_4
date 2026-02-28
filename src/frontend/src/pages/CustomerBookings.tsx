import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCustomerBookings } from '../hooks/useQueries';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  Accepted: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  Declined: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  Completed: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
  Cancelled: 'bg-muted text-muted-foreground border-border',
  'No-show': 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
};

export function CustomerBookings() {
  const { data: bookings, isLoading } = useCustomerBookings();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Bookings</h1>
      {isLoading ? (
        <div className="space-y-4"><SkeletonLoader variant="card" count={3} /></div>
      ) : bookings?.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-5xl">📅</div>
          <h3 className="text-lg font-semibold text-foreground">No bookings yet</h3>
          <p className="text-muted-foreground">Book your first salon appointment!</p>
          <Button onClick={() => navigate({ to: '/search' })} className="btn-gold rounded-xl">Find Salons</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map(booking => <BookingCard key={booking.id} booking={booking} />)}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const navigate = useNavigate();
  const canRebook = booking.status === 'Completed' || booking.status === 'Cancelled';

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{booking.salonName}</h3>
          <p className="text-sm text-muted-foreground">{booking.services.map(s => s.name).join(', ')}</p>
        </div>
        <Badge className={cn('text-xs flex-shrink-0', STATUS_STYLES[booking.status])}>
          {booking.status}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.timeSlot}</span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <span className="font-bold text-gold-600 dark:text-gold-400">₹{booking.totalAmount}</span>
        {canRebook && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate({ to: '/booking/$salonId', params: { salonId: booking.salonId } })}
            className="gap-1.5 rounded-xl text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Rebook
          </Button>
        )}
      </div>
    </div>
  );
}

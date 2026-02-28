import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
  useEffect(() => {
    document.title = 'Payment Successful - Haircut.com';
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card border border-border rounded-2xl p-10">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your booking has been confirmed. You'll receive a confirmation notification shortly.
          </p>
          <div className="space-y-3">
            <Link to="/bookings">
              <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                View My Bookings
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailure() {
  useEffect(() => {
    document.title = 'Payment Failed - Haircut.com';
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card border border-border rounded-2xl p-10">
          <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">Payment Failed</h1>
          <p className="text-muted-foreground mb-8">
            Your payment could not be processed. Please try again or use a different payment method.
          </p>
          <div className="space-y-3">
            <Link to="/search">
              <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                Browse Salons
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

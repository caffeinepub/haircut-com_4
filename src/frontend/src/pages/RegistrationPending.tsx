import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Clock, Home, CheckCircle } from 'lucide-react';

export function RegistrationPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gold-500/10 flex items-center justify-center">
            <Clock className="w-14 h-14 text-gold-500" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Registration Submitted!</h1>
          <p className="text-muted-foreground">
            Your salon registration is under review. Our team will verify your details and approve your listing within 24–48 hours.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3">
          <h3 className="font-semibold text-foreground">What happens next?</h3>
          <div className="space-y-2">
            {[
              'Our team reviews your salon details',
              'Verification of documents (if submitted)',
              'Approval notification sent to you',
              'Your salon goes live on Haircut.com',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gold-600">{i + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="w-4 h-4 text-gold-600" />
            <p className="text-sm font-medium text-gold-700 dark:text-gold-400">
              Estimated approval: 24–48 hours
            </p>
          </div>
        </div>

        <Button onClick={() => navigate({ to: '/' })} className="btn-gold w-full gap-2 rounded-xl">
          <Home className="w-4 h-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}

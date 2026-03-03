import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, CheckCircle, Home } from "lucide-react";
import React from "react";

export function BookingConfirmation() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked. You'll receive a
            confirmation shortly.
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono font-medium">
              #{Date.now().toString().slice(-8)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-green-600">Confirmed</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/bookings" })}
            className="flex-1 gap-2 rounded-xl"
          >
            <Calendar className="w-4 h-4" /> My Bookings
          </Button>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="btn-gold flex-1 gap-2 rounded-xl"
          >
            <Home className="w-4 h-4" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
}

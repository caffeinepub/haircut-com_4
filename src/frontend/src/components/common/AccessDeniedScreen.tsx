import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Home, ShieldX } from "lucide-react";
import React from "react";

export function AccessDeniedScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-destructive" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please contact an
            administrator if you believe this is an error.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/" })}
          className="btn-gold gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}

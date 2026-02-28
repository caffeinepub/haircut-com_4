import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

export function LoginButton({ variant = 'default', size = 'default', showText = true }: LoginButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isAuthenticated) {
    return (
      <Button variant="outline" size={size} onClick={handleAuth} className="gap-2">
        <LogOut className="w-4 h-4" />
        {showText && 'Logout'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      size={size}
      className="btn-gold gap-2"
    >
      {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      {showText && (isLoggingIn ? 'Logging in...' : 'Login')}
    </Button>
  );
}

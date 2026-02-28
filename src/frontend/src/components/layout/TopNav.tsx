import React from 'react';
import { Link } from '@tanstack/react-router';
import { Sun, Moon, Menu, Home, Scissors, BookOpen, HelpCircle, Mail, FileText, Shield, User, Info, Briefcase, Eye, Target, Wallet, Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useApp } from '../../contexts/AppContext';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useApp();
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
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const navLinks = [
    { to: '/' as const, label: language === 'hi' ? 'होम' : 'Home', icon: Home },
    { to: '/search' as const, label: language === 'hi' ? 'सैलून खोजें' : 'Browse Salons', icon: Scissors },
    { to: '/bookings' as const, label: language === 'hi' ? 'बुकिंग' : 'Bookings', icon: Calendar },
    { to: '/wallet' as const, label: language === 'hi' ? 'वॉलेट' : 'Wallet', icon: Wallet },
    { to: '/blog' as const, label: language === 'hi' ? 'ब्लॉग' : 'Blog', icon: BookOpen },
    { to: '/faq' as const, label: language === 'hi' ? 'सहायता' : 'FAQ', icon: HelpCircle },
    { to: '/contact' as const, label: language === 'hi' ? 'संपर्क' : 'Contact', icon: Mail },
    { to: '/about' as const, label: language === 'hi' ? 'हमारे बारे में' : 'About', icon: Info },
    { to: '/career' as const, label: language === 'hi' ? 'करियर' : 'Career', icon: Briefcase },
    { to: '/vision' as const, label: language === 'hi' ? 'विज़न' : 'Vision', icon: Eye },
    { to: '/mission' as const, label: language === 'hi' ? 'मिशन' : 'Mission', icon: Target },
    { to: '/terms' as const, label: language === 'hi' ? 'नियम' : 'Terms', icon: FileText },
    { to: '/privacy' as const, label: language === 'hi' ? 'गोपनीयता' : 'Privacy', icon: Shield },
    ...(isAuthenticated ? [{ to: '/profile' as const, label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile', icon: User }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-neutral-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo — gold/amber bold text */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-amber-500 tracking-tight">
            Haircut.com
          </span>
        </Link>

        {/* Right Controls: Sun | Login | Hamburger */}
        <div className="flex items-center gap-3">

          {/* Dark Mode Toggle — sun/moon icon */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-white hover:text-amber-500 transition-colors"
          >
            {theme === 'dark'
              ? <Sun className="h-5 w-5" />
              : <Moon className="h-5 w-5" />}
          </button>

          {/* Login / Logout — gold pill button */}
          <button
            type="button"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2 rounded-full text-sm transition-colors disabled:opacity-60"
          >
            {isLoggingIn
              ? (language === 'hi' ? 'लॉगिन...' : 'Logging in...')
              : isAuthenticated
                ? (language === 'hi' ? 'लॉगआउट' : 'Logout')
                : (language === 'hi' ? 'लॉगिन' : 'Login')}
          </button>

          {/* Hamburger Menu — opens side Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="p-2 rounded-full text-white hover:text-amber-500 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-black border-l border-neutral-800">
              <div className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <SheetClose asChild key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                      >
                        <Icon className="h-4 w-4 text-amber-500" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                <div className="border-t border-neutral-800 mt-2 pt-2">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-amber-500 hover:bg-amber-500/10 transition-colors w-full text-left"
                  >
                    🌐 {language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}

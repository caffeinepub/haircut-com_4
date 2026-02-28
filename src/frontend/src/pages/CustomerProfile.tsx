import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoginButton } from '../components/auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Copy, Check, Moon, Sun, Globe, Crown, User } from 'lucide-react';
import { toast } from 'sonner';
import { Gender } from '../types';

export function CustomerProfile() {
  const { language, setLanguage, t } = useApp();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState('Demo User');
  const [gender, setGender] = useState<Gender>('Male');
  const [address, setAddress] = useState('123, Main Street, New Delhi');
  const [copied, setCopied] = useState(false);

  // Dark mode managed locally
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const referralCode = 'HAIR' + (identity?.getPrincipal().toString().slice(0, 6).toUpperCase() || 'DEMO01');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success(t('common.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    toast.success(t('common.profile_updated'));
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-gold-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('login.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('login.subtitle')}</p>
          <LoginButton size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center text-3xl font-bold text-gold-600">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {identity.getPrincipal().toString().slice(0, 20)}...
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">{t('profile.personalInfo')}</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">{t('profile.fullName')}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">{t('profile.gender')}</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t('common.male')}</SelectItem>
                <SelectItem value="Female">{t('common.female')}</SelectItem>
                <SelectItem value="Kids">{t('common.kids')}</SelectItem>
                <SelectItem value="Unisex">{t('common.unisex')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">{t('profile.address')}</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} className="rounded-xl" />
          </div>
        </div>
        <Button onClick={handleSave} className="btn-gold w-full rounded-xl">
          {t('profile.saveChanges')}
        </Button>
      </div>

      {/* Referral Code */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-foreground">{t('profile.referralCode')}</h2>
        <p className="text-sm text-muted-foreground">
          Share your code and earn ₹100 for every friend who joins!
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gold-500/10 border border-gold-500/30 rounded-xl px-4 py-3 font-mono font-bold text-gold-600 dark:text-gold-400 text-lg tracking-widest">
            {referralCode}
          </div>
          <Button onClick={handleCopy} variant="outline" className="rounded-xl gap-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      {/* Membership */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-gold-500" />
          <h2 className="font-semibold text-foreground">{t('common.prime')} {t('common.membership')}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Get 20% off on all bookings, priority slots, and exclusive offers.
        </p>
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">
            Status: {t('wallet.primeInactive')}
          </span>
          <Button size="sm" className="btn-gold rounded-xl gap-1.5">
            <Crown className="w-3.5 h-3.5" /> {t('common.activatePrime')}
          </Button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">{t('common.settings')}</h2>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDarkMode
              ? <Moon className="w-5 h-5 text-gold-500" />
              : <Sun className="w-5 h-5 text-gold-500" />
            }
            <div>
              <p className="text-sm font-medium text-foreground">{t('profile.theme')}</p>
              <p className="text-xs text-muted-foreground">
                {isDarkMode ? t('profile.darkMode') : t('profile.lightMode')}
              </p>
            </div>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>

        <Separator />

        {/* Language Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gold-500" />
            <div>
              <p className="text-sm font-medium text-foreground">{t('profile.language')}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? t('common.english') : t('common.hindi')}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                language === 'en'
                  ? 'bg-gold-500 text-charcoal-900 border-gold-500'
                  : 'border-border text-muted-foreground hover:border-gold-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                language === 'hi'
                  ? 'bg-gold-500 text-charcoal-900 border-gold-500'
                  : 'border-border text-muted-foreground hover:border-gold-300'
              }`}
            >
              हि
            </button>
          </div>
        </div>
      </div>

      <div className="pb-4">
        <LoginButton variant="outline" size="lg" />
      </div>
    </div>
  );
}

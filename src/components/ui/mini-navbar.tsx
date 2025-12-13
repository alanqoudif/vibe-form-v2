"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter as useIntlRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Zap, Sun, Moon, Globe, ChevronDown, Menu, X, LogOut, User, Settings, CreditCard } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label={isDark ? (t('lightMode') || 'Switch to light mode') : (t('darkMode') || 'Switch to dark mode')}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover border-border text-xs">
          <p>{isDark ? (t('lightMode') || 'Light mode') : (t('darkMode') || 'Dark mode')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useIntlRouter();
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations('nav');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    router.replace(pathname, { locale: langCode as 'en' | 'ar' });
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg transition-all duration-200",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          isOpen && "bg-muted text-foreground"
        )}
        aria-label={t('language') || 'Language'}
        title={t('language') || 'Language'}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-xs font-medium">{locale}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-1 min-w-[120px] rounded-lg bg-popover border border-border shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "w-full px-3 py-2 text-sm text-left transition-colors",
                locale === lang.code 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground hover:bg-muted"
              )}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const ref = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations('nav');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuth();
    router.push('/');
    toast.success(t('signedOut') || 'Signed out successfully');
  };

  if (!user) return null;

  const initials = user.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-200",
          "hover:bg-muted",
          isOpen && "bg-muted"
        )}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-1 min-w-[200px] rounded-lg bg-popover border border-border shadow-lg z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user.full_name || 'User'}</p>
            {user.username && (
              <p className="text-xs text-muted-foreground truncate">{user.username}</p>
            )}
          </div>
          <div className="py-1">
            <Link 
              href="/forms" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              {t('forms')}
            </Link>
            <Link 
              href="/credits" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="w-4 h-4" />
              {user.credits_balance || 0} {t('credits')}
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              {t('settings')}
            </Link>
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface NavbarProps {
  variant?: 'default' | 'hero';
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  const isHero = variant === 'hero';
  
  // Navigation links - show for all users, but handle click for non-authenticated
  const navLinks = [
    { label: t('feed'), href: '/feed', requiresAuth: false },
    { label: t('forms'), href: '/forms', requiresAuth: true },
    { label: t('credits'), href: '/credits', requiresAuth: true },
  ];

  const isActivePath = (href: string) => {
    const cleanPath = pathname.replace(/^\/(en|ar)/, '');
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  const handleNavClick = (e: React.MouseEvent, link: { href: string; requiresAuth: boolean }) => {
    if (link.requiresAuth && !user) {
      e.preventDefault();
      toast.info(t('loginRequired') || 'Please log in to access this page');
      router.push(`/login?redirect=${link.href}`);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full",
      isHero 
        ? "bg-transparent" 
        : "bg-background/80 backdrop-blur-xl border-b border-border"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={cn(
              "w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center",
              "group-hover:scale-105 transition-transform"
            )}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className={cn(
              "font-display font-semibold text-lg hidden sm:block",
              isHero ? "text-white" : "text-foreground"
            )}>
              Vibe Form
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActivePath(link.href)
                    ? "bg-primary/10 text-primary"
                    : isHero 
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
            
            {!isLoading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link 
                      href="/login"
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium transition-colors",
                        isHero 
                          ? "text-white/80 hover:text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t('login')}
                    </Link>
                    <Link 
                      href="/signup"
                      className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {t('signup')}
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                isHero 
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={cn(
            "md:hidden py-4 border-t",
            isHero ? "border-white/10 bg-black/50 backdrop-blur-xl" : "border-border bg-background"
          )}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActivePath(link.href)
                      ? "bg-primary/10 text-primary"
                      : isHero
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {!user && (
                <div className="flex flex-col gap-2 pt-2 border-t border-border mt-2">
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center",
                      isHero 
                        ? "text-white hover:bg-white/10"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-purple-600 rounded-lg text-center"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

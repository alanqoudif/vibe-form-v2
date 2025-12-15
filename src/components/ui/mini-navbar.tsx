"use client";

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter as useIntlRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Globe, ChevronDown, Menu, X, LogOut, User, Settings, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useIntlRouter();
  const t = useTranslations('nav');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleLanguageChange = (langCode: string) => {
    router.replace(pathname, { locale: langCode as 'en' | 'ar' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-sm rounded-xl transition-all duration-300",
            "text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] justify-center sm:justify-start",
            "hover:bg-muted/80 active:scale-95 touch-manipulation",
            "border border-transparent hover:border-border/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "data-[state=open]:bg-muted data-[state=open]:text-foreground data-[state=open]:border-border/50"
          )}
          aria-label={t('language') || 'Language'}
        >
          <Globe className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="uppercase text-xs font-semibold tracking-wide">{locale}</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] rounded-xl border-border/50 shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "cursor-pointer transition-all duration-200 rounded-lg",
              locale === lang.code && "bg-primary/10 text-primary font-semibold"
            )}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const { user, clearAuth } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations('nav');

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-xl transition-all duration-300",
            "hover:bg-muted/80 active:scale-95 min-h-[44px] touch-manipulation",
            "border border-transparent hover:border-border/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "data-[state=open]:bg-muted data-[state=open]:border-border/50"
          )}
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/50 shadow-xl">
        <DropdownMenuLabel className="pb-3">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-semibold leading-none">{user.full_name || 'User'}</p>
            {user.username && (
              <p className="text-xs leading-none text-muted-foreground truncate">@{user.username}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem asChild className="rounded-lg transition-all duration-200">
          <Link href="/forms" className="flex items-center gap-3 cursor-pointer py-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">{t('forms')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg transition-all duration-200">
          <Link href="/credits" className="flex items-center gap-3 cursor-pointer py-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{t('credits')}</span>
              <span className="text-xs text-muted-foreground">{user.credits_balance || 0} available</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg transition-all duration-200">
          <Link href="/settings" className="flex items-center gap-3 cursor-pointer py-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">{t('settings')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer rounded-lg transition-all duration-200 py-2.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <span className="font-medium">{t('logout')}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NavbarProps {
  variant?: 'default' | 'hero';
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, isHydrated } = useAuthStore();
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
      "sticky top-0 z-50 w-full transition-all duration-300",
      isHero 
        ? "bg-transparent" 
        : "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm shadow-black/5"
    )}
    style={{
      paddingTop: "env(safe-area-inset-top)",
    }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group relative min-h-[44px] min-w-[44px] items-center justify-center sm:justify-start">
            <div className={cn(
              "relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden",
              "flex items-center justify-center shadow-lg shadow-primary/20",
              "group-hover:scale-110 group-active:scale-95 transition-all duration-300",
              "group-hover:shadow-xl group-hover:shadow-primary/30 touch-manipulation"
            )}>
              <Image
                src="/fonts/vibe form logo.png"
                alt="Vibe Form Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className={cn(
              "font-display font-bold text-lg sm:text-xl hidden sm:block transition-all duration-300",
              "bg-gradient-to-r bg-clip-text",
              isHero 
                ? "text-white group-hover:text-white/90" 
                : "text-transparent from-primary to-purple-600 group-hover:from-primary/90 group-hover:to-purple-600/90"
            )}>
              Vibe Form
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = isActivePath(link.href);
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={cn(
                    "relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                      : isHero 
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/50" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSelector />
            
            {/* Only show auth UI after client-side hydration to prevent mismatch */}
            {isHydrated && !isLoading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="hidden sm:flex items-center gap-2.5">
                    <Link 
                      href="/login"
                      className={cn(
                        "px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300",
                        "hover:scale-105 active:scale-95 min-h-[44px] flex items-center",
                        "border border-border/50 touch-manipulation",
                        isHero 
                          ? "text-white/90 hover:text-white hover:bg-white/10 hover:border-white/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      )}
                    >
                      {t('login')}
                    </Link>
                    <Link 
                      href="/signup"
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary via-primary to-purple-600 rounded-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 min-h-[44px] flex items-center touch-manipulation"
                    >
                      {t('signup')}
                    </Link>
                  </div>
                )}
              </>
            )}
            
            {/* Show placeholder while loading to prevent layout shift */}
            {(!isHydrated || isLoading) && (
              <div className="hidden sm:block w-[120px] h-10" />
            )}

            {/* Mobile Menu Button */}
            <button 
              className={cn(
                "md:hidden p-2.5 rounded-xl transition-all duration-300",
                "hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center",
                "border border-transparent hover:border-border/50 touch-manipulation",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isHero 
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-5 h-5">
                <Menu className={cn(
                  "absolute inset-0 w-5 h-5 transition-all duration-300",
                  isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                )} />
                <X className={cn(
                  "absolute inset-0 w-5 h-5 transition-all duration-300",
                  isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                )} />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className={cn(
            "py-3 sm:py-4 border-t",
            isHero 
              ? "border-white/10 bg-black/40 backdrop-blur-2xl" 
              : "border-border/50 bg-background/95 backdrop-blur-xl"
          )}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const isActive = isActivePath(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "relative px-4 py-3.5 sm:py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                      "active:scale-95 border border-transparent min-h-[44px] flex items-center touch-manipulation",
                      isActive
                        ? "bg-primary/15 text-primary border-primary/20 shadow-sm shadow-primary/10"
                        : isHero
                          ? "text-white/90 hover:text-white hover:bg-white/10 hover:border-white/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-border/50"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/50" />
                    )}
                  </Link>
                );
              })}
              
              {isHydrated && !isLoading && !user && (
                <div className="flex flex-col gap-2.5 pt-3 sm:pt-4 border-t border-border/50 mt-2">
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3.5 sm:py-3 text-sm font-semibold rounded-xl transition-all duration-300 text-center",
                      "active:scale-95 border min-h-[44px] flex items-center justify-center touch-manipulation",
                      isHero 
                        ? "text-white hover:bg-white/10 border-white/20"
                        : "text-foreground hover:bg-muted/70 border-border/50"
                    )}
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3.5 sm:py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary via-primary to-purple-600 rounded-xl text-center hover:opacity-90 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/25 min-h-[44px] flex items-center justify-center touch-manipulation"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

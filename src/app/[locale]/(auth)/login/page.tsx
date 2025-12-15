"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Zap, Sparkles, ArrowRight } from 'lucide-react';

function LoginPageContent() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  
  const supabase = createClient();

  // Check for pending prompt from homepage
  useEffect(() => {
    const stored = sessionStorage.getItem('pendingPrompt');
    if (stored) {
      setPendingPrompt(stored);
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(t('welcomeBack') || 'Welcome back!');
      
      // If there's a pending prompt, redirect to home to trigger form generation
      if (pendingPrompt) {
        router.push('/');
      } else {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      toast.error(t('genericError') || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md bg-card border-border backdrop-blur-xl relative z-10">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-foreground">Vibe Form</span>
          </Link>
          <CardTitle className="text-2xl font-display text-foreground">{t('login')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/signup" className="text-primary hover:text-primary/80">
              {t('signup')}
            </Link>
          </CardDescription>
        </CardHeader>
        
        {/* Show pending prompt if exists */}
        {pendingPrompt && (
          <div className="mx-6 mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">
                  {t('yourFormIdea') || 'Your form idea'}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">{pendingPrompt}</p>
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  {t('willCreateAfterLogin') || 'Will be created after you log in'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">{t('password')}</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('loading') || 'Loading...'}
                </>
              ) : (
                pendingPrompt ? (t('signInAndCreate') || 'Sign in & Create Form') : t('login')
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground text-center">
            {t('termsAgree')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

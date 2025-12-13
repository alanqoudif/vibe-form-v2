"use client";

import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/ui/mini-navbar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Bell,
  Globe,
  Shield,
  Mail,
  Save,
  Loader2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { user, isLoading: isAuthLoading, isHydrated } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  // Get email from auth session
  useEffect(() => {
    const getEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    getEmail();
  }, [supabase]);

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(t('saved') || 'Settings saved successfully');
      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(t('saveError') || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Wait for hydration before showing content
  if (!isHydrated || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-background" />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold vibe-gradient-text mb-2">
              {t('title') || 'Settings'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('description') || 'Manage your account settings and preferences'}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-xl shadow-lg shadow-primary/20">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('saving') || 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('save') || 'Save Changes'}
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="glass border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">{t('profile') || 'Profile'}</CardTitle>
                  <CardDescription>
                    {t('profileDescription') || 'Update your personal information'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('fullName') || 'Full Name'}</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder={t('fullNamePlaceholder') || 'Enter your full name'}
                    className="h-11 bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('username') || 'Username'}</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={t('usernamePlaceholder') || 'Enter your username'}
                    className="h-11 bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('email') || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 h-11 bg-muted/50 border-transparent"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {t('emailNote') || 'Email cannot be changed for security reasons'}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Notifications */}
            <Card className="glass border-border/50 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Bell className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-display">{t('notifications') || 'Notifications'}</CardTitle>
                    <CardDescription className="text-xs">
                      {t('notificationsDescription') || 'Manage how you receive alerts'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="cursor-pointer">{t('emailNotifications') || 'Email Alerts'}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('emailNotificationsDescription') || 'Receive updates via email'}
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="cursor-pointer">{t('pushNotifications') || 'Push Notifications'}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('pushNotificationsDescription') || 'Browser push notifications'}
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="glass border-border/50 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <Globe className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-display">{t('preferences') || 'Preferences'}</CardTitle>
                    <CardDescription className="text-xs">
                      {t('preferencesDescription') || 'Customize your experience'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                  <div className="space-y-0.5">
                    <Label>{t('language') || 'Language'}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('languageDescription') || 'Change interface language'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    English <ArrowUpRight className="w-3 h-3 opacity-50" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                  <div className="space-y-0.5">
                    <Label>{t('theme') || 'Theme'}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('themeDescription') || 'Appearance settings'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    System <ArrowUpRight className="w-3 h-3 opacity-50" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

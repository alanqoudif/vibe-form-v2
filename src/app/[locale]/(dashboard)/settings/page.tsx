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
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    let isMounted = true;

    const getEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted && session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    getEmail();

    return () => {
      isMounted = false;
    };
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
        <main className="container mx-auto px-4 py-8 max-w-4xl">
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              {t('title') || 'Settings'}
            </h1>
            <p className="text-muted-foreground">
              {t('description') || 'Manage your account settings and preferences'}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('profile') || 'Profile'}</CardTitle>
                  <CardDescription>
                    {t('profileDescription') || 'Update your personal information'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('fullName') || 'Full Name'}</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder={t('fullNamePlaceholder') || 'Enter your full name'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{t('username') || 'Username'}</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={t('usernamePlaceholder') || 'Enter your username'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email') || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 bg-muted"
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{t('notifications') || 'Notifications'}</CardTitle>
                    <CardDescription>
                      {t('notificationsDescription') || 'Manage how you receive alerts'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">{t('emailNotifications') || 'Email Alerts'}</Label>
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

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">{t('pushNotifications') || 'Push Notifications'}</Label>
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>{t('preferences') || 'Preferences'}</CardTitle>
                    <CardDescription>
                      {t('preferencesDescription') || 'Customize your experience'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('language') || 'Language'}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('languageDescription') || 'Change interface language'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    English
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('theme') || 'Theme'}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('themeDescription') || 'Appearance settings'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    System
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

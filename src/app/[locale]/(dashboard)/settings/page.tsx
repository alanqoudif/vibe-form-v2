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
  Moon, 
  Sun,
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
  const { user, isLoading: isAuthLoading } = useAuth();
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

  if (isAuthLoading) {
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {t('title') || 'Settings'}
          </h1>
          <p className="text-muted-foreground">
            {t('description') || 'Manage your account settings and preferences'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground">{t('profile') || 'Profile'}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('profileDescription') || 'Update your personal information'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="email">{t('email') || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 bg-muted/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('emailNote') || 'Email cannot be changed'}
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
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
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground">{t('notifications') || 'Notifications'}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('notificationsDescription') || 'Manage how you receive notifications'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">{t('emailNotifications') || 'Email Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('emailNotificationsDescription') || 'Receive notifications via email'}
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
                  <p className="text-sm text-muted-foreground">
                    {t('pushNotificationsDescription') || 'Receive browser push notifications'}
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
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground">{t('preferences') || 'Preferences'}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('preferencesDescription') || 'Customize your experience'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('language') || 'Language'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('languageDescription') || 'Change the interface language'}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/">{t('change') || 'Change'}</a>
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('theme') || 'Theme'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('themeDescription') || 'Switch between light and dark mode'}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/">{t('change') || 'Change'}</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground">{t('security') || 'Security'}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('securityDescription') || 'Manage your account security'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto">
                {t('changePassword') || 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


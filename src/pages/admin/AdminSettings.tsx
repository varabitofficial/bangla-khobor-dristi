
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Globe, Mail, Shield, Database } from 'lucide-react';

interface SiteSettings {
  site_name: string;
  site_description: string;
  site_url: string;
  logo_url: string;
  favicon_url: string;
  contact_email: string;
  social_facebook: string;
  social_twitter: string;
  social_youtube: string;
  enable_comments: boolean;
  enable_newsletter: boolean;
  maintenance_mode: boolean;
  posts_per_page: number;
  enable_ads: boolean;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  // Mock settings data - in a real app, this would come from a settings table
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'আমার সংবাদ',
    site_description: 'বাংলাদেশের প্রথম সারির অনলাইন সংবাদপত্র',
    site_url: 'https://example.com',
    logo_url: '',
    favicon_url: '',
    contact_email: 'contact@example.com',
    social_facebook: '',
    social_twitter: '',
    social_youtube: '',
    enable_comments: true,
    enable_newsletter: true,
    maintenance_mode: false,
    posts_per_page: 10,
    enable_ads: true,
  });

  const handleInputChange = (field: keyof SiteSettings, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to a settings table
    toast({
      title: "সফল",
      description: "সেটিংস সংরক্ষিত হয়েছে।",
    });
  };

  const { data: stats } = useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      const [postsCount, usersCount, commentsCount, categoriesCount] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);

      return {
        posts: postsCount.count || 0,
        users: usersCount.count || 0,
        comments: commentsCount.count || 0,
        categories: categoriesCount.count || 0,
      };
    },
  });

  return (
    <AdminLayout title="সেটিংস" breadcrumbItems={[{ label: "সেটিংস" }]}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            সাধারণ
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            কন্টেন্ট
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            সোশ্যাল
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            নিরাপত্তা
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>সাইটের তথ্য</CardTitle>
                <CardDescription>আপনার সাইটের মূল তথ্য পরিবর্তন করুন</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">সাইটের নাম</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_url">সাইটের URL</Label>
                    <Input
                      id="site_url"
                      value={settings.site_url}
                      onChange={(e) => handleInputChange('site_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description">সাইটের বিবরণ</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">লোগো URL</Label>
                    <Input
                      id="logo_url"
                      value={settings.logo_url}
                      onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">যোগাযোগের ইমেইল</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>সাইটের পরিসংখ্যান</CardTitle>
                <CardDescription>আপনার সাইটের বর্তমান অবস্থা</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats?.posts || 0}</div>
                    <div className="text-sm text-gray-600">পোস্ট</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats?.users || 0}</div>
                    <div className="text-sm text-gray-600">ইউজার</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats?.comments || 0}</div>
                    <div className="text-sm text-gray-600">মন্তব্য</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats?.categories || 0}</div>
                    <div className="text-sm text-gray-600">ক্যাটেগরি</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>কন্টেন্ট সেটিংস</CardTitle>
              <CardDescription>সাইটের কন্টেন্ট এবং ফিচার নিয়ন্ত্রণ করুন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="posts_per_page">প্রতি পেজে পোস্ট সংখ্যা</Label>
                <Input
                  id="posts_per_page"
                  type="number"
                  value={settings.posts_per_page}
                  onChange={(e) => handleInputChange('posts_per_page', parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>মন্তব্য সক্রিয়</Label>
                    <p className="text-sm text-gray-500">ইউজাররা পোস্টে মন্তব্য করতে পারবে</p>
                  </div>
                  <Switch
                    checked={settings.enable_comments}
                    onCheckedChange={(checked) => handleInputChange('enable_comments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>নিউজলেটার সক্রিয়</Label>
                    <p className="text-sm text-gray-500">ইউজাররা নিউজলেটার সাবস্ক্রাইব করতে পারবে</p>
                  </div>
                  <Switch
                    checked={settings.enable_newsletter}
                    onCheckedChange={(checked) => handleInputChange('enable_newsletter', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>বিজ্ঞাপন সক্রিয়</Label>
                    <p className="text-sm text-gray-500">সাইটে বিজ্ঞাপন দেখানো হবে</p>
                  </div>
                  <Switch
                    checked={settings.enable_ads}
                    onCheckedChange={(checked) => handleInputChange('enable_ads', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>সোশ্যাল মিডিয়া</CardTitle>
              <CardDescription>আপনার সোশ্যাল মিডিয়া লিংক যোগ করুন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social_facebook">ফেসবুক পেজ URL</Label>
                <Input
                  id="social_facebook"
                  value={settings.social_facebook}
                  onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_twitter">টুইটার প্রোফাইল URL</Label>
                <Input
                  id="social_twitter"
                  value={settings.social_twitter}
                  onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_youtube">ইউটিউব চ্যানেল URL</Label>
                <Input
                  id="social_youtube"
                  value={settings.social_youtube}
                  onChange={(e) => handleInputChange('social_youtube', e.target.value)}
                  placeholder="https://youtube.com/c/yourchannel"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>নিরাপত্তা ও রক্ষণাবেক্ষণ</CardTitle>
              <CardDescription>সাইটের নিরাপত্তা এবং রক্ষণাবেক্ষণ সেটিংস</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>রক্ষণাবেক্ষণ মোড</Label>
                  <p className="text-sm text-gray-500">সাইট অস্থায়ীভাবে বন্ধ করুন</p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                />
              </div>

              {settings.maintenance_mode && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ রক্ষণাবেক্ষণ মোড সক্রিয় থাকলে শুধুমাত্র অ্যাডমিনরা সাইট দেখতে পাবেন।
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium">দ্রুত ক্রিয়া</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    ক্যাশ পরিষ্কার করুন
                  </Button>
                  <Button variant="outline" className="justify-start">
                    ডাটাবেস অপ্টিমাইজ করুন
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          সেটিংস সংরক্ষণ করুন
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

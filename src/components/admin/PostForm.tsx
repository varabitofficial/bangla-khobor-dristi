
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface PostFormProps {
  post?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const PostForm = ({ post, onCancel, onSuccess }: PostFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    tags: '',
    is_featured: false,
    read_time: 5
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        category_id: post.category_id || '',
        tags: post.tags ? post.tags.join(', ') : '',
        is_featured: post.is_featured || false,
        read_time: post.read_time || 5
      });
    }
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const postData = {
        ...data,
        tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        author_id: user?.id
      };

      if (post) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "সফল!",
        description: post ? "পোস্ট আপডেট হয়েছে।" : "নতুন পোস্ট তৈরি হয়েছে।",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "ত্রুটি",
        description: "পোস্ট সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: "ত্রুটি",
        description: "সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? 'পোস্ট সম্পাদনা' : 'নতুন পোস্ট'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">শিরোনাম *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="পোস্টের শিরোনাম লিখুন"
              required
            />
          </div>

          <div>
            <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="পোস্টের সংক্ষিপ্ত বিবরণ"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">কন্টেন্ট *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="পোস্টের সম্পূর্ণ কন্টেন্ট"
              rows={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="featured_image">ফিচারড ইমেজ URL</Label>
            <Input
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="ইমেজের URL"
            />
          </div>

          <div>
            <Label htmlFor="category">ক্যাটেগরি *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">ট্যাগ (কমা দিয়ে আলাদা করুন)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="রাজনীতি, অর্থনীতি, ক্রীড়া"
            />
          </div>

          <div>
            <Label htmlFor="read_time">পড়ার সময় (মিনিট)</Label>
            <Input
              id="read_time"
              type="number"
              value={formData.read_time}
              onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
              min="1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: Boolean(checked) })}
            />
            <Label htmlFor="is_featured">ফিচারড পোস্ট</Label>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              বাতিল
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;

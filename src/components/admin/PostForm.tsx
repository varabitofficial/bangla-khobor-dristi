
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from './RichTextEditor';
import { ImageUpload } from './ImageUpload';
import { Save, Send } from 'lucide-react';

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
    read_time: 5,
    status: 'published' as 'draft' | 'published'
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
        read_time: post.read_time || 5,
        status: post.status || 'published'
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
        description: post ? "পোস্ট আপডেট হয়েছে।" : `পোস্ট ${formData.status === 'draft' ? 'ড্রাফট হিসেবে সেভ' : 'পাবলিশ'} হয়েছে।`,
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

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: "ত্রুটি",
        description: "সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }
    
    const dataToSave = { ...formData, status };
    saveMutation.mutate(dataToSave);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{post ? 'পোস্ট সম্পাদনা' : 'নতুন পোস্ট'}</span>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={saveMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              ড্রাফট সেভ
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={saveMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              পাবলিশ করুন
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
              <Input
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="পোস্টের সংক্ষিপ্ত বিবরণ"
              />
            </div>

            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="space-y-6">
            <ImageUpload
              currentImage={formData.featured_image}
              onImageUploaded={(url) => setFormData({ ...formData, featured_image: url })}
              label="ফিচারড ইমেজ"
            />

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

            <div className="pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="w-full"
              >
                বাতিল
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostForm;

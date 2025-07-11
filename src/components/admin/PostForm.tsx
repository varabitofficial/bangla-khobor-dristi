import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from './RichTextEditor';
import { ImageUpload } from './ImageUpload';
import { Save, Send, X, Plus } from 'lucide-react';

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
    is_featured: false,
    read_time: 5,
    status: 'published' as 'draft' | 'published'
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');

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

  const { data: subcategories } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*, categories(*)')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
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
        is_featured: post.is_featured || false,
        read_time: post.read_time || 5,
        status: post.status || 'published'
      });

      // Load existing categories, subcategories, and tags for the post
      if (post.id) {
        loadPostRelations(post.id);
      }
    }
  }, [post]);

  const loadPostRelations = async (postId: string) => {
    // Load categories
    const { data: postCategories } = await supabase
      .from('post_categories')
      .select('category_id')
      .eq('post_id', postId);
    
    if (postCategories) {
      setSelectedCategories(postCategories.map(pc => pc.category_id));
    }

    // Load subcategories
    const { data: postSubcategories } = await supabase
      .from('post_subcategories')
      .select('subcategory_id')
      .eq('post_id', postId);
    
    if (postSubcategories) {
      setSelectedSubcategories(postSubcategories.map(ps => ps.subcategory_id));
    }

    // Load tags
    const { data: postTags } = await supabase
      .from('post_tags')
      .select('tag_id')
      .eq('post_id', postId);
    
    if (postTags) {
      setSelectedTags(postTags.map(pt => pt.tag_id));
    }
  };

  const createNewTag = async (tagName: string) => {
    const slug = tagName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    const { data, error } = await supabase
      .from('tags')
      .insert([{ name: tagName, slug }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Attempting to save post with data:', data);
      console.log('Current user:', user);

      // Enhanced validation
      if (!user?.id) {
        throw new Error('ব্যবহারকারী লগ ইন করা নেই। দয়া করে আবার লগ ইন করুন।');
      }

      if (!data.title?.trim()) {
        throw new Error('পোস্টের শিরোনাম প্রয়োজন।');
      }

      if (!data.content?.trim()) {
        throw new Error('পোস্টের কন্টেন্ট প্রয়োজন।');
      }

      if (selectedCategories.length === 0) {
        throw new Error('অন্তত একটি ক্যাটেগরি নির্বাচন করুন।');
      }

      // Clean the data - we no longer need category_id and subcategory_id in posts table
      const postData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        featured_image: data.featured_image,
        is_featured: data.is_featured,
        read_time: data.read_time,
        status: data.status,
        author_id: user.id,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        // Keep the first selected category for backward compatibility
        category_id: selectedCategories[0] || null,
        subcategory_id: selectedSubcategories[0] || null
      };

      console.log('Final post data to save:', postData);

      let postId = post?.id;

      if (post) {
        console.log('Updating existing post:', post.id);
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        console.log('Creating new post');
        const { data: newPost, error } = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        postId = newPost.id;
        console.log('New post created with ID:', postId);
      }

      // Handle multiple categories
      if (postId) {
        console.log('Handling categories for post:', postId);
        // Remove existing categories
        const { error: deleteCategoriesError } = await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', postId);
        
        if (deleteCategoriesError) {
          console.error('Error deleting existing categories:', deleteCategoriesError);
        }

        // Add new categories
        if (selectedCategories.length > 0) {
          const categoryData = selectedCategories.map(categoryId => ({
            post_id: postId,
            category_id: categoryId
          }));
          
          console.log('Adding categories:', categoryData);
          const { error: categoryError } = await supabase
            .from('post_categories')
            .insert(categoryData);
          
          if (categoryError) {
            console.error('Category insert error:', categoryError);
            throw categoryError;
          }
        }

        // Handle multiple subcategories
        console.log('Handling subcategories for post:', postId);
        // Remove existing subcategories
        const { error: deleteSubcategoriesError } = await supabase
          .from('post_subcategories')
          .delete()
          .eq('post_id', postId);
        
        if (deleteSubcategoriesError) {
          console.error('Error deleting existing subcategories:', deleteSubcategoriesError);
        }

        // Add new subcategories
        if (selectedSubcategories.length > 0) {
          const subcategoryData = selectedSubcategories.map(subcategoryId => ({
            post_id: postId,
            subcategory_id: subcategoryId
          }));
          
          console.log('Adding subcategories:', subcategoryData);
          const { error: subcategoryError } = await supabase
            .from('post_subcategories')
            .insert(subcategoryData);
          
          if (subcategoryError) {
            console.error('Subcategory insert error:', subcategoryError);
            throw subcategoryError;
          }
        }

        // Handle tags
        console.log('Handling tags for post:', postId);
        // Remove existing tags
        const { error: deleteError } = await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', postId);
        
        if (deleteError) {
          console.error('Error deleting existing tags:', deleteError);
        }

        // Add new tags
        if (selectedTags.length > 0) {
          const tagData = selectedTags.map(tagId => ({
            post_id: postId,
            tag_id: tagId
          }));
          
          console.log('Adding tags:', tagData);
          const { error: tagError } = await supabase
            .from('post_tags')
            .insert(tagData);
          
          if (tagError) {
            console.error('Tag insert error:', tagError);
            throw tagError;
          }
        }
      }

      return postId;
    },
    onSuccess: () => {
      toast({
        title: "সফল!",
        description: post ? "পোস্ট আপডেট হয়েছে।" : `পোস্ট ${formData.status === 'draft' ? 'ড্রাফট হিসেবে সেভ' : 'পাবলিশ'} হয়েছে।`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Save post error:', error);
      const errorMessage = error?.message || error?.error_description || "পোস্ট সেভ করতে সমস্যা হয়েছে।";
      toast({
        title: "ত্রুটি",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (status: 'draft' | 'published') => {
    console.log('Submit triggered with status:', status);
    console.log('Form data:', formData);
    console.log('Selected categories:', selectedCategories);
    console.log('Selected subcategories:', selectedSubcategories);
    console.log('User:', user);

    // Client-side validation
    if (!user?.id) {
      toast({
        title: "ত্রুটি",
        description: "দয়া করে প্রথমে লগ ইন করুন।",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title?.trim() || !formData.content?.trim() || selectedCategories.length === 0) {
      toast({
        title: "ত্রুটি",
        description: "সকল প্রয়োজনীয় ফিল্ড পূরণ করুন। (শিরোনাম, কন্টেন্ট, ক্যাটেগরি)",
        variant: "destructive",
      });
      return;
    }
    
    const dataToSave = { ...formData, status };
    console.log('Calling mutation with:', dataToSave);
    saveMutation.mutate(dataToSave);
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createNewTag(newTagName.trim());
      setSelectedTags([...selectedTags, newTag.id]);
      setNewTagName('');
      toast({
        title: "সফল!",
        description: "নতুন ট্যাগ তৈরি হয়েছে।",
      });
      // Refetch tags to update the list
      window.location.reload();
    } catch (error) {
      console.error('Create tag error:', error);
      toast({
        title: "ত্রুটি",
        description: "ট্যাগ তৈরি করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Debug info
  console.log('Current user in PostForm:', user);
  console.log('Form validation state:', {
    hasTitle: !!formData.title?.trim(),
    hasContent: !!formData.content?.trim(),
    hasCategories: selectedCategories.length > 0,
    hasUser: !!user?.id
  });

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
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-2 text-xs rounded">
            <p>User ID: {user?.id || 'Not logged in'}</p>
            <p>Title: {formData.title ? 'Yes' : 'No'}</p>
            <p>Content: {formData.content ? 'Yes' : 'No'}</p>
            <p>Categories: {selectedCategories.length}</p>
            <p>Subcategories: {selectedSubcategories.length}</p>
          </div>
        )}

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
              <Label>ক্যাটেগরি নির্বাচন করুন *</Label>
              <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
                {categories?.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm">{category.name}</Label>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCategories.map((categoryId) => {
                  const category = categories?.find(c => c.id === categoryId);
                  return category ? (
                    <Badge key={categoryId} variant="secondary" className="text-xs">
                      {category.name}
                      <button
                        type="button"
                        onClick={() => toggleCategory(categoryId)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {subcategories && subcategories.length > 0 && (
              <div>
                <Label>সাবক্যাটেগরি নির্বাচন করুন</Label>
                <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subcategory-${subcategory.id}`}
                        checked={selectedSubcategories.includes(subcategory.id)}
                        onCheckedChange={() => toggleSubcategory(subcategory.id)}
                      />
                      <Label htmlFor={`subcategory-${subcategory.id}`} className="text-sm">
                        {subcategory.name} ({subcategory.categories?.name})
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSubcategories.map((subcategoryId) => {
                    const subcategory = subcategories?.find(s => s.id === subcategoryId);
                    return subcategory ? (
                      <Badge key={subcategoryId} variant="outline" className="text-xs">
                        {subcategory.name}
                        <button
                          type="button"
                          onClick={() => toggleSubcategory(subcategoryId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div>
              <Label>ট্যাগ নির্বাচন করুন</Label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="নতুন ট্যাগ"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddNewTag}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {tags?.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => toggleTag(tag.id)}
                      />
                      <Label htmlFor={tag.id} className="text-sm">{tag.name}</Label>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags?.find(t => t.id === tagId);
                    return tag ? (
                      <Badge key={tagId} variant="secondary" className="text-xs">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => toggleTag(tagId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
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


import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const SubcategoriesManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', parent_category_id: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: subcategories, isLoading } = useQuery({
    queryKey: ['admin-subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select(`
          *,
          categories (name)
        `)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingSubcategory) {
        const { error } = await supabase
          .from('subcategories')
          .update(data)
          .eq('id', editingSubcategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subcategories')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      toast({
        title: "সফল!",
        description: editingSubcategory ? "সাবক্যাটেগরি আপডেট হয়েছে।" : "নতুন সাবক্যাটেগরি তৈরি হয়েছে।",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "সাবক্যাটেগরি সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (subcategoryId: string) => {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      toast({
        title: "সফল!",
        description: "সাবক্যাটেগরি ডিলিট হয়েছে।",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "সাবক্যাটেগরি ডিলিট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', parent_category_id: '' });
    setEditingSubcategory(null);
    setShowForm(false);
  };

  const handleEdit = (subcategory: any) => {
    setFormData({ 
      name: subcategory.name, 
      slug: subcategory.slug,
      parent_category_id: subcategory.parent_category_id
    });
    setEditingSubcategory(subcategory);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.parent_category_id) {
      toast({
        title: "ত্রুটি",
        description: "সকল ফিল্ড পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">সাবক্যাটেগরি ম্যানেজমেন্ট</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          নতুন সাবক্যাটেগরি
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSubcategory ? 'সাবক্যাটেগরি সম্পাদনা' : 'নতুন সাবক্যাটেগরি'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="parent_category">প্যারেন্ট ক্যাটেগরি</Label>
                <Select
                  value={formData.parent_category_id}
                  onValueChange={(value) => setFormData({ ...formData, parent_category_id: value })}
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
                <Label htmlFor="name">নাম</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name)
                    });
                  }}
                  placeholder="সাবক্যাটেগরির নাম"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">স্লাগ</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="subcategory-slug"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  বাতিল
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>সকল সাবক্যাটেগরি</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">লোড হচ্ছে...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>প্যারেন্ট ক্যাটেগরি</TableHead>
                  <TableHead>স্লাগ</TableHead>
                  <TableHead>তৈরির তারিখ</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories?.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell className="font-medium">{subcategory.name}</TableCell>
                    <TableCell>{subcategory.categories?.name}</TableCell>
                    <TableCell>{subcategory.slug}</TableCell>
                    <TableCell>
                      {new Date(subcategory.created_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(subcategory)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(subcategory.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubcategoriesManagement;

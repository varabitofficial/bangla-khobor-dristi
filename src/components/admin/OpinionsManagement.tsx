
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Opinion = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author_name: string;
  author_role: string | null;
  author_image: string | null;
  created_at: string;
  updated_at: string;
};

const OpinionsManagement = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingOpinion, setEditingOpinion] = useState<Opinion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author_name: '',
    author_role: '',
    author_image: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: opinions, isLoading } = useQuery({
    queryKey: ['admin-opinions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opinions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Opinion[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const opinionData = {
        ...data,
        created_by: user?.id
      };

      if (editingOpinion) {
        const { error } = await supabase
          .from('opinions')
          .update(opinionData)
          .eq('id', editingOpinion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('opinions')
          .insert([opinionData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-opinions'] });
      toast({
        title: "সফল!",
        description: editingOpinion ? "মতামত আপডেট হয়েছে।" : "নতুন মতামত তৈরি হয়েছে।",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "মতামত সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (opinionId: string) => {
      const { error } = await supabase
        .from('opinions')
        .delete()
        .eq('id', opinionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-opinions'] });
      toast({
        title: "সফল!",
        description: "মতামত ডিলিট হয়েছে।",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "মতামত ডিলিট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author_name: '',
      author_role: '',
      author_image: ''
    });
    setEditingOpinion(null);
    setShowForm(false);
  };

  const handleEdit = (opinion: Opinion) => {
    setFormData({
      title: opinion.title,
      excerpt: opinion.excerpt || '',
      content: opinion.content,
      author_name: opinion.author_name,
      author_role: opinion.author_role || '',
      author_image: opinion.author_image || ''
    });
    setEditingOpinion(opinion);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author_name) {
      toast({
        title: "ত্রুটি",
        description: "শিরোনাম, কন্টেন্ট এবং লেখকের নাম প্রয়োজন।",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">মতামত ও বিশ্লেষণ ম্যানেজমেন্ট</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          নতুন মতামত
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingOpinion ? 'মতামত সম্পাদনা' : 'নতুন মতামত'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">শিরোনাম *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="মতামতের শিরোনাম"
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="মতামতের সংক্ষিপ্ত বিবরণ"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="content">কন্টেন্ট *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="মতামতের বিস্তারিত কন্টেন্ট"
                  rows={6}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author_name">লেখকের নাম *</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="লেখকের নাম"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author_role">লেখকের পদবী</Label>
                  <Input
                    id="author_role"
                    value={formData.author_role}
                    onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                    placeholder="যেমন: অর্থনীতিবিদ, রাজনৈতিক বিশ্লেষক"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="author_image">লেখকের ছবির URL</Label>
                <Input
                  id="author_image"
                  value={formData.author_image}
                  onChange={(e) => setFormData({ ...formData, author_image: e.target.value })}
                  placeholder="লেখকের ছবির URL"
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
          <CardTitle>সকল মতামত</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">লোড হচ্ছে...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>লেখক</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opinions?.map((opinion) => (
                  <TableRow key={opinion.id}>
                    <TableCell className="font-medium">{opinion.title}</TableCell>
                    <TableCell>{opinion.author_name}</TableCell>
                    <TableCell>
                      {new Date(opinion.created_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(opinion)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(opinion.id)}
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

export default OpinionsManagement;

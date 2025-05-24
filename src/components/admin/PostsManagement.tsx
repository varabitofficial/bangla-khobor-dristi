
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PostForm from './PostForm';

const PostsManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "সফল!",
        description: "পোস্ট ডিলিট হয়েছে।",
      });
    },
    onError: (error) => {
      toast({
        title: "ত্রুটি",
        description: "পোস্ট ডিলিট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (showForm) {
    return (
      <PostForm
        post={editingPost}
        onCancel={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          setEditingPost(null);
          queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 flex-1 max-w-lg">
          <Input
            placeholder="পোস্ট খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="স্ট্যাটাস" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল পোস্ট</SelectItem>
              <SelectItem value="published">পাবলিশড</SelectItem>
              <SelectItem value="draft">ড্রাফট</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          নতুন পোস্ট
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল পোস্ট ({filteredPosts.length})</CardTitle>
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
                  <TableHead>ক্যাটেগরি</TableHead>
                  <TableHead>ভিউ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.profiles?.full_name}</TableCell>
                    <TableCell>{post.categories?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.view_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Badge 
                          variant={post.status === 'published' ? 'default' : 'secondary'}
                        >
                          {post.status === 'published' ? 'পাবলিশড' : 'ড্রাফট'}
                        </Badge>
                        {post.is_featured && (
                          <Badge variant="outline">ফিচারড</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPost(post);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePost.mutate(post.id)}
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

export default PostsManagement;

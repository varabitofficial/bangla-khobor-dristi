
import { useState, useEffect } from 'react';
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
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail: string | null;
  view_count: number | null;
  created_at: string;
  published_at: string | null;
};

// Function to extract YouTube video ID and generate thumbnail
const getYouTubeThumbnail = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
};

const VideosManagement = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-generate thumbnail when video URL changes
  useEffect(() => {
    if (formData.video_url && !formData.thumbnail) {
      const autoThumbnail = getYouTubeThumbnail(formData.video_url);
      if (autoThumbnail) {
        setFormData(prev => ({ ...prev, thumbnail: autoThumbnail }));
      }
    }
  }, [formData.video_url, formData.thumbnail]);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Video[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const videoData = {
        ...data,
        author_id: user?.id,
        published_at: new Date().toISOString()
      };

      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingVideo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "সফল!",
        description: editingVideo ? "ভিডিও আপডেট হয়েছে।" : "নতুন ভিডিও তৈরি হয়েছে।",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "ভিডিও সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "সফল!",
        description: "ভিডিও ডিলিট হয়েছে।",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "ভিডিও ডিলিট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail: ''
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      thumbnail: video.thumbnail || ''
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.video_url) {
      toast({
        title: "ত্রুটি",
        description: "শিরোনাম এবং ভিডিও URL প্রয়োজন।",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">ভিডিও ম্যানেজমেন্ট</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          নতুন ভিডিও
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVideo ? 'ভিডিও সম্পাদনা' : 'নতুন ভিডিও'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">শিরোনাম *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ভিডিওর শিরোনাম"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ভিডিওর বিবরণ"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="video_url">ভিডিও URL *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="YouTube ভিডিও URL"
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">থাম্বনেইল URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="থাম্বনেইল URL (YouTube থেকে স্বয়ংক্রিয় হবে)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  YouTube ভিডিওর জন্য থাম্বনেইল স্বয়ংক্রিয়ভাবে তৈরি হবে
                </p>
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
          <CardTitle>সকল ভিডিও</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">লোড হচ্ছে...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>থাম্বনেইল</TableHead>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>ভিউ</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos?.map((video) => {
                  const thumbnail = video.thumbnail || getYouTubeThumbnail(video.video_url);
                  
                  return (
                    <TableRow key={video.id}>
                      <TableCell>
                        <img 
                          src={thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80&h=45&fit=crop"}
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.view_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(video.created_at).toLocaleDateString('bn-BD')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(video.video_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(video)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(video.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideosManagement;

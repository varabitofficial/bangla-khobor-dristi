
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  onImageSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export const ImageGallery = ({ onImageSelect, trigger }: ImageGalleryProps) => {
  const [open, setOpen] = useState(false);

  const { data: images, isLoading } = useQuery({
    queryKey: ['uploaded-images'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('post-images')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      return data?.map(file => {
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(file.name);
        return {
          name: file.name,
          url: urlData.publicUrl,
          created_at: file.created_at
        };
      }) || [];
    },
    enabled: open,
  });

  const handleImageSelect = (url: string) => {
    onImageSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ImageIcon className="w-4 h-4 mr-2" />
            গ্যালারি থেকে নির্বাচন করুন
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>ইমেজ গ্যালারি</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">লোড হচ্ছে...</span>
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {images.map((image) => (
                <div
                  key={image.name}
                  className="relative cursor-pointer group"
                  onClick={() => handleImageSelect(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg border hover:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      নির্বাচন করুন
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              কোনো ইমেজ পাওয়া যায়নি
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

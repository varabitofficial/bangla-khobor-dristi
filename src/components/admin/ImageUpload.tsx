
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export const ImageUpload = ({ onImageUploaded, currentImage, label = "ইমেজ আপলোড" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (120KB = 120 * 1024 bytes)
      const maxSize = 120 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "ফাইল সাইজ বেশি",
          description: "ইমেজ সাইজ ১২০ KB এর কম হতে হবে।",
          variant: "destructive",
        });
        return;
      }

      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "ভুল ফাইল টাইপ",
          description: "শুধুমাত্র ইমেজ ফাইল আপলোড করুন।",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      setPreviewUrl(data.publicUrl);
      onImageUploaded(data.publicUrl);

      toast({
        title: "সফল!",
        description: "ইমেজ আপলোড হয়েছে।",
      });

    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "ইমেজ আপলোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>ইমেজ নির্বাচন করুন</span>
              </div>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            সর্বোচ্চ সাইজ: ১২০ KB
          </p>
        </div>
      )}
      
      {uploading && (
        <p className="text-sm text-center text-blue-600">আপলোড হচ্ছে...</p>
      )}
    </div>
  );
};

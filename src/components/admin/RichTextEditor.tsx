
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Palette
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { ImageGallery } from './ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const RichTextEditor = ({ value, onChange, label = "কন্টেন্ট" }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   prefix + selectedText + suffix + 
                   value.substring(end);
    
    onChange(newText);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const insertImage = (imageUrl: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const imageMarkdown = `![ইমেজ](${imageUrl})`;
    const newText = value.substring(0, start) + imageMarkdown + value.substring(end);
    
    onChange(newText);
    setShowImageDialog(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertText('*', '*') },
    { icon: Underline, label: 'Underline', action: () => insertText('<u>', '</u>') },
    { icon: Heading1, label: 'Heading 1', action: () => insertText('# ') },
    { icon: Heading2, label: 'Heading 2', action: () => insertText('## ') },
    { icon: Heading3, label: 'Heading 3', action: () => insertText('### ') },
    { icon: List, label: 'Bullet List', action: () => insertText('- ') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertText('1. ') },
  ];

  const colorOptions = [
    { name: 'লাল', value: '#ef4444' },
    { name: 'নীল', value: '#3b82f6' },
    { name: 'সবুজ', value: '#10b981' },
    { name: 'হলুদ', value: '#f59e0b' },
    { name: 'বেগুনি', value: '#8b5cf6' },
    { name: 'কালো', value: '#000000' },
  ];

  return (
    <div className="space-y-4">
      <Label>{label} *</Label>
      
      {/* Toolbar */}
      <div className="border rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.label}
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}
        
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="ইমেজ যোগ করুন">
              <Image className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ইমেজ যোগ করুন</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">নতুন আপলোড</TabsTrigger>
                <TabsTrigger value="gallery">গ্যালারি থেকে নির্বাচন</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-4">
                <ImageUpload onImageUploaded={insertImage} />
              </TabsContent>
              <TabsContent value="gallery" className="space-y-4">
                <ImageGallery 
                  onImageSelect={insertImage}
                  trigger={
                    <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400">
                      <p className="text-gray-600">গ্যালারি থেকে ইমেজ নির্বাচন করতে ক্লিক করুন</p>
                    </div>
                  }
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <div className="flex items-center space-x-1">
          <Palette className="w-4 h-4 text-gray-600" />
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: color.value }}
              onClick={() => insertText(`<span style="color: ${color.value}">`, '</span>')}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="আপনার কন্টেন্ট লিখুন..."
        className="min-h-[300px] rounded-t-none border-t-0"
        required
      />

      {/* Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <Label className="text-sm font-medium mb-2 block">প্রিভিউ:</Label>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: value
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/^# (.*$)/gm, '<h1>$1</h1>')
              .replace(/^## (.*$)/gm, '<h2>$1</h2>')
              .replace(/^### (.*$)/gm, '<h3>$1</h3>')
              .replace(/^- (.*$)/gm, '<li>$1</li>')
              .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
              .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
              .replace(/\n/g, '<br>')
          }}
        />
      </div>
    </div>
  );
};

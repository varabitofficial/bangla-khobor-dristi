
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Download } from 'lucide-react';

const NewsletterManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteSubscriber = useMutation({
    mutationFn: async (subscriberId: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-newsletter'] });
      toast({
        title: "সফল!",
        description: "সাবস্ক্রাইবার ডিলিট হয়েছে।",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি",
        description: "সাবস্ক্রাইবার ডিলিট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const exportSubscribers = () => {
    if (!subscribers || subscribers.length === 0) {
      toast({
        title: "কোন ডেটা নেই",
        description: "এক্সপোর্ট করার জন্য কোন সাবস্ক্রাইবার নেই।",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ['Email', 'Subscription Date'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString('en-US')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "সফল!",
      description: "সাবস্ক্রাইবার তালিকা ডাউনলোড হয়েছে।",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">নিউজলেটার সাবস্ক্রাইবার</h2>
        <Button onClick={exportSubscribers} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          এক্সপোর্ট CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল সাবস্ক্রাইবার ({subscribers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">লোড হচ্ছে...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>সাবস্ক্রিপশনের তারিখ</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers?.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      {new Date(subscriber.created_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSubscriber.mutate(subscriber.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default NewsletterManagement;

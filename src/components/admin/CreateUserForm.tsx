
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface CreateUserFormData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export const CreateUserForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateUserFormData>();
  
  const selectedRole = watch('role');

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setLoading(true);

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        user_metadata: {
          full_name: data.fullName,
        },
        email_confirm: true, // Skip email confirmation for admin-created users
      });

      if (authError) {
        throw authError;
      }

      // Update the user's role in profiles table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: data.role,
            full_name: data.fullName 
          })
          .eq('id', authData.user.id);

        if (profileError) {
          throw profileError;
        }
      }

      toast({
        title: "সফল!",
        description: "নতুন ইউজার সফলভাবে তৈরি হয়েছে।",
      });

      reset();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: error.message || "ইউজার তৈরি করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">পূর্ণ নাম</Label>
        <Input
          id="fullName"
          {...register('fullName', { required: 'পূর্ণ নাম প্রয়োজন' })}
          placeholder="ইউজারের পূর্ণ নাম"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">ইমেইল</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'ইমেইল প্রয়োজন',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'সঠিক ইমেইল ঠিকানা দিন'
            }
          })}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">পাসওয়ার্ড</Label>
        <Input
          id="password"
          type="password"
          {...register('password', { 
            required: 'পাসওয়ার্ড প্রয়োজন',
            minLength: {
              value: 6,
              message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
            }
          })}
          placeholder="কমপক্ষে ৬ অক্ষর"
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>ইউজার রোল</Label>
        <Select onValueChange={(value: UserRole) => setValue('role', value)} value={selectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="রোল নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reader">রিডার</SelectItem>
            <SelectItem value="editor">এডিটর</SelectItem>
            <SelectItem value="admin">অ্যাডমিন</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-600">রোল নির্বাচন করুন</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'তৈরি হচ্ছে...' : 'ইউজার তৈরি করুন'}
      </Button>
    </form>
  );
};

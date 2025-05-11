
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/context/auth-context';
import { SignupFormSchema, type SignupFormData } from "@/lib/schemas";
import { UserPlus, Mail, User as UserIcon } from 'lucide-react'; 
import Link from 'next/link';


export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const typeFromQuery = searchParams.get('userType');
  const initialUserType = (typeFromQuery === 'designer' || typeFromQuery === 'user') ? typeFromQuery : 'user';

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: '',
      displayName: '',
      userType: initialUserType,
    },
  });

  useEffect(() => {
    const typeFromQuery = searchParams.get('userType');
    if (typeFromQuery === 'designer' || typeFromQuery === 'user') {
      form.setValue('userType', typeFromQuery);
    }
  }, [searchParams, form]);


  function onSubmit(data: SignupFormData) {
    login(data.userType, data.email.trim(), data.displayName.trim()); 
    
    if (data.userType === 'designer') {
      router.push('/designer/setup-profile');
    } else {
      router.push('/user/setup-profile');
    }
  }

  const watchedUserType = form.watch('userType');

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join WebMatcher and start connecting today!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="Enter your email address" {...field} className="pl-10 text-base py-3" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="text" placeholder="Choose a public display name" {...field} className="pl-10 text-base py-3" />
                      </FormControl>
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">This name will be visible to other users.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Sign up as</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="user" id="user" />
                          </FormControl>
                          <Label htmlFor="user" className="font-normal">Client (Looking for talent)</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                           <FormControl>
                            <RadioGroupItem value="designer" id="designer" />
                          </FormControl>
                          <Label htmlFor="designer" className="font-normal">Web Pro (Offering services)</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href={`/login?userType=${watchedUserType}`}>Log in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}


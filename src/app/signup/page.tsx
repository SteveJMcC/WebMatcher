"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthMock();
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState<'user' | 'designer'>('user'); // Default to 'user'
  const [error, setError] = useState('');

  useEffect(() => {
    const typeFromQuery = searchParams.get('userType');
    if (typeFromQuery === 'designer' || typeFromQuery === 'user') {
      setUserType(typeFromQuery);
    }
  }, [searchParams]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
     if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    setError('');
    login(userType, username.trim()); // This sets profileSetupComplete to false
    
    if (userType === 'designer') {
      router.push('/designer/setup-profile');
    } else {
      router.push('/user/setup-profile');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join WebConnect and start connecting today!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sign up as</Label>
              <RadioGroup
                value={userType} // Controlled component
                onValueChange={(value: 'user' | 'designer') => setUserType(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="font-normal">Client (Looking for talent)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="designer" id="designer" />
                  <Label htmlFor="designer" className="font-normal">Designer (Offering services)</Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              {/* Pass userType back to login if maintaining context */}
              <Link href={`/login?userType=${userType}`}>Log in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

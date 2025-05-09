"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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
    // If typeFromQuery is null or invalid, userType remains the default 'user'
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    setError('');
    // The userType state is now determined by the query param (or default)
    login(userType, username.trim()); 
    router.push(userType === 'designer' ? '/designer-dashboard' : '/user-dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your WebConnect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-base"
              />
            </div>
            
            {/* RadioGroup for selecting user type has been removed as per request */}

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              {/* Pass userType to signup if maintaining context, or let signup handle selection */}
              <Link href={`/signup?userType=${userType}`}>Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

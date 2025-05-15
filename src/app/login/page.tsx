'use client';
export const dynamic = 'force-dynamic';


import { useState, type FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { LogIn, Mail, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

type LoginStep = 'roleSelection' | 'emailInput';
type UserRole = 'user' | 'designer';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loginStep, setLoginStep] = useState<LoginStep>('emailInput');
  const [currentUserType, setCurrentUserType] = useState<UserRole>('user');
  const [cameFromRoleSelection, setCameFromRoleSelection] = useState(false);

  useEffect(() => {
    const typeFromQuery = searchParams.get('userType') as UserRole | null;
    if (typeFromQuery && (typeFromQuery === 'user' || typeFromQuery === 'designer')) {
      setCurrentUserType(typeFromQuery);
      setLoginStep('emailInput');
      setCameFromRoleSelection(false);
    } else {
      setLoginStep('roleSelection');
      setCameFromRoleSelection(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = loginStep === 'roleSelection'
        ? "Login - Select Role | WebMatcher"
        : `Login as ${currentUserType === 'designer' ? 'Web Professional' : 'Client'} | WebMatcher`;
    }
  }, [loginStep, currentUserType]);

  const handleRoleSelection = (selectedType: UserRole) => {
    setCurrentUserType(selectedType);
    setLoginStep('emailInput');
    setEmail('');
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email cannot be empty.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');

    login(currentUserType, email.trim());

    const redirectPath = searchParams.get('redirect');
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push(currentUserType === 'designer' ? '/designer-dashboard' : '/user-dashboard');
    }
  };

  if (loginStep === 'roleSelection') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Login to WebMatcher</CardTitle>
            <CardDescription>Are you a Client or a Web Professional?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleRoleSelection('user')}
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            >
              <User className="mr-2 h-5 w-5" /> Login as Client
            </Button>
            <Button
              onClick={() => handleRoleSelection('designer')}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 text-lg py-6"
            >
              <Briefcase className="mr-2 h-5 w-5" /> Login as Web Professional
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" asChild className="p-0 text-primary">
                <Link href="/signup">Sign up</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome to WebMatcher!</CardTitle>
          <CardDescription>
            Log in to your {currentUserType === 'designer' ? 'Web Professional' : 'Client'} account.
            {cameFromRoleSelection && (
              <Button
                variant="link"
                onClick={() => {
                  setLoginStep('roleSelection');
                  setEmail('');
                  setError('');
                }}
                className="p-0 ml-1 text-sm text-primary hover:underline"
              >
                (Change role)
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 text-base py-3"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
              Log In as {currentUserType === 'designer' ? 'Web Pro' : 'Client'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href={`/signup?userType=${currentUserType}`}>
                Sign up as {currentUserType === 'designer' ? 'Web Pro' : 'Client'}
              </Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// ✅ Export a Suspense-wrapped version


export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginPage />
    </Suspense>
  );
}



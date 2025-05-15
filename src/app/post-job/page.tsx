'use client';
export const dynamic = 'force-dynamic';


import { JobPostingForm } from "@/components/forms/job-posting-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


export default function PostJobPage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Post a Job - WebMatcher";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/post-job&userType=user');
      } else if (userType !== 'user') {
        router.push('/designer-dashboard'); 
      } else if (!profileSetupComplete) {
        router.push('/user/setup-profile?redirect=/post-job'); 
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  if (authIsLoading || (!authIsLoading && (!isAuthenticated || userType !== 'user' || !profileSetupComplete))) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
        <div className="max-w-2xl mx-auto space-y-8">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <JobPostingForm />
    </div>
  );
}


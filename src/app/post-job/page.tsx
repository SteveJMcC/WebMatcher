"use client";

import { JobPostingForm } from "@/components/forms/job-posting-form";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Metadata for client components needs different handling
// export const metadata: Metadata = {
//   title: "Post a Job - WebConnect",
//   description: "Submit your project details and find skilled web designers on WebConnect.",
// };

export default function PostJobPage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Post a Job - WebConnect";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/post-job');
      } else if (userType !== 'user') {
        router.push('/designer-dashboard'); // Designers can't post jobs
      } else if (!profileSetupComplete) {
        router.push('/user/setup-profile?redirect=/post-job'); // Profile not complete
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  if (authIsLoading) {
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

  if (!isAuthenticated || userType !== 'user' || !profileSetupComplete) {
    // Content shown while redirecting
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Verifying access or redirecting...</p>
      </div>
    );
  }
  
  // User is authenticated, is a 'user', and profile is complete
  return (
    <div className="container mx-auto px-4 py-12">
      <JobPostingForm />
    </div>
  );
}

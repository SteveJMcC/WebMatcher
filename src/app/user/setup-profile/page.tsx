"use client";

import { UserProfileForm } from "@/components/forms/user-profile-form";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Note: Metadata export like this is for Server Components.
// For client components, you'd typically use `useEffect` to set document.title
// or a higher-order component if using a library for metadata management.
// For simplicity in this mock setup, we'll leave it, but it won't be applied dynamically
// by Next.js in the same way as for a server component.
// export const metadata: Metadata = {
//   title: "Setup Client Profile - WebConnect",
//   description: "Complete your client profile to start posting jobs on WebConnect.",
// };

export default function SetupUserProfilePage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Setup Client Profile - WebConnect";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/user/setup-profile');
      } else if (userType !== 'user') {
        router.push('/'); // Not a client, redirect to home or relevant dashboard
      } else if (profileSetupComplete) {
        router.push('/user-dashboard'); // Profile already set up
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  if (authIsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
        <div className="max-w-lg mx-auto space-y-8">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'user' || profileSetupComplete) {
    // This content will be briefly shown while redirecting or if stuck.
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }
  
  if (userType === 'user' && !profileSetupComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <UserProfileForm />
      </div>
    );
  }

  // Fallback, should ideally not be reached if logic above is correct
  return (
     <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
                You do not have permission to view this page or an error occurred.
            </AlertDescription>
        </Alert>
     </div>
  );
}

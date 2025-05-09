
"use client";

import { UserProfileForm } from "@/components/forms/user-profile-form";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { Metadata } from "next"; // Metadata is for server components primarily
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


export default function SetupUserProfilePage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        // Update title based on whether profile is being set up or updated
        document.title = profileSetupComplete ? "Update Client Profile - WebConnect" : "Setup Client Profile - WebConnect";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/user/setup-profile');
      } else if (userType !== 'user') {
        router.push('/'); // Not a client, redirect to home or relevant dashboard
      }
      // Removed: else if (profileSetupComplete) { router.push('/user-dashboard'); }
      // Now users can access this page to update their profile even if it's complete.
      // The UserProfileForm will need to handle whether it's an initial setup or an update.
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

  if (!isAuthenticated || userType !== 'user') {
    // This content will be briefly shown while redirecting or if stuck.
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }
  
  // User is authenticated and is a 'user'. They can set up or update profile.
  return (
    <div className="container mx-auto px-4 py-12">
      <UserProfileForm />
    </div>
  );
}

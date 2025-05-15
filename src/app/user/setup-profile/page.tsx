'use client';
export const dynamic = 'force-dynamic';


import { UserProfileForm } from "@/components/forms/user-profile-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


export default function SetupUserProfilePage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = (profileSetupComplete && userType === 'user') ? "Update Client Profile - WebMatcher" : "Setup Client Profile - WebMatcher";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/user/setup-profile&userType=user');
      } else if (userType !== 'user') {
        router.push('/'); 
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  if (authIsLoading || (!authIsLoading && (!isAuthenticated || userType !== 'user'))) {
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <UserProfileForm />
    </div>
  );
}


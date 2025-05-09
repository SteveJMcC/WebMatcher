"use client";

import { DesignerProfileForm } from "@/components/forms/designer-profile-form";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Metadata for client components is typically handled differently (e.g., useEffect for document.title)
// export const metadata: Metadata = {
//   title: "Setup Designer Profile - WebConnect",
//   description: "Create or update your designer profile to showcase your skills and attract clients on WebConnect.",
// };

export default function SetupDesignerProfilePage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
     if (typeof document !== 'undefined') {
        document.title = profileSetupComplete ? "Update Designer Profile - WebConnect" : "Setup Designer Profile - WebConnect";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/designer/setup-profile');
      } else if (userType !== 'designer') {
        router.push('/'); // Not a designer, redirect to home or relevant dashboard for their type
      }
      // If profile is complete, they can still access this page to *update* it.
      // No redirect here if profileSetupComplete is true, form handles text change.
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  if (authIsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
        <div className="max-w-3xl mx-auto space-y-8">
            <Skeleton className="h-32 w-32 mx-auto rounded-full mb-4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || userType !== 'designer') {
     // This content will be briefly shown while redirecting or if stuck.
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }
  
  // Allow access for designers to set up or update their profile
  return (
    <div className="container mx-auto px-4 py-12">
      <DesignerProfileForm />
    </div>
  );
}

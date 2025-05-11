"use client";

import { DesignerProfileForm } from "@/components/forms/designer-profile-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SetupDesignerProfilePage() {
  const { isAuthenticated, userType, isLoading: authIsLoading, profileSetupComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
     if (typeof document !== 'undefined') {
        document.title = (profileSetupComplete && userType === 'designer') ? "Update Designer Profile - WebMatcher" : "Setup Designer Profile - WebMatcher";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/designer/setup-profile&userType=designer');
      } else if (userType !== 'designer') {
        router.push('/'); 
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  if (authIsLoading || (!authIsLoading && (!isAuthenticated || userType !== 'designer'))) {
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <DesignerProfileForm />
    </div>
  );
}


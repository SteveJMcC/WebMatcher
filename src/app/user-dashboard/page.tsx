"use client";

import { UserJobList } from "@/components/features/user-job-list";
import type { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


// Mock data fetching function - keep async for potential future real API
async function getUserJobs(userId: string): Promise<JobPosting[]> {
  // In a real app, fetch jobs for the logged-in user
  console.log("Fetching jobs for user ID:", userId); // For debugging
  return [
    {
      id: "job-1",
      userId: userId, // Use actual userId
      title: "E-commerce Platform Redesign",
      description: "Looking for a skilled designer to revamp our existing e-commerce website. Focus on modern UI, improved UX, and mobile responsiveness. We need someone proficient in Figma and understanding of current e-commerce trends.",
      budget: 3500, 
      skillsRequired: [{id:"ui", text:"UI Design"}, {id:"ux", text:"UX Design"}, {id:"figma", text:"Figma"}, {id:"e-commerce", text:"E-commerce"}],
      limitContacts: 15,
      createdAt: new Date('2023-10-01T10:00:00.000Z').toISOString(),
      status: "open",
      bidsCount: 5,
    },
    {
      id: "job-2",
      userId: userId,
      title: "Mobile App Splash Screens",
      description: "Need a set of creative and engaging splash screens for our new mobile application. Theme is futuristic and minimalist.",
      budget: 550, 
      skillsRequired: [{id:"graphic-design", text:"Graphic Design"}, {id:"illustration", text:"Illustration"}, {id:"mobile-app-design", text:"Mobile App Design"}],
      createdAt: new Date('2023-09-15T14:30:00.000Z').toISOString(),
      status: "in-progress",
      bidsCount: 3,
    },
  ];
}

// Metadata for client components
// export const metadata: Metadata = {
//   title: "My Jobs - Client Dashboard | WebConnect",
//   description: "Manage your job postings and view applications on WebConnect.",
// };

export default function UserDashboardPage() {
  const { isAuthenticated, userType, userId: authUserId, isLoading: authIsLoading, profileSetupComplete } = useAuthMock();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
     if (typeof document !== 'undefined') {
        document.title = "My Jobs - Client Dashboard | WebConnect";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/user-dashboard');
      } else if (userType !== 'user') {
        router.push('/'); // Or designer dashboard if that's more appropriate
      } else if (!profileSetupComplete) {
        router.push('/user/setup-profile?redirect=/user-dashboard');
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  useEffect(() => {
    // Fetch data only if authorized and profile is complete
    if (isAuthenticated && userType === 'user' && profileSetupComplete && authUserId) {
      setPageLoading(true);
      getUserJobs(authUserId).then(data => {
        setJobs(data);
        setPageLoading(false);
      }).catch(error => {
        console.error("Failed to fetch user jobs:", error);
        setPageLoading(false);
        // Optionally, show a toast or error message
      });
    } else if (!authIsLoading) {
        // If auth checks fail and not already loading auth state, stop page loading.
        setPageLoading(false);
    }
  }, [isAuthenticated, userType, profileSetupComplete, authUserId, authIsLoading]); // authIsLoading dependency ensures we wait for auth state

  if (authIsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <Skeleton className="h-16 w-1/2" />
            <Skeleton className="h-12 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'user' || !profileSetupComplete) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Verifying access or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center">
            <LayoutDashboard className="mr-3 h-10 w-10" /> Client Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Manage your job postings and view designer bids.</p>
        </div>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/post-job">
            <PlusCircle className="mr-2 h-5 w-5" /> Post a New Job
          </Link>
        </Button>
      </div>
      
      {pageLoading ? (
        <div>
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <UserJobList jobs={jobs} />
      )}
    </div>
  );
}

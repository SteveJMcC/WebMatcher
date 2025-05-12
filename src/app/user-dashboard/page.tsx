
"use client";

import { UserJobList } from "@/components/features/user-job-list";
import type { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function getUserJobs(userId: string): Promise<JobPosting[]> {
  console.log("Fetching jobs for user ID:", userId);
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `userJobs_${userId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        const parsedJobs = JSON.parse(jobsString) as JobPosting[];
        // Sort jobs by creation date, newest first
        return parsedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (error) {
      console.error("Failed to get user jobs from localStorage", error);
      return []; // Return empty array on error
    }
  }
  return []; // Return empty array if localStorage is not available or no jobs found
}


export default function UserDashboardPage() {
  const { isAuthenticated, userType, userId: authUserId, isLoading: authIsLoading, profileSetupComplete, displayName } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
     if (typeof document !== 'undefined') {
        document.title = `My Jobs - ${displayName || 'Client'} Dashboard | WebMatcher`;
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/user-dashboard&userType=user');
      } else if (userType !== 'user') {
        router.push('/'); 
      } else if (!profileSetupComplete) {
        router.push('/user/setup-profile?redirect=/user-dashboard');
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router, displayName]);

  useEffect(() => {
    if (isAuthenticated && userType === 'user' && profileSetupComplete && authUserId) {
      setPageLoading(true);
      getUserJobs(authUserId).then(data => {
        setJobs(data);
        setPageLoading(false);
      }).catch(error => {
        console.error("Failed to fetch user jobs:", error);
        setPageLoading(false);
      });
    } else if (!authIsLoading) { // If auth is done loading and conditions not met
        setPageLoading(false); // Stop page loading indicator
    }
  }, [isAuthenticated, userType, profileSetupComplete, authUserId, authIsLoading]);

  if (authIsLoading || (!authIsLoading && (!isAuthenticated || userType !== 'user' || !profileSetupComplete))) {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="mb-4 sm:mb-0">
            <div className="flex items-center">
                <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                    {displayName ? `${displayName} | Dashboard` : 'Client Dashboard'}
                </h1>
            </div>
            {displayName && (
                <p className="text-md text-muted-foreground pl-11">
                    Client
                </p>
            )}
            <p className="text-lg text-muted-foreground mt-1">Manage your job postings and view designer bids.</p>
        </div>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/post-job">
            <PlusCircle className="mr-2 h-5 w-5" /> Post a New Job
          </Link>
        </Button>
      </div>
      
      {pageLoading ? ( // This state is for job data loading, not auth loading
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



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
        router.push('/'); 
      } else if (!profileSetupComplete) {
        router.push('/user/setup-profile?redirect=/user-dashboard');
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

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
    } else if (!authIsLoading) {
        setPageLoading(false);
    }
  }, [isAuthenticated, userType, profileSetupComplete, authUserId, authIsLoading]);

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

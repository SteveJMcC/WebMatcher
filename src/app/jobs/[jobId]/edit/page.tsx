
"use client";

import { JobPostingForm } from "@/components/forms/job-posting-form";
import { useAuth } from "@/context/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Briefcase } from "lucide-react";
import type { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getJobById(jobId: string, userId: string): Promise<JobPosting | null> {
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `userJobs_${userId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        const parsedJobs = JSON.parse(jobsString) as JobPosting[];
        const job = parsedJobs.find(j => j.id === jobId);
        return job || null;
      }
    } catch (error) {
      console.error("Failed to get job from localStorage", error);
    }
  }
  return null;
}

export default function EditJobPage() {
  const { isAuthenticated, userType, userId: authUserId, isLoading: authIsLoading, profileSetupComplete } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [jobToEdit, setJobToEdit] = useState<JobPosting | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = jobToEdit ? `Edit Job: ${jobToEdit.title} - WebConnect` : "Edit Job - WebConnect";
    }
  }, [jobToEdit]);

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/jobs/${jobId}/edit&userType=user`);
      } else if (userType !== 'user') {
        router.push('/designer-dashboard'); 
      } else if (!profileSetupComplete) {
        router.push(`/user/setup-profile?redirect=/jobs/${jobId}/edit`);
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router, jobId]);

  useEffect(() => {
    if (isAuthenticated && userType === 'user' && profileSetupComplete && authUserId && jobId) {
      setPageLoading(true);
      setError(null);
      getJobById(jobId, authUserId)
        .then(data => {
          if (data) {
            setJobToEdit(data);
          } else {
            setError("Job not found or you don't have permission to edit it.");
          }
          setPageLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch job for editing:", err);
          setError("Failed to load job details. Please try again.");
          setPageLoading(false);
        });
    } else if (!authIsLoading) {
      // If auth is done and conditions aren't met (e.g., not logged in as client)
      // The other useEffect will handle redirection, so we can just ensure loading stops.
      setPageLoading(false);
    }
  }, [isAuthenticated, userType, profileSetupComplete, authUserId, jobId, authIsLoading]);

  if (authIsLoading || pageLoading) {
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

  if (error) {
     return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Job</AlertTitle>
            <AlertDescription>
            {error}
            </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
            <Link href="/user-dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  if (!jobToEdit && !pageLoading && !error) { // Case: Job not found after loading finished
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Alert className="max-w-lg mx-auto">
            <Briefcase className="h-4 w-4" />
            <AlertTitle>Job Not Found</AlertTitle>
            <AlertDescription>
                The job you are trying to edit could not be found. It might have been deleted or you may not have permission to access it.
            </AlertDescription>
        </Alert>
         <Button asChild className="mt-6">
            <Link href="/user-dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <JobPostingForm jobToEdit={jobToEdit} />
    </div>
  );
}

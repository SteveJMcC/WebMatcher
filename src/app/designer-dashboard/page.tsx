
"use client";

import { DesignerJobList } from "@/components/features/designer-job-list";
import type { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, Search, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DesignerJobDetailPanel } from "@/components/features/designer-job-detail-panel";

// Mock data fetching functions
async function getMatchedJobs(designerId: string): Promise<JobPosting[]> {
  console.log("Fetching matched jobs for designer ID (all open jobs for now):", designerId);
  if (typeof window === 'undefined') {
    return [];
  }

  let allUserJobs: JobPosting[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('userJobs_')) {
        const jobsString = localStorage.getItem(key);
        if (jobsString) {
          const parsedJobs = JSON.parse(jobsString) as JobPosting[];
          allUserJobs.push(...parsedJobs.map(job => ({
            ...job,
            // Ensure applicants array exists for older job postings
            applicants: job.applicants || [] 
          })));
        }
      }
    }
    // Filter for open jobs and sort by creation date
    const openJobs = allUserJobs
      .filter(job => job.status === 'open')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return openJobs;
  } catch (error) {
    console.error("Failed to get matched jobs from localStorage", error);
    return [];
  }
}

async function getGeneralJobs(): Promise<JobPosting[]> {
    console.log("Fetching general jobs (currently returns empty as matched jobs show all open jobs)");
    // This function can be expanded later to fetch jobs that are not "matched"
    // if a specific matching algorithm is implemented for getMatchedJobs.
    // For now, returning an empty array as getMatchedJobs fetches all open jobs.
    return [];
}


export default function DesignerDashboardPage() {
  const { isAuthenticated, userType, userId: authDesignerId, isLoading: authIsLoading, profileSetupComplete, designerTokens, displayName } = useAuth();
  const router = useRouter();

  const [matchedJobs, setMatchedJobs] = useState<JobPosting[]>([]);
  const [generalJobs, setGeneralJobs] = useState<JobPosting[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = `${displayName ? displayName + "'s" : 'Web Professional'} Dashboard - My Opportunities | WebConnect`;
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/designer-dashboard&userType=designer');
      } else if (userType !== 'designer') {
        router.push('/'); 
      } else if (!profileSetupComplete) {
        router.push('/designer/setup-profile?redirect=/designer-dashboard');
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router, displayName]);

  useEffect(() => {
    if (isAuthenticated && userType === 'designer' && profileSetupComplete && authDesignerId) {
      setPageLoading(true);
      setSelectedJob(null); 
      Promise.all([
        getMatchedJobs(authDesignerId),
        getGeneralJobs()
      ]).then(([matched, general]) => {
        setMatchedJobs(matched);
        setGeneralJobs(general);
        setPageLoading(false);
      }).catch(error => {
        console.error("Failed to fetch designer jobs:", error);
        setPageLoading(false);
      });
    } else if (!authIsLoading) { 
        setPageLoading(false); 
    }
  }, [isAuthenticated, userType, profileSetupComplete, authDesignerId, authIsLoading]);

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const mockDesignerStats = {
    profileViews: 156,
    activeApplications: selectedJob?.applicants?.length || 0, // Example: show applicants for selected job or a general count
    tokensRemaining: designerTokens ?? 0, 
  };

  if (authIsLoading || (!authIsLoading && (!isAuthenticated || userType !== 'designer' || !profileSetupComplete))) {
    return (
       <div className="container mx-auto px-4 py-12 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
                <Skeleton className="h-16 w-3/5" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="md:col-span-1 h-96 w-full" />
                <Skeleton className="md:col-span-2 h-96 w-full" />
            </div>
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex items-center">
                <LayoutDashboard className="mr-3 h-7 w-7 md:h-8 md:w-8" /> 
                {displayName ? `${displayName}'s Web Professional Dashboard` : 'Web Professional Dashboard'}
            </h1>
            <p className="text-md md:text-lg text-muted-foreground mt-1">Discover opportunities and manage your profile.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
            <Button asChild variant="outline">
            <Link href="/designer/setup-profile">
                <Settings className="mr-2 h-4 w-4" /> My Profile
            </Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/designers"> {/* Changed from /jobs/search as that page might not exist */}
                <Search className="mr-2 h-4 w-4" /> Find More Jobs
            </Link>
            </Button>
        </div>
      </div>

    <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">Profile Views (30d)</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-primary">{mockDesignerStats.profileViews}</p>
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-primary">{mockDesignerStats.activeApplications}</p>
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">Tokens Remaining</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-primary">{mockDesignerStats.tokensRemaining}</p>
                 <Button variant="link" asChild className="p-0 text-sm text-accent mt-1"><Link href="/pricing">Buy More Tokens</Link></Button>
            </CardContent>
        </Card>
    </div>
      
    {pageLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
             <div className="md:col-span-1 space-y-6">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
            <div className="md:col-span-2">
                 <Skeleton className="h-96 w-full" />
            </div>
        </div>
    ) : (
         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8 overflow-y-auto max-h-[calc(100vh-20rem)] pr-2"> 
                <DesignerJobList 
                    jobs={matchedJobs} 
                    title="Available Job Postings" 
                    emptyStateMessage="No jobs currently available or matched to your profile. Check back soon!"
                    onJobSelect={handleJobSelect}
                    selectedJobId={selectedJob?.id}
                />
                {generalJobs.length > 0 && ( // Only render this list if there are general jobs
                    <DesignerJobList 
                        jobs={generalJobs} 
                        title="Other Job Postings"
                        emptyStateMessage="No other general job postings at the moment."
                        onJobSelect={handleJobSelect}
                        selectedJobId={selectedJob?.id}
                    />
                )}
            </div>
            <div className="lg:col-span-2"> 
                <DesignerJobDetailPanel job={selectedJob} />
            </div>
        </div>
    )}
    </div>
  );
}


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
async function getMatchedJobs(
  designerId: string,
  designerCity?: string | null 
): Promise<JobPosting[]> {
  console.log("Fetching matched jobs for designer ID:", designerId, "City:", designerCity);
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
            applicants: job.applicants || [] 
          })));
        }
      }
    }

    const matchedAndOpenJobs = allUserJobs.filter(job => {
      if (job.status !== 'open' || job.adminPaused === true) return false; // Must be open and not paused by admin

      if (job.workPreference === 'remote') {
        return true; // Remote jobs are always a potential match
      }

      if (job.workPreference === 'local') {
        // For local jobs, match if the designer has a city and it matches the job's client city (case-insensitive)
        if (designerCity && job.clientCity) {
          return designerCity.toLowerCase() === job.clientCity.toLowerCase();
        }
        return false; // No match if job is local and either party is missing city info or cities don't match
      }
      // Default to true if workPreference is somehow not 'remote' or 'local' (should not happen with proper data)
      // Or, if workPreference isn't set, consider it a match.
      return true; 
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return matchedAndOpenJobs;

  } catch (error) {
    console.error("Failed to get matched jobs from localStorage", error);
    return [];
  }
}

async function getGeneralJobs(): Promise<JobPosting[]> {
    console.log("Fetching general jobs (currently returns empty as matched jobs show all open jobs that match location preference)");
    // This function can be expanded later to fetch jobs that are not "matched"
    // For now, returning an empty array as getMatchedJobs aims to fetch all relevant open jobs.
    return [];
}


export default function DesignerDashboardPage() {
  const { 
    isAuthenticated, 
    userType, 
    userId: authDesignerId, 
    isLoading: authIsLoading, 
    profileSetupComplete, 
    designerTokens, 
    displayName,
    designerCity // Get designer's city from auth context
  } = useAuth();
  const router = useRouter();

  const [matchedJobs, setMatchedJobs] = useState<JobPosting[]>([]);
  const [generalJobs, setGeneralJobs] = useState<JobPosting[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = `${displayName ? displayName + "'s" : 'Web Professional'} Dashboard - My Opportunities | WebMatcher`;
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
      // setSelectedJob(null); // Keep selected job if already set, or set to first job after fetch
      Promise.all([
        getMatchedJobs(authDesignerId, designerCity), // Pass designerCity to getMatchedJobs
        getGeneralJobs()
      ]).then(([matched, general]) => {
        setMatchedJobs(matched);
        setGeneralJobs(general);
        if (matched.length > 0) {
          setSelectedJob(matched[0]); // Select the first (most recent) matched job by default
        } else if (general.length > 0) {
          setSelectedJob(general[0]); // Or the first general job if no matched jobs
        } else {
          setSelectedJob(null); // No jobs, so no selection
        }
        setPageLoading(false);
      }).catch(error => {
        console.error("Failed to fetch designer jobs:", error);
        setPageLoading(false);
      });
    } else if (!authIsLoading) { 
        setPageLoading(false); 
    }
  }, [isAuthenticated, userType, profileSetupComplete, authDesignerId, authIsLoading, designerCity]); // Add designerCity to dependencies

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const mockDesignerStats = {
    profileViews: 156,
    activeApplications: selectedJob?.applicants?.filter(app => app.status !== 'designer_deleted').length || 0,
    tokensRemaining: designerTokens ?? 0, 
  };

  if (authIsLoading || (!authIsLoading && (!isAuthenticated || userType !== 'designer' || !profileSetupComplete))) {
    return (
       <div className="container mx-auto px-4 py-12 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
                <Skeleton className="h-16 w-3/5" />
                <div className="flex gap-2 mt-4 sm:mt-0">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="flex flex-col gap-8">
                 <div> {/* Skeleton for scroller */}
                    <Skeleton className="h-8 w-1/2 mb-4" /> {/* Title skeleton */}
                    <div className="flex space-x-4 overflow-x-auto py-2">
                        {[1,2,3].map(i => <Skeleton key={`skel-job-card-${i}`} className="h-56 w-72 flex-shrink-0 rounded-lg" />)}
                    </div>
                </div>
                <div> {/* Skeleton for detail panel */}
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
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
            <Link href="/designers"> 
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
        <div className="flex flex-col gap-8">
            <div> {/* Skeleton for scroller */}
                <Skeleton className="h-8 w-1/2 mb-4" /> {/* Title skeleton */}
                <div className="flex space-x-4 overflow-x-auto py-2">
                    {[1,2,3].map(i => <Skeleton key={`skel-job-card-loading-${i}`} className="h-56 w-72 flex-shrink-0 rounded-lg" />)}
                </div>
            </div>
            <div> {/* Skeleton for detail panel */}
                <Skeleton className="h-96 w-full rounded-lg" />
            </div>
        </div>
    ) : (
         <div className="flex flex-col gap-8">
            <div className="w-full"> 
                <DesignerJobList 
                    jobs={matchedJobs} 
                    title="Available Job Postings" 
                    emptyStateMessage="No jobs currently available or matched to your profile and location preferences. Check back soon!"
                    onJobSelect={handleJobSelect}
                    selectedJobId={selectedJob?.id}
                />
                {generalJobs.length > 0 && ( 
                    <div className="mt-8">
                        <DesignerJobList 
                            jobs={generalJobs} 
                            title="Other Job Postings"
                            emptyStateMessage="No other general job postings at the moment."
                            onJobSelect={handleJobSelect}
                            selectedJobId={selectedJob?.id}
                        />
                    </div>
                )}
            </div>
            <div className="w-full"> 
                <DesignerJobDetailPanel job={selectedJob} />
            </div>
        </div>
    )}
    </div>
  );
}


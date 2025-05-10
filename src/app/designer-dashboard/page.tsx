
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
  console.log("Fetching matched jobs for designer ID:", designerId);
  return [
    {
      id: "job-match-1",
      userId: "client-abc",
      title: "Urgent: Landing Page UI/UX for SaaS Product",
      description: "We are launching a new SaaS product and need a compelling landing page design. Must be modern, responsive, and conversion-focused. Experience with Figma and A/B testing design concepts is a plus. Quick turnaround needed.",
      budget: 1200, 
      skillsRequired: [{id:"ui-design", text:"UI Design"}, {id:"ux-design", text:"UX Design"}, {id:"figma", text:"Figma"}, {id:"landing-page", text:"Landing Page Design"}],
      createdAt: new Date('2023-10-10T09:00:00.000Z').toISOString(),
      status: "open",
    },
    {
      id: "job-match-2",
      userId: "client-def",
      title: "Illustrated Icons for Children's Educational App",
      description: "Seeking a talented illustrator to create a set of 50 unique, friendly, and colorful icons for an educational app targeting children aged 4-7. Style should be playful and engaging.",
      budget: 800, 
      skillsRequired: [{id:"illustration", text:"Illustration"}, {id:"icon-design", text:"Icon Design"}, {id:"graphic-design", text:"Graphic Design"}],
      createdAt: new Date('2023-10-08T16:20:00.000Z').toISOString(),
      status: "open",
    },
  ];
}

async function getGeneralJobs(): Promise<JobPosting[]> {
    console.log("Fetching general jobs");
    return [
     {
      id: "job-gen-1",
      userId: "client-xyz",
      title: "Website Redesign for Non-Profit Organization",
      description: "Our non-profit needs a fresh, accessible, and easy-to-navigate website. We want to better showcase our mission and impact. Experience with designing for non-profits and accessibility standards (WCAG) is highly valued.",
      budget: 2000, 
      skillsRequired: [{id:"web-design", text:"Web Design"}, {id:"ui-design", text:"UI Design"}, {id:"accessibility", text:"Accessibility (WCAG)"}, {id:"wordpress", text:"WordPress"}],
      createdAt: new Date('2023-10-05T11:00:00.000Z').toISOString(),
      status: "open",
    },
    {
      id: "job-gen-2",
      userId: "client-lmn",
      title: "Mobile App Design for Fitness Startup",
      description: "We're a new fitness startup looking for a designer to create an intuitive and motivating mobile app interface. Key features include workout tracking, progress visualization, and social sharing. Experience with gamification is a bonus.",
      budget: 2500,
      skillsRequired: [{ id: "mobile-app-design", text: "Mobile App Design" }, { id: "ui-design", text: "UI Design" }, { id: "ux-design", text: "UX Design" }, { id: "prototyping", text: "Prototyping" }],
      createdAt: new Date('2023-10-12T14:00:00.000Z').toISOString(),
      status: "open",
    },
  ];
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
        document.title = `${displayName ? displayName + "'s" : 'Designer'} Dashboard - My Opportunities | WebConnect`;
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
      setSelectedJob(null); // Reset selected job on user change or reload
      Promise.all([
        getMatchedJobs(authDesignerId),
        getGeneralJobs()
      ]).then(([matched, general]) => {
        setMatchedJobs(matched);
        setGeneralJobs(general);
        // Optionally select the first job by default
        // if (matched.length > 0) {
        //   setSelectedJob(matched[0]);
        // } else if (general.length > 0) {
        //   setSelectedJob(general[0]);
        // }
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
    activeApplications: 3,
    tokensRemaining: designerTokens ?? 25, 
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
                {displayName ? `${displayName}'s Dashboard` : 'Designer Dashboard'}
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
            <Link href="/jobs/search"> 
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
            <div className="lg:col-span-1 space-y-8 overflow-y-auto max-h-[calc(100vh-20rem)] pr-2"> {/* Scrollable job list */}
                <DesignerJobList 
                    jobs={matchedJobs} 
                    title="Jobs Matched For You" 
                    emptyStateMessage="No jobs specifically matched to your profile yet."
                    onJobSelect={handleJobSelect}
                    selectedJobId={selectedJob?.id}
                />
                <DesignerJobList 
                    jobs={generalJobs} 
                    title="Recently Posted Jobs"
                    onJobSelect={handleJobSelect}
                    selectedJobId={selectedJob?.id}
                />
            </div>
            <div className="lg:col-span-2"> {/* Job detail panel */}
                <DesignerJobDetailPanel job={selectedJob} />
            </div>
        </div>
    )}
    </div>
  );
}


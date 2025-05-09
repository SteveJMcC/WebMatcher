"use client";

import { DesignerJobList } from "@/components/features/designer-job-list";
import type { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, Search, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


// Mock data fetching functions
async function getMatchedJobs(designerId: string): Promise<JobPosting[]> {
  console.log("Fetching matched jobs for designer ID:", designerId);
  return [
    {
      id: "job-match-1",
      userId: "client-abc",
      title: "Urgent: Landing Page UI/UX for SaaS Product",
      description: "We are launching a new SaaS product and need a compelling landing page design. Must be modern, responsive, and conversion-focused. Experience with Figma and A/B testing design concepts is a plus. Quick turnaround needed.",
      budgetMin: 800,
      budgetMax: 1500,
      skillsRequired: [{id:"ui-design", text:"UI Design"}, {id:"ux-design", text:"UX Design"}, {id:"figma", text:"Figma"}, {id:"landing-page", text:"Landing Page Design"}],
      createdAt: new Date('2023-10-10T09:00:00.000Z').toISOString(),
      status: "open",
    },
    {
      id: "job-match-2",
      userId: "client-def",
      title: "Illustrated Icons for Children's Educational App",
      description: "Seeking a talented illustrator to create a set of 50 unique, friendly, and colorful icons for an educational app targeting children aged 4-7. Style should be playful and engaging.",
      budgetMin: 500,
      budgetMax: 1200,
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
      budgetMin: 1000,
      budgetMax: 3000,
      skillsRequired: [{id:"web-design", text:"Web Design"}, {id:"ui-design", text:"UI Design"}, {id:"accessibility", text:"Accessibility (WCAG)"}, {id:"wordpress", text:"WordPress"}],
      createdAt: new Date('2023-10-05T11:00:00.000Z').toISOString(),
      status: "open",
    },
  ];
}

// export const metadata: Metadata = {
//   title: "Designer Dashboard - My Opportunities | WebConnect",
//   description: "Find new job opportunities, manage your applications, and update your profile on WebConnect.",
// };

export default function DesignerDashboardPage() {
  const { isAuthenticated, userType, userId: authDesignerId, isLoading: authIsLoading, profileSetupComplete } = useAuthMock();
  const router = useRouter();

  const [matchedJobs, setMatchedJobs] = useState<JobPosting[]>([]);
  const [generalJobs, setGeneralJobs] = useState<JobPosting[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Designer Dashboard - My Opportunities | WebConnect";
    }

    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/designer-dashboard');
      } else if (userType !== 'designer') {
        router.push('/'); // Not a designer, redirect
      } else if (!profileSetupComplete) {
        router.push('/designer/setup-profile?redirect=/designer-dashboard');
      }
    }
  }, [isAuthenticated, userType, authIsLoading, profileSetupComplete, router]);

  useEffect(() => {
    if (isAuthenticated && userType === 'designer' && profileSetupComplete && authDesignerId) {
      setPageLoading(true);
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

  const mockDesignerStats = {
    profileViews: 156,
    activeApplications: 3,
    tokensRemaining: 25, // This would come from the designer's profile data in a real app
  };

  if (authIsLoading) {
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
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!isAuthenticated || userType !== 'designer' || !profileSetupComplete) {
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
                <LayoutDashboard className="mr-3 h-10 w-10" /> Designer Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mt-1">Discover opportunities and manage your profile.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
            <Link href="/designer/setup-profile">
                <Settings className="mr-2 h-4 w-4" /> My Profile
            </Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/jobs/search"> {/* Placeholder search page */}
                <Search className="mr-2 h-4 w-4" /> Find More Jobs
            </Link>
            </Button>
        </div>
      </div>

    <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-muted-foreground">Profile Views (Last 30d)</CardTitle>
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
        <div className="space-y-12">
            <div>
                <Skeleton className="h-8 w-1/3 mb-6" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div>
                <Skeleton className="h-8 w-1/3 mb-6" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    ) : (
         <div className="space-y-12">
            <DesignerJobList jobs={matchedJobs} title="Jobs Matched For You" emptyStateMessage="No jobs specifically matched to your profile yet. Broaden your skills or check general listings." />
            <DesignerJobList jobs={generalJobs} title="Recently Posted Jobs" />
        </div>
    )}
    </div>
  );
}

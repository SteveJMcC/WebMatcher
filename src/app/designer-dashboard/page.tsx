import { DesignerJobList } from "@/components/features/designer-job-list";
import type { JobPosting } from "@/lib/types";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, Search, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data fetching function
async function getMatchedJobs(designerId: string): Promise<JobPosting[]> {
  // In a real app, fetch jobs matched to the designer's profile
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


export const metadata: Metadata = {
  title: "Designer Dashboard - My Opportunities | WebConnect",
  description: "Find new job opportunities, manage your applications, and update your profile on WebConnect.",
};

export default async function DesignerDashboardPage() {
  // In a real app, get designerId from auth state
  const mockDesignerId = "mock-designer-123"; 
  const matchedJobs = await getMatchedJobs(mockDesignerId);
  const generalJobs = await getGeneralJobs(); // Could be jobs from followed categories or general pool

  const mockDesignerStats = {
    profileViews: 156,
    activeApplications: 3,
    tokensRemaining: 25,
  };

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

    {/* Stats Overview */}
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
      
      <div className="space-y-12">
        <DesignerJobList jobs={matchedJobs} title="Jobs Matched For You" emptyStateMessage="No jobs specifically matched to your profile yet. Broaden your skills or check general listings." />
        <DesignerJobList jobs={generalJobs} title="Recently Posted Jobs" />
      </div>
    </div>
  );
}

import { UserJobList } from "@/components/features/user-job-list";
import type { JobPosting } from "@/lib/types";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, PlusCircle } from "lucide-react";

// Mock data fetching function
async function getUserJobs(userId: string): Promise<JobPosting[]> {
  // In a real app, fetch jobs for the logged-in user
  // For now, using mock data
  return [
    {
      id: "job-1",
      userId: "mock-user-123",
      title: "E-commerce Platform Redesign",
      description: "Looking for a skilled designer to revamp our existing e-commerce website. Focus on modern UI, improved UX, and mobile responsiveness. We need someone proficient in Figma and understanding of current e-commerce trends.",
      budgetMin: 2000,
      budgetMax: 5000,
      skillsRequired: [{id:"ui", text:"UI Design"}, {id:"ux", text:"UX Design"}, {id:"figma", text:"Figma"}, {id:"e-commerce", text:"E-commerce"}],
      limitContacts: 15,
      createdAt: new Date('2023-10-01T10:00:00.000Z').toISOString(),
      status: "open",
      bidsCount: 5,
    },
    {
      id: "job-2",
      userId: "mock-user-123",
      title: "Mobile App Splash Screens",
      description: "Need a set of creative and engaging splash screens for our new mobile application. Theme is futuristic and minimalist.",
      budgetMin: 300,
      budgetMax: 800,
      skillsRequired: [{id:"graphic-design", text:"Graphic Design"}, {id:"illustration", text:"Illustration"}, {id:"mobile-app-design", text:"Mobile App Design"}],
      createdAt: new Date('2023-09-15T14:30:00.000Z').toISOString(),
      status: "in-progress",
      bidsCount: 3,
    },
     {
      id: "job-3",
      userId: "mock-user-123",
      title: "Company Branding Package",
      description: "Complete branding package needed for a new tech startup. Includes logo, color palette, typography, and basic brand guidelines.",
      budgetMin: 1500,
      budgetMax: 4000,
      skillsRequired: [{id:"branding", text:"Branding"}, {id:"logo-design", text:"Logo Design"}, {id:"graphic-design", text:"Graphic Design"}],
      createdAt: new Date('2023-08-20T11:00:00.000Z').toISOString(),
      status: "closed",
      bidsCount: 8,
    },
  ];
}

export const metadata: Metadata = {
  title: "My Jobs - User Dashboard | WebConnect",
  description: "Manage your job postings and view applications on WebConnect.",
};

export default async function UserDashboardPage() {
  // In a real app, get userId from auth state
  const mockUserId = "mock-user-123"; 
  const jobs = await getUserJobs(mockUserId);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center">
            <LayoutDashboard className="mr-3 h-10 w-10" /> User Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Manage your job postings and view designer bids.</p>
        </div>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/post-job">
            <PlusCircle className="mr-2 h-5 w-5" /> Post a New Job
          </Link>
        </Button>
      </div>
      
      <UserJobList jobs={jobs} />
    </div>
  );
}

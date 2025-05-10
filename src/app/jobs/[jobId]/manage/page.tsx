
"use client"; // This page uses client-side hooks and state for bids

import { JobBidsDisplay } from "@/components/features/job-bids-display";
import type { JobPosting, Bid, DesignerProfile } from "@/lib/types";
// import { Metadata } from "next"; // Metadata cannot be dynamic in client components like this
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, DollarSign, Edit3, Settings, Share2, Users, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data fetching functions - these would be API calls in a real app

async function getJobDetails(jobId: string, userId: string): Promise<JobPosting | null> {
   // Simulating fetching from localStorage as done in user-dashboard
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `userJobs_${userId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        const parsedJobs = JSON.parse(jobsString) as JobPosting[];
        return parsedJobs.find(job => job.id === jobId) || null;
      }
    } catch (error) {
      console.error("Failed to get job details from localStorage", error);
    }
  }
  // Fallback mock for testing if localStorage fails or job not found
  if (jobId === "job-1") {
    return {
      id: "job-1",
      userId: "mock-client-email@example.com_user", // Example based on new userKey logic
      title: "E-commerce Platform Redesign",
      description: "Looking for a skilled designer to revamp our existing e-commerce website. Focus on modern UI, improved UX, and mobile responsiveness. We need someone proficient in Figma and understanding of current e-commerce trends. The project involves creating a new visual identity, a full set of responsive page designs (homepage, product listings, product details, cart, checkout), and a style guide. We expect collaboration with our development team to ensure design feasibility. Please include examples of similar e-commerce projects in your application.",
      budget: 3500, 
      skillsRequired: [{id:"ui", text:"UI Design"}, {id:"ux", text:"UX Design"}, {id:"figma", text:"Figma"}, {id:"e-commerce", text:"E-commerce"}],
      limitContacts: 15,
      createdAt: new Date('2023-10-01T10:00:00.000Z').toISOString(),
      status: "open",
      clientEmail: "client.user@example.com",
      clientPhone: "+12345678900"
    };
  }
  return null;
}

async function getJobBids(jobId: string): Promise<Bid[]> {
 if (jobId === "job-1") { // Example job ID
    return [
      {
        id: "bid-101", jobId: "job-1", designerId: "designer-A", designerName: "Alice Wonderland", bidAmount: 2500,
        coverLetter: "I'm an expert in e-commerce UI/UX with 5 years of experience. I can deliver a stunning and high-converting design for your platform. My portfolio showcases several successful e-commerce projects. I'm proficient in Figma and can provide a detailed style guide.",
        experienceSummary: "5+ years in UI/UX, specialized in e-commerce. Strong Figma skills. Proven track record of increasing conversion rates through design.",
        submittedAt: new Date('2023-10-02T11:00:00.000Z').toISOString(),
      },
      {
        id: "bid-102", jobId: "job-1", designerId: "designer-B", designerName: "Bob The Builder", bidAmount: 3000,
        coverLetter: "I have extensive experience redesigning platforms for better user engagement. I focus on mobile-first design and can help improve your site's performance metrics. I'm available to start immediately and can work closely with your dev team.",
        experienceSummary: "7 years as a web designer. Focus on mobile-first and performance. Excellent collaborator.",
        submittedAt: new Date('2023-10-03T15:30:00.000Z').toISOString(),
      },
      {
        id: "bid-103", jobId: "job-1", designerId: "designer-C", designerName: "Carol Danvers", bidAmount: 1800,
        coverLetter: "As a newer designer with a fresh perspective, I'm eager to tackle this e-commerce redesign. I offer competitive pricing and a strong commitment to quality. I'm a fast learner and highly skilled in Figma.",
        experienceSummary: "2 years in web design, strong Figma skills. Highly motivated and dedicated to delivering quality work. Recent graduate with modern design sensibilities.",
        submittedAt: new Date('2023-10-04T09:20:00.000Z').toISOString(),
      },
    ];
  }
  return [];
}

async function getDesignerProfileForAI(designerId: string): Promise<string> {
    const designer = await getFullDesignerProfile(designerId);
    if (!designer) return "Designer profile not available.";
    let profileString = `Name: ${designer.name}. Headline: ${designer.headline}. Skills: ${designer.skills.map(s => typeof s === 'string' ? s : s.text).join(', ')}. Experience: ${designer.bio.substring(0,100)}... Budget Range: $${designer.budgetMin}-$${designer.budgetMax}.`;
    if (designer.email) {
        profileString += ` Email: ${designer.email}.`;
    }
    if (designer.phone) {
        profileString += ` Phone: ${designer.phone}.`;
    }
    return profileString;
}

async function getFullDesignerProfile(designerId: string): Promise<DesignerProfile | null> {
    // Mock: In a real app, fetch full profile from DB
    const profiles: Record<string, DesignerProfile> = {
        "designer-A": { id: "designer-A", userId: "user-A", name: "Alice Wonderland", headline: "E-commerce UI/UX Specialist", avatarUrl: "https://picsum.photos/seed/alice/100/100", skills: [{id:"e-commerce", text:"E-commerce"}, {id:"figma", text:"Figma"}], bio: "Expert in e-commerce design...", budgetMin: 2000, budgetMax: 6000, email: "alice@example.com", phone: "+15550001111", portfolioLinks: [], tokens: 10, joinedDate: new Date().toISOString() },
        "designer-B": { id: "designer-B", userId: "user-B", name: "Bob The Builder", headline: "Mobile-First Web Designer", avatarUrl: "https://picsum.photos/seed/bob/100/100", skills: [{id:"mobile-design", text:"Mobile Design"}, {id:"ux", text:"UX"}], bio: "Building engaging mobile experiences...", budgetMin: 2500, budgetMax: 7000, email: "bob@example.com", phone: "+15550002222", portfolioLinks: [], tokens: 15, joinedDate: new Date().toISOString() },
        "designer-C": { id: "designer-C", userId: "user-C", name: "Carol Danvers", headline: "Modern & Affordable Web Designer", avatarUrl: "https://picsum.photos/seed/carol/100/100", skills: [{id:"web-design", text:"Web Design"}, {id:"figma", text:"Figma"}], bio: "Fresh design perspectives at great value...", budgetMin: 1500, budgetMax: 4000, email: "carol@example.com", phone: undefined, portfolioLinks: [], tokens: 5, joinedDate: new Date().toISOString() },
    };
    return profiles[designerId] || null;
}


export default function ManageJobPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, userType, userId: authUserId, isLoading: authIsLoading, profileSetupComplete } = useAuth();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (job && typeof document !== 'undefined') {
      document.title = `Manage Job: ${job.title} | WebConnect`;
    } else if (!job && !pageLoading && typeof document !== 'undefined') {
      document.title = `Job Not Found | WebConnect`;
    }
  }, [job, pageLoading]);

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/jobs/${jobId}/manage&userType=user`);
        return;
      }
      if (userType !== 'user') {
        router.push('/designer-dashboard'); 
        return;
      }
      if (!profileSetupComplete) {
        router.push(`/user/setup-profile?redirect=/jobs/${jobId}/manage`);
        return;
      }

      if (authUserId && jobId) {
        setPageLoading(true);
        setError(null);
        Promise.all([
          getJobDetails(jobId, authUserId),
          getJobBids(jobId) // Assuming bids are public or jobId is enough
        ]).then(([jobData, bidsData]) => {
          if (jobData) {
            setJob(jobData);
            setBids(bidsData);
          } else {
            setError("Job not found or you don't have permission to view it.");
          }
          setPageLoading(false);
        }).catch(err => {
          console.error("Failed to load job or bids:", err);
          setError("Failed to load job details. Please try again.");
          setPageLoading(false);
        });
      } else {
        setPageLoading(false);
        if (!jobId) setError("Job ID is missing.");
      }
    }
  }, [authIsLoading, isAuthenticated, userType, authUserId, profileSetupComplete, jobId, router]);


  if (authIsLoading || pageLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-10">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="container mx-auto px-4 py-12 text-center">
         <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild className="mt-6">
            <Link href="/user-dashboard">Back to Client Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground">The job you're looking for doesn't exist or couldn't be loaded.</p>
        <Button asChild className="mt-6">
            <Link href="/user-dashboard">Back to Client Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <Card className="shadow-xl">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <CardTitle className="text-3xl lg:text-4xl font-bold text-primary flex items-center">
                        <Briefcase className="mr-3 h-8 w-8" /> {job.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-md text-muted-foreground">
                        Manage bids and review applications for your project.
                    </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 items-start md:items-end self-start md:self-center lg:self-start">
                    <Button variant="outline" asChild>
                        <Link href={`/jobs/${job.id}/edit`}> 
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Job
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" /> Share Job
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Project Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Budget</h4>
                    <p className="text-lg font-semibold text-foreground">${job.budget.toLocaleString()}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Skills Required</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {job.skillsRequired.map(skill => (
                            <Badge key={typeof skill === 'string' ? skill : skill.id} variant="secondary" className="bg-primary/10 text-primary">
                                {typeof skill === 'string' ? skill : skill.text}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <Badge variant="outline" className={`capitalize text-sm ${job.status === 'open' ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-500 text-gray-600 bg-gray-50'}`}>
                        {job.status}
                    </Badge>
                </div>
                 {job.limitContacts && (
                     <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Contact Limit</h4>
                        <p className="text-lg font-semibold text-foreground">{job.limitContacts} designers</p>
                    </div>
                 )}
            </div>
        </CardContent>
      </Card>
      
      <JobBidsDisplay
        job={job}
        initialBids={bids}
        getDesignerProfileString={getDesignerProfileForAI}
        getDesignerDetails={getFullDesignerProfile}
      />
    </div>
  );
}

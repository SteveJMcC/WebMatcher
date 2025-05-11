
"use client"; 

import { JobBidsDisplay } from "@/components/features/job-bids-display";
import type { JobPosting, Bid, DesignerProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, DollarSign, Edit3, Settings, Share2, Users, Loader2, AlertTriangle, MapPin, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { limitContactsOptions } from "@/lib/constants";

async function getJobDetails(jobId: string, userId: string): Promise<JobPosting | null> {
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `userJobs_${userId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        const parsedJobs = JSON.parse(jobsString) as JobPosting[];
        const job = parsedJobs.find(job => job.id === jobId) || null;
        if (job && job.applicants === undefined) { // Ensure applicants array exists
            job.applicants = [];
        }
        return job;
      }
    } catch (error) {
      console.error("Failed to get job details from localStorage", error);
    }
  }
  // Fallback mock should also include applicants array if necessary
  if (jobId === "job-1") { 
    return {
      id: "job-1",
      userId: "mock-client-email@example.com_user", 
      title: "E-commerce Platform Redesign",
      description: "Looking for a skilled designer to revamp our existing e-commerce website. Focus on modern UI, improved UX, and mobile responsiveness. We need someone proficient in Figma and understanding of current e-commerce trends. The project involves creating a new visual identity, a full set of responsive page designs (homepage, product listings, product details, cart, checkout), and a style guide. We expect collaboration with our development team to ensure design feasibility. Please include examples of similar e-commerce projects in your application.",
      budget: "under £5000", 
      skillsRequired: [{id:"ui", text:"UI Design"}, {id:"ux", text:"UX Design"}, {id:"figma", text:"Figma"}, {id:"e-commerce", text:"E-commerce"}],
      limitContacts: "16", // Updated to string value from options
      createdAt: new Date('2023-10-01T10:00:00.000Z').toISOString(),
      status: "open",
      clientEmail: "client.user@example.com",
      clientPhone: "+12345678900",
      workPreference: "remote",
      professionalCategory: "Web Designer",
      applicants: [],
    };
  }
  return null;
}

async function getJobBids(jobId: string): Promise<Bid[]> {
 if (jobId === "job-1") { 
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
    // Mock data for designer profiles based on IDs used in bids
    const profiles: Record<string, DesignerProfile> = {
        "designer-A": { id: "designer-A", userId: "user-A", name: "Alice Wonderland", headline: "E-commerce UI/UX Specialist", avatarUrl: "https://picsum.photos/seed/alice/100/100", skills: [{id:"e-commerce", text:"E-commerce"}, {id:"figma", text:"Figma"}], bio: "Expert in e-commerce design, focusing on creating intuitive and high-converting user experiences. Over 5 years of experience helping businesses grow their online presence.", budgetMin: 2000, budgetMax: 6000, email: "alice.w@example.com", phone: "+15551110000", portfolioLinks: [{title: "Portfolio", url: "https://example.com/alice"}], tokens: 50, joinedDate: new Date('2022-03-10T10:00:00.000Z').toISOString() },
        "designer-B": { id: "designer-B", userId: "user-B", name: "Bob The Builder", headline: "Mobile-First Web Designer & Developer", avatarUrl: "https://picsum.photos/seed/bob/100/100", skills: [{id:"mobile-design", text:"Mobile Design"}, {id:"ux", text:"UX"}, {id:"react", text:"React"}], bio: "Building engaging mobile-first web experiences for startups and established companies. Proficient in modern JavaScript frameworks and responsive design principles.", budgetMin: 2500, budgetMax: 7000, email: "bob.builder@example.com", phone: "+15552220000", portfolioLinks: [{title: "GitHub", url:"https://github.com/bob"}], tokens: 35, joinedDate: new Date('2021-08-15T10:00:00.000Z').toISOString() },
        "designer-C": { id: "designer-C", userId: "user-C", name: "Carol Danvers", headline: "Modern & Affordable Web Designer", avatarUrl: "https://picsum.photos/seed/carol/100/100", skills: [{id:"web-design", text:"Web Design"}, {id:"figma", text:"Figma"}, {id:"wordpress", text:"WordPress"}], bio: "Delivering fresh design perspectives at great value. Specializing in WordPress and Figma, I help small businesses and individuals create a strong online presence.", budgetMin: 1500, budgetMax: 4000, email: "carol.d@example.com", phone: undefined, portfolioLinks: [], tokens: 20, joinedDate: new Date('2023-01-20T10:00:00.000Z').toISOString() },
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
  const [applicants, setApplicants] = useState<DesignerProfile[]>([]);

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
          getJobBids(jobId) 
        ]).then(async ([jobData, bidsData]) => {
          if (jobData) {
            setJob(jobData);
            setBids(bidsData);
            if (jobData.applicants && jobData.applicants.length > 0) {
              const applicantProfiles = await Promise.all(
                jobData.applicants.map(app => getFullDesignerProfile(app.designerId))
              );
              setApplicants(applicantProfiles.filter(p => p !== null) as DesignerProfile[]);
            } else {
              setApplicants([]);
            }
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

  const getLimitContactsDisplayValue = (limitValue?: typeof job.limitContacts) => {
    if (!limitValue || limitValue === "unlimited") {
      return "Unlimited";
    }
    const option = limitContactsOptions.find(opt => opt.value === limitValue);
    return option ? option.label : `${limitValue} professionals`;
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><DollarSign className="h-4 w-4 mr-1 text-primary" />Budget</h4>
                    <p className="text-lg font-semibold text-foreground">{job.budget}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><Users2 className="h-4 w-4 mr-1 text-primary" />Professional Category</h4>
                  <p className="text-lg font-semibold text-foreground">
                    {job.professionalCategory}{job.professionalCategory === "Other" && job.customProfessionalCategory ? `: ${job.customProfessionalCategory}` : ""}
                  </p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><MapPin className="h-4 w-4 mr-1 text-primary" />Work Preference</h4>
                    <p className="text-lg font-semibold text-foreground capitalize">{job.workPreference}</p>
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
                        <p className="text-lg font-semibold text-foreground">{getLimitContactsDisplayValue(job.limitContacts)}</p>
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
        applicants={applicants}
      />
    </div>
  );
}

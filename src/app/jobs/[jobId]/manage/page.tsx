
"use client"; 

import { JobBidsDisplay } from "@/components/features/job-bids-display";
import type { JobPosting, Bid, DesignerProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, DollarSign, Edit3, Settings, Share2, Users, Loader2, AlertTriangle, MapPin, Users2, Mail, Phone, HomeIcon, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { limitContactsOptions } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

async function getJobDetails(jobId: string, userId: string): Promise<JobPosting | null> {
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `userJobs_${userId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        const parsedJobs = JSON.parse(jobsString) as JobPosting[];
        const job = parsedJobs.find(job => job.id === jobId) || null;
        if (job) {
            job.applicants = job.applicants || []; // Ensure applicants array exists
            job.bidsCount = job.bidsCount || (job.applicants?.length || 0); // Ensure bidsCount is accurate
        }
        return job;
      }
    } catch (error) {
      console.error("Failed to get job details from localStorage", error);
    }
  }
  return null;
}


async function getFullDesignerProfile(designerId: string): Promise<DesignerProfile | null> {
    // In a real app, this would fetch from a DB or a more robust localStorage structure for designer profiles.
    // For now, we'll try to retrieve it from the combined profiles in localStorage.
    if (typeof window !== 'undefined') {
        const profilesString = localStorage.getItem('mockUserProfiles');
        if (profilesString) {
            const allProfiles = JSON.parse(profilesString) as Record<string, any>;
            // Designer profiles might be stored under a key like 'email_designer'
            // And their userId is 'mock-designer-email'
            // This lookup is a bit fragile and depends on how designer IDs are formed and stored.
            const designerEntry = Object.values(allProfiles).find(
                (p) => p.userType === 'designer' && p.userId === designerId
            );

            if (designerEntry) {
                return {
                    id: designerEntry.userId,
                    userId: designerEntry.userId,
                    name: designerEntry.displayName || "Unknown Web Professional",
                    headline: designerEntry.designerHeadline || "Web Professional",
                    avatarUrl: designerEntry.designerAvatarUrl,
                    skills: designerEntry.designerSkills || [],
                    bio: designerEntry.designerBio || "No bio available.",
                    portfolioLinks: designerEntry.designerPortfolioLinks || [],
                    budgetMin: designerEntry.designerBudgetMin ?? 0,
                    budgetMax: designerEntry.designerBudgetMax ?? 0,
                    email: designerEntry.designerEmail || designerEntry.email,
                    phone: designerEntry.designerPhone,
                    tokens: designerEntry.designerTokens ?? 0,
                    joinedDate: designerEntry.joinedDate || new Date().toISOString(), 
                };
            }
        }
    }

    // Fallback mock data if not found - this part might become less relevant as localStorage becomes source of truth
    const profiles: Record<string, DesignerProfile> = {
        "designer-A": { id: "designer-A", userId: "user-A", name: "Alice Wonderland", headline: "E-commerce UI/UX Specialist", avatarUrl: "https://picsum.photos/seed/alice/100/100", skills: [{id:"e-commerce", text:"E-commerce"}, {id:"figma", text:"Figma"}], bio: "Expert in e-commerce design, focusing on creating intuitive and high-converting user experiences. Over 5 years of experience helping businesses grow their online presence.", budgetMin: 2000, budgetMax: 6000, email: "alice.w@example.com", phone: "+15551110000", portfolioLinks: [{title: "Portfolio", url: "https://example.com/alice"}], tokens: 50, joinedDate: new Date('2022-03-10T10:00:00.000Z').toISOString() },
        "designer-B": { id: "designer-B", userId: "user-B", name: "Bob The Builder", headline: "Mobile-First Web Designer & Developer", avatarUrl: "https://picsum.photos/seed/bob/100/100", skills: [{id:"mobile-design", text:"Mobile Design"}, {id:"ux", text:"UX"}, {id:"react", text:"React"}], bio: "Building engaging mobile-first web experiences for startups and established companies. Proficient in modern JavaScript frameworks and responsive design principles.", budgetMin: 2500, budgetMax: 7000, email: "bob.builder@example.com", phone: "+15552220000", portfolioLinks: [{title: "GitHub", url:"https://github.com/bob"}], tokens: 35, joinedDate: new Date('2021-08-15T10:00:00.000Z').toISOString() },
        "designer-C": { id: "designer-C", userId: "user-C", name: "Carol Danvers", headline: "Modern & Affordable Web Designer", avatarUrl: "https://picsum.photos/seed/carol/100/100", skills: [{id:"web-design", text:"Web Design"}, {id:"figma", text:"Figma"}, {id:"wordpress", text:"WordPress"}], bio: "Delivering fresh design perspectives at great value. Specializing in WordPress and Figma, I help small businesses and individuals create a strong online presence.", budgetMin: 1500, budgetMax: 4000, email: "carol.d@example.com", phone: undefined, portfolioLinks: [], tokens: 20, joinedDate: new Date('2023-01-20T10:00:00.000Z').toISOString() },
    };
    return profiles[designerId] || null;
}

async function getDesignerProfileForAI(designerId: string): Promise<string> {
    const designer = await getFullDesignerProfile(designerId);
    if (!designer) return "Web Professional profile not available.";
    let profileString = `Name: ${designer.name}. Headline: ${designer.headline}. Skills: ${designer.skills.map(s => typeof s === 'string' ? s : s.text).join(', ')}. Experience: ${designer.bio.substring(0,100)}... Budget Range: $${designer.budgetMin}-$${designer.budgetMax}.`;
    if (designer.email) {
        profileString += ` Email: ${designer.email}.`;
    }
    if (designer.phone) {
        profileString += ` Phone: ${designer.phone}.`;
    }
    return profileString;
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
        getJobDetails(jobId, authUserId)
          .then(async (jobData) => {
            if (jobData) {
              setJob(jobData);
              if (jobData.applicants && jobData.applicants.length > 0) {
                const realBidsData: Bid[] = await Promise.all(
                  jobData.applicants.map(async (applicant) => {
                    const designerDetails = await getFullDesignerProfile(applicant.designerId);
                    return {
                      id: `bid-${jobData.id}-${applicant.designerId}-${new Date(applicant.appliedAt).getTime()}`,
                      jobId: jobData.id,
                      designerId: applicant.designerId,
                      designerName: designerDetails?.name || "Web Professional",
                      designerAvatar: designerDetails?.avatarUrl, 
                      bidAmount: 0, 
                      coverLetter: `This professional has expressed interest in "${jobData.title}" and unlocked contact details. Review their profile for experience.`, 
                      experienceSummary: designerDetails?.bio ? `${designerDetails.bio.substring(0, 150)}...` : "Refer to professional's profile for experience details.", 
                      submittedAt: applicant.appliedAt,
                    };
                  })
                );
                setBids(realBidsData);
              } else {
                setBids([]);
              }
            } else {
              setError("Job not found or you don't have permission to view it.");
            }
            setPageLoading(false);
          })
          .catch((err) => {
            console.error("Failed to load job or construct bids:", err);
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
                        <Link href="/user-dashboard"> 
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Link>
                    </Button>
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
                 <div>
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><Users className="h-4 w-4 mr-1 text-primary" />Applicants</h4>
                    <p className="text-lg font-semibold text-foreground">{job.applicants?.length || 0}</p>
                </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><Mail className="h-4 w-4 mr-1 text-primary" />Contact Email</h4>
                    <p className="text-lg font-semibold text-foreground">{job.clientEmail}</p>
                  </div>
                  {job.clientPhone && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><Phone className="h-4 w-4 mr-1 text-primary" />Contact Phone</h4>
                      <p className="text-lg font-semibold text-foreground">{job.clientPhone}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1"><HomeIcon className="h-4 w-4 mr-1 text-primary" />Location</h4>
                    <p className="text-lg font-semibold text-foreground">{job.clientCity}, {job.clientPostalCode}</p>
                  </div>
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


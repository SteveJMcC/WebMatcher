
"use client";

import type { JobPosting } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarDays, DollarSign, Tag, UserCircle, CheckCircle, AlertTriangle, Search, Mail, Phone, Lock, Unlock, Coins, Loader2, MapPin, Users2, HomeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { limitContactsOptions, professionalCategoryOptions } from "@/lib/constants";

interface DesignerJobDetailPanelProps {
  job: JobPosting | null;
}

const TOKEN_COST_PER_APPLICATION = 1;

export function DesignerJobDetailPanel({ job }: DesignerJobDetailPanelProps) {
  const { designerTokens, updateDesignerTokens, userId, email, userType } = useAuth();
  const { toast } = useToast();

  const [showContactDetails, setShowContactDetails] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    setShowContactDetails(false);
    setIsApplying(false);
    setApplicationError(null);
    if (job && userId) {
        // Check if current designer has already applied to this job
        const alreadyApplied = job.applicants?.some(app => app.designerId === userId);
        setHasApplied(!!alreadyApplied);
        if (alreadyApplied) {
            setShowContactDetails(true); // If already applied, show contact details
        }
    } else {
        setHasApplied(false);
    }
  }, [job, userId]);

  const handleApplyAndRevealContact = async () => {
    if (!job || !userId || !email || userType !== 'designer') return;

    setIsApplying(true);
    setApplicationError(null);

    if ((designerTokens ?? 0) < TOKEN_COST_PER_APPLICATION) {
      setApplicationError(`Not enough tokens. You need ${TOKEN_COST_PER_APPLICATION} token(s) to apply.`);
      setIsApplying(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      updateDesignerTokens(-TOKEN_COST_PER_APPLICATION);
      
      // Add applicant to job posting in localStorage
      if (typeof window !== 'undefined') {
        const clientJobsStorageKey = `userJobs_${job.userId}`;
        const clientJobsString = localStorage.getItem(clientJobsStorageKey);
        let clientJobs: JobPosting[] = clientJobsString ? JSON.parse(clientJobsString) : [];
        
        clientJobs = clientJobs.map(j => {
            if (j.id === job.id) {
                const newApplicants = [...(j.applicants || []), { designerId: userId, appliedAt: new Date().toISOString() }];
                return { ...j, applicants: newApplicants, bidsCount: (j.bidsCount || 0) + 1 };
            }
            return j;
        });
        localStorage.setItem(clientJobsStorageKey, JSON.stringify(clientJobs));
      }


      setShowContactDetails(true);
      setHasApplied(true);
      toast({
        title: "Application Successful!",
        description: "Client contact details revealed. You can now contact the client directly.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      setApplicationError("An error occurred while applying. Please try again.");
      // Revert token deduction if API call failed (in a real scenario)
      // updateDesignerTokens(TOKEN_COST_PER_APPLICATION); 
      toast({
        title: "Application Failed",
        description: (error as Error).message || "Could not process application.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const getLimitContactsDisplayValue = (limitValue?: typeof job.limitContacts) => {
    if (!job || !limitValue || limitValue === "unlimited") {
      return "Client will accept unlimited web professional contacts for this job.";
    }
    const option = limitContactsOptions.find(opt => opt.value === limitValue);
    return option ? `Client will accept contacts up to ${option.label.toLowerCase()} web professionals.` : `Client will accept up to ${limitValue} web professional contacts for this job.`;
  };


  if (!job) {
    return (
      <Card className="h-full flex flex-col items-center justify-center shadow-lg sticky top-24">
        <CardHeader className="text-center">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">No Job Selected</CardTitle>
          <CardDescription>Select a job from the list to view its details and apply.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Browse through matched and recent job postings on the left.
          </p>
        </CardContent>
      </Card>
    );
  }

  const professionalCategoryDisplay = job.professionalCategory === "Other" && job.customProfessionalCategory 
    ? job.customProfessionalCategory 
    : professionalCategoryOptions.find(opt => opt.value === job.professionalCategory)?.label || job.professionalCategory;

  return (
    <Card className="shadow-xl sticky top-24 overflow-y-auto max-h-[calc(100vh-7rem)]">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-3">
            <div>
                <CardTitle className="text-2xl lg:text-3xl font-bold text-primary flex items-center">
                <Briefcase className="mr-3 h-7 w-7 lg:h-8 lg:w-8 flex-shrink-0" /> {job.title}
                </CardTitle>
                <CardDescription className="mt-1.5 text-sm text-muted-foreground flex items-center">
                <UserCircle className="mr-1.5 h-4 w-4" /> Client ID: {job.userId}
                </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-1.5 bg-primary/10 text-primary border-primary/30 self-start md:self-center whitespace-nowrap">
                <DollarSign className="mr-1.5 h-5 w-5" /> {job.budget}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1.5">Project Description</h3>
          <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
            <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Date Posted</h4>
                <p className="text-md text-foreground flex items-center">
                    <CalendarDays className="mr-1.5 h-4 w-4 text-primary" /> {new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Job Status</h4>
                 <Badge 
                    variant={job.status === 'open' ? 'default' : 'outline'}
                    className={cn("capitalize text-sm", 
                        job.status === 'open' ? 'bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20' : 
                        job.status === 'in-progress' ? 'bg-blue-500/10 text-blue-700 border-blue-500/30' :
                        'bg-muted text-muted-foreground border-border'
                    )}
                >
                    {job.status === 'open' && <CheckCircle className="mr-1.5 h-4 w-4" />}
                    {job.status === 'closed' && <AlertTriangle className="mr-1.5 h-4 w-4" />}
                    {job.status}
                </Badge>
            </div>
            <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><Users2 className="mr-1.5 h-4 w-4 text-primary"/>Professional Needed</h4>
                <p className="text-md text-foreground">{professionalCategoryDisplay}</p>
            </div>
             <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><MapPin className="mr-1.5 h-4 w-4 text-primary"/>Work Preference</h4>
                <p className="text-md text-foreground capitalize">{job.workPreference}</p>
            </div>
            {job.workPreference === 'local' && (
                 <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><HomeIcon className="mr-1.5 h-4 w-4 text-primary"/>Client Location</h4>
                    <p className="text-md text-foreground">{job.clientCity}, {job.clientPostalCode}</p>
                </div>
            )}
        </div>

        <div>
            <h4 className="text-md font-semibold text-foreground mb-2 pt-4 border-t">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
            {job.skillsRequired.map((skill) => (
                <Badge key={typeof skill === 'string' ? skill : skill.id} variant="secondary" className="px-3 py-1 text-sm bg-secondary text-secondary-foreground">
                <Tag className="mr-1.5 h-3.5 w-3.5"/>
                {typeof skill === 'string' ? skill : skill.text}
                </Badge>
            ))}
            </div>
        </div>
        {job.limitContacts && (
             <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Limit</h4>
                <p className="text-md text-foreground">
                    {getLimitContactsDisplayValue(job.limitContacts)}
                </p>
            </div>
        )}

        <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                {showContactDetails ? <Unlock className="mr-2 h-5 w-5 text-green-500" /> : <Lock className="mr-2 h-5 w-5 text-orange-500" />}
                Client Contact Information
            </h3>
            {showContactDetails ? (
                <div className="space-y-2 p-4 bg-green-500/10 rounded-md border border-green-500/30">
                    {job.clientEmail && (
                        <p className="text-foreground flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-primary" /> Email: <a href={`mailto:${job.clientEmail}`} className="text-primary hover:underline ml-1">{job.clientEmail}</a>
                        </p>
                    )}
                    {job.clientPhone && (
                        <p className="text-foreground flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-primary" /> Phone: <a href={`tel:${job.clientPhone}`} className="text-primary hover:underline ml-1">{job.clientPhone}</a>
                        </p>
                    )}
                    {(!job.clientEmail && !job.clientPhone) && (
                         <p className="text-muted-foreground italic">Client has not provided public contact details for this job.</p>
                    )}
                </div>
            ) : (
                <div className="p-4 bg-secondary rounded-md border border-border">
                    <p className="text-muted-foreground">
                        Client contact details (email and phone) will be revealed after you apply for this job.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        This action will cost {TOKEN_COST_PER_APPLICATION} token. Your current balance: {designerTokens ?? 0} tokens.
                    </p>
                </div>
            )}
            {applicationError && (
                <p className="text-sm text-destructive mt-2 flex items-center">
                    <AlertTriangle className="mr-1.5 h-4 w-4"/> {applicationError}
                </p>
            )}
        </div>

      </CardContent>
      <CardFooter className="border-t pt-6 flex flex-col items-stretch gap-3">
         {hasApplied ? (
             <Button size="lg" variant="outline" disabled className="w-full text-base py-3">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Applied & Contact Details Unlocked
            </Button>
         ) : (
            <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3"
                onClick={handleApplyAndRevealContact}
                disabled={isApplying || (designerTokens ?? 0) < TOKEN_COST_PER_APPLICATION || job.status !== 'open' || job.adminPaused === true}
            >
                {isApplying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Coins className="mr-2 h-5 w-5" />}
                {job.status !== 'open' || job.adminPaused === true ? 'Job Not Open for Applications' : 
                    isApplying ? "Applying..." : `Apply & Reveal Contact (Cost: ${TOKEN_COST_PER_APPLICATION} Token)`
                }
            </Button>
         )}
          { (designerTokens ?? 0) < TOKEN_COST_PER_APPLICATION && !hasApplied && (job.status === 'open' && job.adminPaused !== true) && (
            <Button variant="link" asChild className="text-sm text-accent p-0">
                <Link href="/pricing">Buy More Tokens</Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}



"use client";

import type { JobPosting } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarDays, DollarSign, Tag, UserCircle, CheckCircle, AlertTriangle, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DesignerJobDetailPanelProps {
  job: JobPosting | null;
}

export function DesignerJobDetailPanel({ job }: DesignerJobDetailPanelProps) {
  if (!job) {
    return (
      <Card className="h-full flex flex-col items-center justify-center shadow-lg sticky top-24"> {/* sticky top for when left list scrolls */}
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

  return (
    <Card className="shadow-xl sticky top-24 overflow-y-auto max-h-[calc(100vh-7rem)]"> {/* sticky top and scrollable */}
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-3">
            <div>
                <CardTitle className="text-2xl lg:text-3xl font-bold text-primary flex items-center">
                <Briefcase className="mr-3 h-7 w-7 lg:h-8 lg:w-8 flex-shrink-0" /> {job.title}
                </CardTitle>
                <CardDescription className="mt-1.5 text-sm text-muted-foreground flex items-center">
                <UserCircle className="mr-1.5 h-4 w-4" /> Client ID: {job.userId} {/* Placeholder for client name if available */}
                </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-1.5 bg-primary/10 text-primary border-primary/30 self-start md:self-center whitespace-nowrap">
                <DollarSign className="mr-1.5 h-5 w-5" /> ${job.budget.toLocaleString()}
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
                    Client will accept up to {job.limitContacts} designer contacts for this job.
                </p>
            </div>
        )}

      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3">
          <CheckCircle className="mr-2 h-5 w-5" /> Apply for this Job (Costs 1 Token)
        </Button>
        {/* Later: Add "Save Job" functionality */}
      </CardFooter>
    </Card>
  );
}


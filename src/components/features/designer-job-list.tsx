"use client";

import type { JobPosting } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase, CalendarDays, DollarSign, Tag, Eye } from "lucide-react";

interface DesignerJobListProps {
  jobs: JobPosting[];
  title?: string;
  emptyStateMessage?: string;
}

export function DesignerJobList({ 
  jobs, 
  title = "Available Jobs",
  emptyStateMessage = "No jobs currently match your profile or search. Check back soon!"
}: DesignerJobListProps) {

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{emptyStateMessage}</p>
         <Button asChild variant="outline">
          <Link href="/designers/preferences">Update Preferences</Link> {/* Placeholder */}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-foreground mb-6">{title}</h2>
      {jobs.map((job) => (
        <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
             <div className="flex flex-col md:flex-row justify-between md:items-start">
                <div>
                    <CardTitle className="text-2xl hover:text-primary">
                        <Link href={`/jobs/${job.id}`}>{job.title}</Link> {/* Link to job details page */}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarDays className="h-4 w-4 mr-1.5" /> Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </CardDescription>
                </div>
                <Badge variant="secondary" className="mt-2 md:mt-0 text-sm bg-primary/10 text-primary border-primary/30">
                    Client Budget: ${job.budget.toLocaleString()}
                </Badge>
             </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3 mb-4">{job.description}</p>
            <div className="mb-3">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1 flex items-center">
                <Tag className="h-4 w-4 mr-1.5 text-primary" />Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <Badge key={typeof skill === 'string' ? skill : skill.id} variant="outline" className="text-xs">
                    {typeof skill === 'string' ? skill : skill.text}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href={`/jobs/${job.id}`}> {/* Link to job details / apply page */}
                <Eye className="mr-2 h-4 w-4" /> View Details & Apply
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


"use client";

import type { JobPosting } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase, CalendarDays, DollarSign, Tag, Eye, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesignerJobListProps {
  jobs: JobPosting[];
  title?: string;
  emptyStateMessage?: string;
  onJobSelect?: (job: JobPosting) => void;
  selectedJobId?: string | null;
}

export function DesignerJobList({ 
  jobs, 
  title = "Available Jobs",
  emptyStateMessage = "No jobs currently match your profile or search. Check back soon!",
  onJobSelect,
  selectedJobId,
}: DesignerJobListProps) {

  if (jobs.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
        <div className="text-center py-8 border rounded-lg shadow-sm bg-card">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4 text-sm">{emptyStateMessage}</p>
          <Button asChild variant="link" size="sm" className="text-primary">
            <Link href="/designer/setup-profile">Update Profile Preferences</Link> 
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 pt-1 -mx-1 px-1"> {/* Horizontal scroller */}
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className={cn(
              "shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex-shrink-0 w-72 sm:w-80 flex flex-col", // Added flex flex-col
              selectedJobId === job.id ? "ring-2 ring-primary border-primary shadow-xl" : "border-border"
            )}
            onClick={() => onJobSelect && onJobSelect(job)}
          >
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                  <div>
                      <CardTitle className="text-lg font-semibold hover:text-primary leading-tight">
                          {job.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-xs text-muted-foreground mt-1">
                          <CalendarDays className="h-3 w-3 mr-1" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                      </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 self-start sm:self-center whitespace-nowrap">
                      Budget: {job.budget}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3 flex-grow"> {/* Added flex-grow */}
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{job.description}</p>
              <div className="mb-2">
                <h4 className="text-xs font-medium uppercase text-muted-foreground mb-0.5 flex items-center">
                  <Tag className="h-3 w-3 mr-1 text-primary" />Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {job.skillsRequired.slice(0, 2).map((skill) => ( 
                    <Badge key={typeof skill === 'string' ? skill : skill.id} variant="outline" className="text-xs px-1.5 py-0.5">
                      {typeof skill === 'string' ? skill : skill.text}
                    </Badge>
                  ))}
                  {job.skillsRequired.length > 2 && <Badge variant="outline" className="text-xs px-1.5 py-0.5">+{job.skillsRequired.length-2} more</Badge>}
                </div>
              </div>
               <div className="mt-2 text-xs text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-primary" />
                  {job.workPreference === 'local' ? job.clientCity || 'Local' : 'Remote'}
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-2 flex justify-end"> {/* Adjusted pt-2 */}
              <Button 
                size="sm" 
                variant={selectedJobId === job.id ? "default" : "outline"}
                className={cn("w-full", selectedJobId === job.id ? "bg-primary hover:bg-primary/90" : "")}
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (onJobSelect) {
                    onJobSelect(job);
                  }
                }}
              >
                <Eye className="mr-1.5 h-4 w-4" /> View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

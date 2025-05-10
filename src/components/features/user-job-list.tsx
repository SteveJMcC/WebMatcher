
"use client";

import type { JobPosting } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Edit3, Users, Briefcase, CalendarDays, DollarSign } from "lucide-react";

interface UserJobListProps {
  jobs: JobPosting[];
}

const statusColors: Record<JobPosting['status'], string> = {
  open: "bg-green-100 text-green-700 border-green-300",
  'in-progress': "bg-blue-100 text-blue-700 border-blue-300",
  closed: "bg-gray-100 text-gray-700 border-gray-300",
};

export function UserJobList({ jobs }: UserJobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Jobs Posted Yet</h2>
        <p className="text-muted-foreground mb-6">Ready to find the perfect designer? Post your first job today!</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/post-job">Post a Job</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div>
                <CardTitle className="text-2xl hover:text-primary">
                  <Link href={`/jobs/${job.id}/manage`}>{job.title}</Link>
                </CardTitle>
                <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarDays className="h-4 w-4 mr-1.5" /> Posted on {new Date(job.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="outline" className={`mt-2 md:mt-0 text-sm capitalize ${statusColors[job.status]}`}>
                {job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1.5 text-primary" /> 
                    Budget: ${job.budget.toLocaleString()}
                </div>
                <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1.5 text-primary" /> 
                    Bids: {job.bidsCount || 0}
                </div>
                 <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-1.5 text-primary" /> 
                    Skills: {job.skillsRequired.slice(0,2).map(s => typeof s === 'string' ? s : s.text).join(', ')}{job.skillsRequired.length > 2 ? "..." : ""}
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/jobs/${job.id}/edit`}> 
                <Edit3 className="mr-2 h-4 w-4" /> Edit Job
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href={`/jobs/${job.id}/manage`}>
                <Eye className="mr-2 h-4 w-4" /> View Bids & Manage
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

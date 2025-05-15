
// At the very top of src/app/admin/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useAuth } from '@/context/auth-context';
// …rest of your code


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, ShieldAlert, Eye, Trash2, AlertTriangle, PauseCircle, PlayCircle, ListChecks, CalendarDays } from 'lucide-react';
import type { StoredAuthData } from '@/hooks/use-auth-mock';
import type { JobPosting } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function AdminPage() {
  const [designers, setDesigners] = useState<StoredAuthData[]>([]);
  const [clients, setClients] = useState<StoredAuthData[]>([]);
  const [allJobs, setAllJobs] = useState<(JobPosting & { originalClientId: string; clientDisplayName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userToDelete, setUserToDelete] = useState<StoredAuthData | null>(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  const [jobToTogglePause, setJobToTogglePause] = useState<(JobPosting & { originalClientId: string; clientDisplayName?: string }) | null>(null);
  const [isPauseJobDialogOpen, setIsPauseJobDialogOpen] = useState(false);
  
  const [jobToDeleteAdmin, setJobToDeleteAdmin] = useState<(JobPosting & { originalClientId: string; clientDisplayName?: string }) | null>(null);
  const [isDeleteJobDialogOpen, setIsDeleteJobDialogOpen] = useState(false);

  const { toast } = useToast();

  const fetchAdminData = () => {
    setLoading(true);
    const profilesString = typeof window !== 'undefined' ? localStorage.getItem('mockUserProfiles') : null;
    const allProfiles: Record<string, StoredAuthData> = profilesString ? JSON.parse(profilesString) : {};
    
    const designerList: StoredAuthData[] = [];
    const clientList: StoredAuthData[] = [];
    Object.values(allProfiles).forEach(profile => {
      if (profile.userId) { 
        if (profile.userType === 'designer') {
          designerList.push(profile);
        } else if (profile.userType === 'user') {
          clientList.push(profile);
        }
      }
    });
    setDesigners(designerList);
    setClients(clientList);

    const jobsList: (JobPosting & { originalClientId: string; clientDisplayName?: string })[] = [];
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userJobs_')) {
          const clientIdFromKey = key.substring('userJobs_'.length);
          const jobsString = localStorage.getItem(key);
          if (jobsString) {
            const userJobs: JobPosting[] = JSON.parse(jobsString);
            userJobs.forEach(job => {
              const clientProfile = Object.values(allProfiles).find(p => p.userId === job.userId && p.userType === 'user');
              jobsList.push({ ...job, originalClientId: clientIdFromKey, clientDisplayName: clientProfile?.displayName || clientProfile?.email || 'Unknown Client' });
            });
          }
        }
      }
    }
    jobsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllJobs(jobsList);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "Admin Dashboard - WebMatcher";
    }
    fetchAdminData();
  }, []);

  const handleDeleteUserClick = (user: StoredAuthData) => {
    setUserToDelete(user);
    setIsDeleteUserDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete || !userToDelete.userId) return;

    const userIdToDelete = userToDelete.userId;
    const userTypeToDelete = userToDelete.userType;

    try {
      // 1. Remove user from mockUserProfiles
      const profilesString = localStorage.getItem('mockUserProfiles');
      let currentAllProfiles: Record<string, StoredAuthData> = profilesString ? JSON.parse(profilesString) : {};
      
      const userKeyToDelete = Object.keys(currentAllProfiles).find(key => currentAllProfiles[key].userId === userIdToDelete);
      if (userKeyToDelete) {
        delete currentAllProfiles[userKeyToDelete];
        localStorage.setItem('mockUserProfiles', JSON.stringify(currentAllProfiles));
      }

      // 2. Handle related data if client is deleted
      if (userTypeToDelete === 'user') {
        const clientJobsKey = `userJobs_${userIdToDelete}`;
        const clientJobsString = localStorage.getItem(clientJobsKey);
        if (clientJobsString) {
          let clientJobs: JobPosting[] = JSON.parse(clientJobsString);
          clientJobs = clientJobs.map(job => ({
            ...job,
            status: 'closed', // Mark job as closed
            adminDeletedNote: 'Client account has been removed by admin. This job is no longer active.'
          }));
          localStorage.setItem(clientJobsKey, JSON.stringify(clientJobs));
        }
      } else if (userTypeToDelete === 'designer') {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('userJobs_')) {
                const jobsString = localStorage.getItem(key);
                if (jobsString) {
                    let userJobs: JobPosting[] = JSON.parse(jobsString);
                    let modified = false;
                    userJobs = userJobs.map(job => {
                        if (job.applicants && job.applicants.some(app => app.designerId === userIdToDelete)) {
                            modified = true;
                            return {
                                ...job,
                                applicants: job.applicants.map(app => 
                                    app.designerId === userIdToDelete ? { ...app, status: 'designer_deleted' } : app
                                )
                            };
                        }
                        return job;
                    });
                    if (modified) {
                        localStorage.setItem(key, JSON.stringify(userJobs));
                    }
                }
            }
        }
      }
      fetchAdminData(); 
      toast({
        title: "User Deleted",
        description: `${userToDelete.displayName || userToDelete.email} has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    } finally {
      setIsDeleteUserDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handlePauseToggleClick = (job: JobPosting & { originalClientId: string }) => {
    setJobToTogglePause(job);
    setIsPauseJobDialogOpen(true);
  };

  const confirmTogglePauseJob = () => {
    if (!jobToTogglePause || !jobToTogglePause.originalClientId) return;

    const { id: jobIdToPause, originalClientId, adminPaused: currentAdminPaused, title: jobTitle } = jobToTogglePause;
    try {
      const storageKey = `userJobs_${originalClientId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        let clientJobs: JobPosting[] = JSON.parse(jobsString);
        clientJobs = clientJobs.map(job =>
          job.id === jobIdToPause ? { ...job, adminPaused: !currentAdminPaused } : job
        );
        localStorage.setItem(storageKey, JSON.stringify(clientJobs));
        fetchAdminData();
        toast({
          title: `Job ${currentAdminPaused ? "Resumed" : "Paused"}`,
          description: `The job "${jobTitle}" has been successfully ${currentAdminPaused ? "resumed" : "paused"}.`,
        });
      }
    } catch (error) {
      console.error("Error pausing/resuming job:", error);
      toast({ title: "Error", description: "Failed to update job status.", variant: "destructive" });
    } finally {
      setIsPauseJobDialogOpen(false);
      setJobToTogglePause(null);
    }
  };

  const handleDeleteJobClick = (job: JobPosting & { originalClientId: string }) => {
    setJobToDeleteAdmin(job);
    setIsDeleteJobDialogOpen(true);
  };

  const confirmDeleteJob = () => {
    if (!jobToDeleteAdmin || !jobToDeleteAdmin.originalClientId) return;
    const { id: jobIdToDelete, originalClientId, title: jobTitle } = jobToDeleteAdmin;
    try {
      const storageKey = `userJobs_${originalClientId}`;
      const jobsString = localStorage.getItem(storageKey);
      if (jobsString) {
        let clientJobs: JobPosting[] = JSON.parse(jobsString);
        clientJobs = clientJobs.filter(job => job.id !== jobIdToDelete);
        localStorage.setItem(storageKey, JSON.stringify(clientJobs));
        fetchAdminData();
        toast({
          title: "Job Deleted",
          description: `The job "${jobTitle}" has been permanently deleted.`,
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({ title: "Error", description: "Failed to delete job.", variant: "destructive" });
    } finally {
      setIsDeleteJobDialogOpen(false);
      setJobToDeleteAdmin(null);
    }
  };

  const getJobStatusDisplay = (job: JobPosting) => {
    if (job.adminPaused) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50">Paused by Admin (Was {job.status})</Badge>;
    }
    if (job.adminDeletedNote) {
      return <Badge variant="destructive">{job.status} (Client Deleted)</Badge>
    }
    return <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className={`capitalize ${job.status === 'open' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{job.status}</Badge>;
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-10">
          <ShieldAlert className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <Card key={`skel-card-${i}`}>
              <CardHeader> <Skeleton className="h-8 w-1/2" /></CardHeader>
              <CardContent className="space-y-4"> {[1,2,3].map(j => <Skeleton key={`skel-item-${i}-${j}`} className="h-16 w-full" />)} </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center">
          <ShieldAlert className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground mt-1">Manage users, jobs, and site content.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Clients List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Users className="mr-2 h-6 w-6 text-primary"/> Clients ({clients.length})</CardTitle>
            <CardDescription>List of all registered clients.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            {clients.length > 0 ? clients.map(client => (
              <Card key={client.userId} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12 border">
                    <AvatarImage src={client.userAvatarUrl || `https://i.pravatar.cc/150?u=${client.email}`} alt={client.displayName || 'Client'} data-ai-hint="client avatar"/>
                    <AvatarFallback>{getInitials(client.displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{client.displayName || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-center justify-end w-full sm:w-auto">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/client/${client.userId}`}>
                       <Eye className="mr-1.5 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUserClick(client)}>
                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No clients found.</p>}
          </CardContent>
        </Card>

        {/* Web Professionals List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Briefcase className="mr-2 h-6 w-6 text-primary"/> Web Professionals ({designers.length})</CardTitle>
            <CardDescription>List of all registered designers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            {designers.length > 0 ? designers.map(designer => (
              <Card key={designer.userId} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={designer.designerAvatarUrl || `https://i.pravatar.cc/150?u=${designer.email}`} alt={designer.displayName || 'Designer'} data-ai-hint="designer avatar" />
                    <AvatarFallback>{getInitials(designer.displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{designer.displayName || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{designer.email}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-2 self-stretch sm:self-center justify-end w-full sm:w-auto">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/designer/${designer.userId}`}>
                      <Eye className="mr-1.5 h-4 w-4" /> View
                    </Link>
                  </Button>
                   <Button variant="destructive" size="sm" onClick={() => handleDeleteUserClick(designer)}>
                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No web professionals found.</p>}
          </CardContent>
        </Card>

        {/* All Jobs List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary"/> All Job Postings ({allJobs.length})</CardTitle>
            <CardDescription>Manage all job postings on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            {allJobs.length > 0 ? allJobs.map(job => (
              <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                    <div>
                        <p className="font-semibold text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">Client: {job.clientDisplayName}</p>
                    </div>
                    {getJobStatusDisplay(job)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{job.description}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                    <CalendarDays className="h-3 w-3 mr-1"/> Posted: {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap justify-start sm:justify-end items-center gap-2 mt-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/jobs/${job.id}/manage`}>
                       <Eye className="mr-1.5 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePauseToggleClick(job)}>
                    {job.adminPaused ? <PlayCircle className="mr-1.5 h-4 w-4" /> : <PauseCircle className="mr-1.5 h-4 w-4" />}
                    {job.adminPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteJobClick(job)}>
                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No jobs found.</p>}
          </CardContent>
        </Card>
      </div>
      
      {/* User Deletion Dialog */}
      <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-destructive mr-2"/>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user 
              <span className="font-semibold"> {userToDelete?.displayName || userToDelete?.email}</span>.
              {userToDelete?.userType === 'user' && ' All their jobs will be marked as closed with an admin note.'}
              {userToDelete?.userType === 'designer' && ' Their applications on jobs will be marked accordingly.'}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteUserDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Yes, delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Job Pause/Resume Dialog */}
      <AlertDialog open={isPauseJobDialogOpen} onOpenChange={setIsPauseJobDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              {jobToTogglePause?.adminPaused ? <PlayCircle className="text-primary mr-2"/> : <PauseCircle className="text-orange-500 mr-2"/>}
              Confirm Job Status Change
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {jobToTogglePause?.adminPaused ? 'resume' : 'pause'} the job 
              "<span className="font-semibold">{jobToTogglePause?.title}</span>"?
              {jobToTogglePause && !jobToTogglePause.adminPaused && " Paused jobs will not be visible to web professionals."}
              {jobToTogglePause && jobToTogglePause.adminPaused && " Resumed jobs will become visible again if their status is 'open'."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsPauseJobDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTogglePauseJob} className={jobToTogglePause?.adminPaused ? "bg-primary hover:bg-primary/90" : "bg-orange-500 hover:bg-orange-600"}>
              Yes, {jobToTogglePause?.adminPaused ? 'Resume' : 'Pause'} Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Job Deletion Dialog */}
      <AlertDialog open={isDeleteJobDialogOpen} onOpenChange={setIsDeleteJobDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-destructive mr-2"/>Delete Job Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the job 
              "<span className="font-semibold">{jobToDeleteAdmin?.title}</span>"? 
              This action cannot be undone and will remove the job listing entirely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteJobDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteJob} className="bg-destructive hover:bg-destructive/90">
              Yes, delete job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}


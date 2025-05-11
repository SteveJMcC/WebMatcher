
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, ShieldAlert, Eye, Trash2, AlertTriangle } from 'lucide-react';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';


const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function AdminPage() {
  const [designers, setDesigners] = useState<StoredAuthData[]>([]);
  const [clients, setClients] = useState<StoredAuthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<StoredAuthData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = () => {
    const profilesString = typeof window !== 'undefined' ? localStorage.getItem('mockUserProfiles') : null;
    if (profilesString) {
      try {
        const allProfiles: Record<string, StoredAuthData> = JSON.parse(profilesString);
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
      } catch (error) {
        console.error("Error parsing user profiles from localStorage", error);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "Admin Dashboard - WebConnect";
    }
    fetchUsers();
    setLoading(false);
  }, []);

  const handleDeleteClick = (user: StoredAuthData) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete || !userToDelete.userId) return;

    const userIdToDelete = userToDelete.userId;
    const userTypeToDelete = userToDelete.userType;

    try {
      // 1. Remove user from mockUserProfiles
      const profilesString = localStorage.getItem('mockUserProfiles');
      let allProfiles: Record<string, StoredAuthData> = profilesString ? JSON.parse(profilesString) : {};
      
      const userKeyToDelete = Object.keys(allProfiles).find(key => allProfiles[key].userId === userIdToDelete);
      if (userKeyToDelete) {
        delete allProfiles[userKeyToDelete];
        localStorage.setItem('mockUserProfiles', JSON.stringify(allProfiles));
      }

      // 2. Handle related data if client is deleted
      if (userTypeToDelete === 'user') {
        const clientJobsKey = `userJobs_${userIdToDelete}`;
        const clientJobsString = localStorage.getItem(clientJobsKey);
        if (clientJobsString) {
          let clientJobs: JobPosting[] = JSON.parse(clientJobsString);
          clientJobs = clientJobs.map(job => ({
            ...job,
            status: 'closed',
            adminDeletedNote: 'Client account has been removed by admin. This job is no longer active.'
          }));
          localStorage.setItem(clientJobsKey, JSON.stringify(clientJobs));
          // Note: Bids on these jobs will reflect this indirectly when the job page is viewed.
        }
      } else if (userTypeToDelete === 'designer') {
        // If a designer is deleted, update their applications on jobs
        // This is more complex as it involves iterating through all clients' jobs
        // For simplicity, we'll rely on JobBidsDisplay handling missing designer profiles
        // However, ideally, we'd mark applications here.
        // Example of marking applications:
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

      // 3. Update admin page state
      fetchUsers(); // Re-fetch users to update lists

      toast({
        title: "User Deleted",
        description: `${userToDelete.displayName || userToDelete.email} has been successfully deleted.`,
        variant: "default",
      });

    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-10">
          <ShieldAlert className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
               {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </CardContent>
          </Card>
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
        <p className="text-lg text-muted-foreground mt-1">Manage users and site content.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Clients List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Users className="mr-2 h-6 w-6 text-primary"/> Clients ({clients.length})</CardTitle>
            <CardDescription>List of all registered clients.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {clients.length > 0 ? clients.map(client => (
              <Card key={client.userId} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
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
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/client/${client.userId}`}>
                       <Eye className="mr-1.5 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(client)}>
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
            <CardDescription>List of all registered designers and web professionals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {designers.length > 0 ? designers.map(designer => (
              <Card key={designer.userId} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
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
                 <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/designer/${designer.userId}`}>
                      <Eye className="mr-1.5 h-4 w-4" /> View
                    </Link>
                  </Button>
                   <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(designer)}>
                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No web professionals found.</p>}
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-destructive mr-2"/>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user 
              <span className="font-semibold"> {userToDelete?.displayName || userToDelete?.email}</span>
              {userToDelete?.userType === 'user' && ' and mark all their associated jobs as closed.'}
              {userToDelete?.userType === 'designer' && ' and their applications will be marked accordingly.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Yes, delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

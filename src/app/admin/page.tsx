
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, UserCircle, ShieldAlert, Eye } from 'lucide-react';
import type { StoredAuthData } from '@/hooks/use-auth-mock'; // Ensure StoredAuthData is exported
import { Skeleton } from '@/components/ui/skeleton';

const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function AdminPage() {
  const [designers, setDesigners] = useState<StoredAuthData[]>([]);
  const [clients, setClients] = useState<StoredAuthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "Admin Dashboard - WebConnect";
    }
    
    const profilesString = localStorage.getItem('mockUserProfiles');
    if (profilesString) {
      try {
        const allProfiles: Record<string, StoredAuthData> = JSON.parse(profilesString);
        const designerList: StoredAuthData[] = [];
        const clientList: StoredAuthData[] = [];
        Object.values(allProfiles).forEach(profile => {
          if (profile.userType === 'designer') {
            designerList.push(profile);
          } else if (profile.userType === 'user') {
            clientList.push(profile);
          }
        });
        setDesigners(designerList);
        setClients(clientList);
      } catch (error) {
        console.error("Error parsing user profiles from localStorage", error);
      }
    }
    setLoading(false);
  }, []);

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
                 <Button asChild variant="outline" size="sm">
                  <Link href={`/client/${client.userId}`}>
                     <Eye className="mr-1.5 h-4 w-4" /> View Profile
                  </Link>
                </Button>
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
                <Button asChild variant="outline" size="sm">
                  <Link href={`/designer/${designer.userId}`}>
                    <Eye className="mr-1.5 h-4 w-4" /> View Profile
                  </Link>
                </Button>
              </Card>
            )) : <p className="text-muted-foreground">No web professionals found.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

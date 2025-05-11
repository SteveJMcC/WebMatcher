
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClientProfileView } from '@/components/features/client-profile-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserCircle, ArrowLeft } from 'lucide-react';
import type { StoredAuthData } from '@/hooks/use-auth-mock'; // Import the StoredAuthData type
import type { UserProfile } from '@/lib/types';


async function getClientProfile(clientId: string): Promise<UserProfile | null> {
    if (typeof window === 'undefined') return null;

    const profilesString = localStorage.getItem('mockUserProfiles');
    if (profilesString) {
        try {
            const allProfiles: Record<string, StoredAuthData> = JSON.parse(profilesString);
            const clientData = Object.values(allProfiles).find(
                p => p.userId === clientId && p.userType === 'user'
            );

            if (clientData) {
                return {
                    id: clientData.userId || clientId,
                    userId: clientData.userId || clientId,
                    name: clientData.displayName || "Client User",
                    companyName: clientData.companyName || undefined,
                    email: clientData.email || undefined,
                    // Assuming joinedDate is stored or can be derived; otherwise, provide a default
                    joinedDate: clientData.joinedDate || new Date().toISOString(),
                };
            }
        } catch (error) {
            console.error("Error fetching client profile from localStorage:", error);
        }
    }
    return null;
}


export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof document !== 'undefined' && profile) {
      document.title = `${profile.name} - Client Profile | WebConnect`;
    } else if (typeof document !== 'undefined' && !profile && !loading) {
      document.title = "Client Not Found | WebConnect";
    }
  }, [profile, loading]);

  useEffect(() => {
    if (clientId) {
      setLoading(true);
      setError(null);
      getClientProfile(clientId)
        .then(data => {
          if (data) {
            setProfile(data);
          } else {
            setError("Client profile not found.");
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch client profile:", err);
          setError("Failed to load client profile. Please try again.");
          setLoading(false);
        });
    } else {
      setError("Client ID is missing.");
      setLoading(false);
    }
  }, [clientId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-32 w-full mb-8" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <UserCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin</Link>
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Alert className="max-w-md mx-auto">
          <UserCircle className="h-4 w-4" />
          <AlertTitle>Client Not Found</AlertTitle>
          <AlertDescription>The client profile you are looking for does not exist.</AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <ClientProfileView profile={profile} />
    </div>
  );
}

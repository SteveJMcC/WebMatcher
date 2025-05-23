
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DesignerProfileView } from "@/components/features/designer-profile-view";
import type { DesignerProfile } from "@/lib/types";
import type { StoredAuthData } from '@/hooks/use-auth-mock';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserCircle, ArrowLeft } from 'lucide-react';

async function getDesignerProfile(designerId: string): Promise<DesignerProfile | null> {
  if (typeof window === 'undefined') return null;

  const profilesString = localStorage.getItem('mockUserProfiles');
  if (profilesString) {
    try {
      const allProfiles: Record<string, StoredAuthData> = JSON.parse(profilesString);
      const designerData = Object.values(allProfiles).find(
        p => p.userId === designerId && p.userType === 'designer'
      );

      if (designerData) {
        return {
          id: designerData.userId || designerId,
          userId: designerData.userId || designerId,
          name: designerData.displayName || "Web Professional",
          headline: designerData.designerHeadline || "Experienced Web Professional",
          avatarUrl: designerData.designerAvatarUrl || `https://picsum.photos/seed/${designerData.email || designerId}/200/200`,
          skills: designerData.designerSkills || [],
          bio: designerData.designerBio || "No bio available.",
          portfolioLinks: designerData.designerPortfolioLinks || [],
          budgetMin: designerData.designerBudgetMin ?? 0,
          budgetMax: designerData.designerBudgetMax ?? 0,
          tokens: designerData.designerTokens ?? 200, // Ensure default to 200 if undefined
          email: designerData.designerEmail || designerData.email || "No email provided",
          phone: designerData.designerPhone || "No phone provided",
          city: designerData.designerCity || "Not specified",
          postalCode: designerData.designerPostalCode || "N/A",
          joinedDate: designerData.joinedDate || new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error("Error fetching designer profile from localStorage:", error);
    }
  }
  
  // If not found in localStorage, return null. Specific hardcoded fallbacks are removed.
  return null;
}

export default function DesignerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const designerId = params.designerId as string;
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (profile) {
        document.title = `${profile.name} - Designer Profile | WebMatcher`;
      } else if (!loading && !profile) {
        document.title = "Designer Not Found | WebMatcher";
      }
    }
  }, [profile, loading]);

  useEffect(() => {
    if (designerId) {
      setLoading(true);
      setError(null);
      getDesignerProfile(designerId)
        .then(data => {
          if (data) {
            setProfile(data);
          } else {
            setError("Designer profile not found.");
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch designer profile:", err);
          setError("Failed to load designer profile. Please try again.");
          setLoading(false);
        });
    } else {
      setError("Designer ID is missing.");
      setLoading(false);
    }
  }, [designerId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-48 w-full mb-8" /> {/* Header card skeleton */}
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full" /> {/* About me */}
                <Skeleton className="h-32 w-full" /> {/* Skills */}
            </div>
            <div className="space-y-8">
                <Skeleton className="h-24 w-full" /> {/* Budget */}
                <Skeleton className="h-32 w-full" /> {/* Portfolio */}
                <Skeleton className="h-32 w-full" /> {/* Contact */}
            </div>
        </div>
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
          <Link href="/designers"><ArrowLeft className="mr-2 h-4 w-4" /> Browse Designers</Link>
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Alert className="max-w-md mx-auto">
          <UserCircle className="h-4 w-4" />
          <AlertTitle>Designer Not Found</AlertTitle>
          <AlertDescription>The designer profile you are looking for does not exist or could not be loaded.</AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/designers"><ArrowLeft className="mr-2 h-4 w-4" /> Browse Designers</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
       <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <DesignerProfileView profile={profile} />
    </div>
  );
}


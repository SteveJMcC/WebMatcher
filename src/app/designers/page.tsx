
'use client';
export const dynamic = 'force-dynamic';

import { useAuth } from '@/context/auth-context';


import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { DesignerProfile, Tag as SkillTag } from "@/lib/types";
import type { StoredAuthData } from '@/hooks/use-auth-mock';
import { Star, Briefcase, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Skeleton } from '@/components/ui/skeleton';

const DESIGNERS_PER_PAGE = 6;

// Enhanced mock data for fallback / initial load
const initialMockDesigners: DesignerProfile[] = [
  {
    id: "mock-designer-123",
    userId: "user-abc-123",
    name: "Elena Rodriguez",
    headline: "Innovative Web & Mobile UI/UX Designer",
    avatarUrl: "https://picsum.photos/seed/elena/100/100",
    skills: [{id: "ui", text:"UI Design"}, {id:"ux", text:"UX Design"}, {id:"figma", text:"Figma"}],
    bio: "Passionate about creating user-centric digital experiences.",
    portfolioLinks: [],
    budgetMin: 1500,
    budgetMax: 8000,
    tokens: 25,
    email: "elena.rodriguez@example.com",
    phone: "+15551234567",
    city: "New York",
    postalCode: "10001",
    joinedDate: new Date('2021-06-15T10:00:00.000Z').toISOString(),
  },
  {
    id: "mock-designer-456",
    userId: "user-def-456",
    name: "Marcus Chen",
    headline: "Brand Identity & Graphic Design Expert",
    avatarUrl: "https://picsum.photos/seed/marcus/100/100",
    skills: [{id:"branding", text:"Branding"}, {id:"logo", text:"Logo Design"}, {id:"illustrator", text:"Illustrator"}],
    bio: "Crafting memorable brands that tell a story.",
    portfolioLinks: [],
    budgetMin: 1200,
    budgetMax: 6000,
    tokens: 18,
    email: "marcus.chen@example.com",
    phone: "+15557654321",
    city: "San Francisco",
    postalCode: "94107",
    joinedDate: new Date('2022-01-20T10:00:00.000Z').toISOString(),
  },
   {
    id: "mock-designer-789",
    userId: "user-ghi-789",
    name: "Aisha Khan",
    headline: "Full-Stack Web Developer & Designer",
    avatarUrl: "https://picsum.photos/seed/aisha/100/100",
    skills: [{id:"react", text:"React"}, {id:"nextjs", text:"Next.js"}, {id:"web-design", text:"Web Design"}],
    bio: "Building beautiful and functional websites from concept to deployment.",
    portfolioLinks: [],
    budgetMin: 2000,
    budgetMax: 10000,
    tokens: 30,
    email: "aisha.khan@example.com",
    phone: "+15559876543",
    city: "London",
    postalCode: "SW1A 1AA",
    joinedDate: new Date('2020-11-05T10:00:00.000Z').toISOString(),
  },
  {
    id: "mock-designer-101",
    userId: "user-jkl-101",
    name: "James Lee",
    headline: "E-commerce Shopify Specialist",
    avatarUrl: "https://picsum.photos/seed/james/100/100",
    skills: [{id:"shopify", text:"Shopify"}, {id:"e-commerce", text:"E-commerce"}, {id:"seo", text:"SEO"}],
    bio: "Helping businesses thrive online with powerful Shopify stores.",
    portfolioLinks: [], budgetMin: 1800, budgetMax: 7500, tokens: 22,
    email: "james.lee@example.com", phone: "+15551112222", city: "Toronto", postalCode: "M5V 2T6",
    joinedDate: new Date('2022-03-10T10:00:00.000Z').toISOString(),
  },
  {
    id: "mock-designer-102",
    userId: "user-mno-102",
    name: "Sofia Garcia",
    headline: "Creative WordPress Developer",
    avatarUrl: "https://picsum.photos/seed/sofia/100/100",
    skills: [{id:"wordpress", text:"WordPress"}, {id:"php", text:"PHP"}, {id:"css", text:"CSS"}],
    bio: "Building custom WordPress themes and plugins for diverse clients.",
    portfolioLinks: [], budgetMin: 800, budgetMax: 4500, tokens: 40,
    email: "sofia.garcia@example.com", phone: "+15553334444", city: "Miami", postalCode: "33101",
    joinedDate: new Date('2021-09-01T10:00:00.000Z').toISOString(),
  },
  {
    id: "mock-designer-103",
    userId: "user-pqr-103",
    name: "David Miller",
    headline: "Mobile-First App Designer (iOS & Android)",
    avatarUrl: "https://picsum.photos/seed/david/100/100",
    skills: [{id:"mobile-app-design", text:"Mobile App Design"}, {id:"swift", text:"Swift"}, {id:"kotlin", text:"Kotlin"}],
    bio: "Designing intuitive and engaging mobile applications.",
    portfolioLinks: [], budgetMin: 3000, budgetMax: 12000, tokens: 15,
    email: "david.miller@example.com", phone: "+15555556666", city: "Austin", postalCode: "78701",
    joinedDate: new Date('2023-01-15T10:00:00.000Z').toISOString(),
  },
  {
    id: "mock-designer-104",
    userId: "user-stu-104",
    name: "Chloe Dubois",
    headline: "SaaS Product Designer & UX Strategist",
    avatarUrl: "https://picsum.photos/seed/chloe/100/100",
    skills: [{id:"saas-design", text:"SaaS Design"}, {id:"ux-strategy", text:"UX Strategy"}, {id:"user-research", text:"User Research"}],
    bio: "Focused on creating scalable and user-friendly SaaS products.",
    portfolioLinks: [], budgetMin: 4000, budgetMax: 20000, tokens: 50,
    email: "chloe.dubois@example.com", phone: "+15557778888", city: "Vancouver", postalCode: "V6C 1S4",
    joinedDate: new Date('2020-05-20T10:00:00.000Z').toISOString(),
  },
  {
    id: "mock-designer-105",
    userId: "user-vwx-105",
    name: "Kenji Tanaka",
    headline: "React & Next.js Front-End Developer",
    avatarUrl: "https://picsum.photos/seed/kenji/100/100",
    skills: [{id:"react", text:"React"}, {id:"nextjs", text:"Next.js"}, {id:"typescript", text:"TypeScript"}],
    bio: "Building high-performance web applications with modern JavaScript frameworks.",
    portfolioLinks: [], budgetMin: 2500, budgetMax: 9000, tokens: 33,
    email: "kenji.tanaka@example.com", phone: "+15559990000", city: "Tokyo", postalCode: "100-0001",
    joinedDate: new Date('2022-07-11T10:00:00.000Z').toISOString(),
  }
];


const getInitials = (name: string) => {
    if (!name) return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function FindDesignersPage() {
  const [allDesigners, setAllDesigners] = useState<DesignerProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const profilesString = localStorage.getItem('mockUserProfiles');
      let fetchedDesigners: DesignerProfile[] = [];
      if (profilesString) {
        const allProfiles: Record<string, StoredAuthData> = JSON.parse(profilesString);
        Object.values(allProfiles).forEach(profile => {
          if (profile.userType === 'designer' && profile.userId) {
            fetchedDesigners.push({
              id: profile.userId,
              userId: profile.userId,
              name: profile.displayName || "Web Professional",
              headline: profile.designerHeadline || "Experienced Web Professional",
              avatarUrl: profile.designerAvatarUrl || `https://picsum.photos/seed/${profile.email || profile.userId}/100/100`,
              skills: profile.designerSkills || [],
              bio: profile.designerBio || "No bio available.",
              portfolioLinks: profile.designerPortfolioLinks || [],
              budgetMin: profile.designerBudgetMin ?? 0,
              budgetMax: profile.designerBudgetMax ?? 0,
              tokens: profile.designerTokens ?? 0,
              email: profile.designerEmail || profile.email || "No email",
              phone: profile.designerPhone || "No phone",
              city: profile.designerCity || "Not specified",
              postalCode: profile.designerPostalCode || "N/A",
              joinedDate: profile.joinedDate || new Date().toISOString(),
            });
          }
        });
      }
      
      // Merge with initial mock designers, ensuring no duplicates by ID
      initialMockDesigners.forEach(mockDesigner => {
        if (!fetchedDesigners.some(fetched => fetched.id === mockDesigner.id)) {
          fetchedDesigners.push(mockDesigner);
        }
      });

      fetchedDesigners.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
      setAllDesigners(fetchedDesigners);
    }
    setIsLoading(false);
  }, []);
  
  const filteredDesigners = allDesigners.filter(designer => 
    designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    designer.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    designer.skills.some(skill => (typeof skill === 'string' ? skill : skill.text).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDesigners.length / DESIGNERS_PER_PAGE);
  const startIndex = (currentPage - 1) * DESIGNERS_PER_PAGE;
  const endIndex = startIndex + DESIGNERS_PER_PAGE;
  const displayedDesigners = filteredDesigners.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <Skeleton className="h-10 w-3/5 mx-auto mb-4" />
          <Skeleton className="h-6 w-4/5 mx-auto" />
        </header>
        <div className="mb-10 p-6 bg-secondary rounded-lg shadow">
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(DESIGNERS_PER_PAGE)].map((_, i) => (
            <Card key={i} className="flex flex-col shadow-lg">
              <CardHeader className="flex-row items-center gap-4 pb-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Find Top Design Talent</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our curated list of professional web designers. Filter by skills, budget, and experience to find your perfect match.
        </p>
      </header>

      <div className="mb-10 p-6 bg-secondary rounded-lg shadow">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search-designers" className="block text-sm font-medium text-foreground mb-1">
              Search by keyword or skill
            </label>
            <div className="relative">
              <Input
                id="search-designers"
                type="text"
                placeholder="e.g., Figma, UI Design, Branding"
                className="pr-10 text-base py-3"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          {/* Search button might not be needed if search is live, but kept for now */}
          <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90">
            Search Designers
          </Button>
        </div>
      </div>

      {displayedDesigners.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDesigners.map((designer) => (
            <Card key={designer.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex-row items-center gap-4 pb-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={designer.avatarUrl || `https://picsum.photos/seed/${designer.id}/100/100`} alt={designer.name} data-ai-hint="designer avatar" />
                  <AvatarFallback className="text-2xl">{getInitials(designer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl hover:text-primary">
                    <Link href={`/designer/${designer.id}`}>{designer.name}</Link>
                  </CardTitle>
                  <CardDescription className="text-sm">{designer.headline}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Top Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {designer.skills.slice(0, 3).map((skill: SkillTag | string) => (
                       <Badge key={typeof skill === 'string' ? skill : skill.id} variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {typeof skill === 'string' ? skill : skill.text}
                      </Badge>
                    ))}
                    {designer.skills.length > 3 && <Badge variant="outline" className="text-xs">+{designer.skills.length - 3} more</Badge>}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Project Budget: ${designer.budgetMin.toLocaleString()} - ${designer.budgetMax.toLocaleString()}
                </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                  4.9 <span className="ml-1">(120 reviews)</span> {/* Placeholder */}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/designer/${designer.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Designers Found</h2>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

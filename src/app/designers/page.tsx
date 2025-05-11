import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { DesignerProfile, Tag as SkillTag } from "@/lib/types";
import { Star, Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Mock data for designer listings
const mockDesigners: DesignerProfile[] = [
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
    phone: "+15559876543", // Added phone to ensure consistency
    city: "London",
    postalCode: "SW1A 1AA",
    joinedDate: new Date('2020-11-05T10:00:00.000Z').toISOString(),
  },
];

const getInitials = (name: string) => {
    if (!name) return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function FindDesignersPage() {
  // TODO: Implement actual filtering and pagination
  const designers = mockDesigners;

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Find Top Design Talent</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our curated list of professional web designers. Filter by skills, budget, and experience to find your perfect match.
        </p>
      </header>

      {/* Search and Filter Bar Placeholder */}
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
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90">
            Search Designers
          </Button>
        </div>
        {/* Add more filter options here: budget, experience, etc. */}
      </div>

      {designers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designers.map((designer) => (
            <Card key={designer.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex-row items-center gap-4 pb-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint="designer avatar" />
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
                  Project Budget: ${designer.budgetMin} - ${designer.budgetMax}
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

      {/* Pagination Placeholder */}
      {designers.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="mr-2">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      )}
    </div>
  );
}

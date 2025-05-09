import { DesignerProfileView } from "@/components/features/designer-profile-view";
import type { DesignerProfile } from "@/lib/types";
import { Metadata } from "next";
import { Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data fetching function
async function getDesignerProfile(id: string): Promise<DesignerProfile | null> {
  // In a real app, you'd fetch this from your database
  if (id === "mock-designer-123") { // Example ID, can be any string
    return {
      id: "mock-designer-123",
      userId: "user-abc-123",
      name: "Elena Rodriguez",
      headline: "Innovative Web & Mobile UI/UX Designer",
      avatarUrl: "https://picsum.photos/seed/elena/200/200",
      skills: [
        { id: "ui-design", text: "UI Design" },
        { id: "ux-design", text: "UX Design" },
        { id: "figma", text: "Figma" },
        { id: "web-design", text: "Web Design" },
        { id: "mobile-app-design", text: "Mobile App Design" },
        { id: "prototyping", text: "Prototyping" },
      ],
      bio: "Passionate about creating user-centric and visually stunning digital experiences. With over 7 years in the industry, I've helped startups and established companies elevate their products through thoughtful design. My process involves deep user research, iterative prototyping, and close collaboration with development teams to ensure seamless execution. I believe great design not only looks good but also solves real problems and drives business goals.",
      portfolioLinks: [
        { title: "Personal Portfolio Site", url: "https://elenarodriguez.design" },
        { title: "Behance Profile", url: "https://behance.net/elenaro" },
        { title: "Dribbble Shots", url: "https://dribbble.com/elenaro" },
      ],
      budgetMin: 1500,
      budgetMax: 8000,
      tokens: 25,
      email: "elena.rodriguez@example.com",
      joinedDate: new Date('2021-06-15T10:00:00.000Z').toISOString(),
    };
  }
  return null;
}

interface PageProps {
  params: { designerId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = await getDesignerProfile(params.designerId);
  if (!profile) {
    return {
      title: "Designer Not Found - WebConnect",
    };
  }
  return {
    title: `${profile.name} - Designer Profile | WebConnect`,
    description: profile.headline,
  };
}

export default async function DesignerProfilePage({ params }: PageProps) {
  const profile = await getDesignerProfile(params.designerId);

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Designer Not Found</h1>
        <p className="text-muted-foreground">The designer profile you're looking for doesn't exist or couldn't be loaded.</p>
         <Button asChild className="mt-6">
            <a href="/designers">Browse Designers</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DesignerProfileView profile={profile} />
    </div>
  );
}

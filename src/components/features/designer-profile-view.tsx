"use client";

import type { DesignerProfile, Tag as SkillTag } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, DollarSign, ExternalLink, Mail, MapPin, Palette, Star, CheckCircle, Award, Phone, UserCircle as UserIconLucide, HomeIcon } from "lucide-react";
import Image from "next/image";

interface DesignerProfileViewProps {
  profile: DesignerProfile;
}

const getInitials = (name: string) => {
    if (!name) return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function DesignerProfileView({ profile }: DesignerProfileViewProps) {
  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-48 bg-gradient-to-r from-primary to-teal-400">
            {/* Optional: Banner image */}
            <Image src="https://picsum.photos/seed/designerbg/1200/200" alt="Profile banner" layout="fill" objectFit="cover" data-ai-hint="abstract background" />
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <CardContent className="relative -mt-16 flex flex-col items-center text-center p-6 pt-0 md:flex-row md:items-end md:text-left md:space-x-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.id}`} alt={profile.name} data-ai-hint="designer portrait" />
              <AvatarFallback className="text-4xl">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 md:pb-2 flex-grow">
              <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-lg text-primary">{profile.headline}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" /> 
                <span>{profile.city && profile.postalCode ? `${profile.city}, ${profile.postalCode}` : 'Global'}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> <span>4.9 (120 reviews)</span> {/* Placeholder */}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:pb-2 space-x-2">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Mail className="mr-2 h-4 w-4" /> Contact {profile.name.split(' ')[0]}
              </Button>
              <Button variant="outline">
                <Briefcase className="mr-2 h-4 w-4" /> Invite to Job
              </Button>
            </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: About, Skills, Budget */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center"><UserIconLucide className="mr-2 h-6 w-6 text-primary" /> About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" /> Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profile.skills.map((skill: SkillTag | string) => ( 
                <Badge key={typeof skill === 'string' ? skill : skill.id} variant="secondary" className="text-sm px-3 py-1 bg-primary/10 text-primary">
                  {typeof skill === 'string' ? skill : skill.text}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Budget, Portfolio, Stats, Contact */}
        <div className="space-y-8">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> Budget Range</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">
                ${profile.budgetMin.toLocaleString()} - ${profile.budgetMax.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Per project (USD)</p>
            </CardContent>
          </Card>
          
          {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.portfolioLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline group"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate group-hover:text-primary/80">{link.title}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Mail className="mr-2 h-5 w-5 text-primary" /> Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {profile.email && (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground break-all">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">{profile.phone}</span>
                </div>
              )}
               {(profile.city || profile.postalCode) && (
                <div className="flex items-center">
                  <HomeIcon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">
                    {profile.city}{profile.city && profile.postalCode && ", "}{profile.postalCode}
                  </span>
                </div>
              )}
              {(!profile.email && !profile.phone && !profile.city && !profile.postalCode) && (
                <p className="text-muted-foreground italic">No contact details publicly shared.</p>
              )}
            </CardContent>
          </Card>


          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Jobs Completed:</span> <span className="font-semibold text-foreground">50+</span></div>
                <div className="flex justify-between"><span>Success Rate:</span> <span className="font-semibold text-foreground">98%</span></div>
                <div className="flex justify-between"><span>Joined:</span> <span className="font-semibold text-foreground">{new Date(profile.joinedDate).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span>Tokens:</span> <span className="font-semibold text-foreground">{profile.tokens}</span></div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

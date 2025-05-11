
"use client";

import type { UserProfile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CalendarDays, Mail, UserCircle as UserIconLucide } from "lucide-react";
import Image from "next/image";
import { maskEmail } from "@/lib/masking-utils";

interface ClientProfileViewProps {
  profile: UserProfile;
}

const getInitials = (name?: string) => {
    if (!name) return "C";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function ClientProfileView({ profile }: ClientProfileViewProps) {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-40 bg-gradient-to-r from-primary/70 to-teal-500/70">
          <Image 
            src="https://picsum.photos/seed/clientbg/1200/160" 
            alt="Profile banner" 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint="abstract banner" 
            className="opacity-50"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <CardContent className="relative -mt-12 flex flex-col items-center text-center p-6 pt-0 md:flex-row md:items-end md:text-left md:space-x-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${profile.email || profile.id}`} alt={profile.name} data-ai-hint="person photo" />
            <AvatarFallback className="text-3xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 md:mt-0 md:pb-1 flex-grow">
            <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
            {profile.companyName && <p className="text-md text-primary flex items-center justify-center md:justify-start"><Building className="mr-1.5 h-4 w-4" /> {profile.companyName}</p>}
            {!profile.companyName && <p className="text-md text-muted-foreground">Individual Client</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><UserIconLucide className="mr-2 h-5 w-5 text-primary" /> Client Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.email && (
            <div className="flex items-center text-foreground">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{maskEmail(profile.email)}</span>
            </div>
          )}
          {profile.companyName && (
             <div className="flex items-center text-foreground">
              <Building className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{profile.companyName}</span>
            </div>
          )}
          <div className="flex items-center text-foreground">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Joined: {new Date(profile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
           <div className="pt-4 text-sm text-muted-foreground">
            Client ID: {profile.userId}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

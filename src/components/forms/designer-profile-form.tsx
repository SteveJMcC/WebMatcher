"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignerProfileSchema, type DesignerProfileFormData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { UserCircle, Briefcase, LinkIcon, DollarSign, Trash2, PlusCircle, Palette, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MultiSelect } from "@/components/ui/multi-select-tag";
import type { Tag } from "@/lib/types";
import React, { useState, useEffect } from "react";

const allSkillsOptions: Tag[] = [
  { id: "react", text: "React" }, { id: "nextjs", text: "Next.js" }, { id: "vue", text: "Vue.js" },
  { id: "angular", text: "Angular" }, { id: "typescript", text: "TypeScript" }, { id: "javascript", text: "JavaScript" },
  { id: "html", text: "HTML" }, { id: "css", text: "CSS" }, { id: "tailwindcss", text: "Tailwind CSS" },
  { id: "figma", text: "Figma" }, { id: "adobexd", text: "Adobe XD" }, { id: "sketch", text: "Sketch" },
  { id: "ui-design", text: "UI Design" }, { id: "ux-design", text: "UX Design" }, { id: "graphic-design", text: "Graphic Design" },
  { id: "branding", text: "Branding" }, { id: "logo-design", text: "Logo Design" }, { id: "web-design", text: "Web Design" },
  { id: "motion-design", text: "Motion Design" }, { id: "illustration", text: "Illustration" }, { id: "photoshop", text: "Photoshop" },
  { id: "illustrator", text: "Illustrator" }, { id: "user-research", text: "User Research" }, { id: "prototyping", text: "Prototyping" },
];

const STABLE_EMPTY_PROFILE_VALUES: DesignerProfileFormData = {
  name: "",
  headline: "",
  avatarUrl: "",
  skills: [],
  bio: "",
  portfolioLinks: [{ title: "", url: "" }],
  budgetMin: 0,
  budgetMax: 0,
  email: "",
  phone: "",
};


export function DesignerProfileForm() {
  const { toast } = useToast();
  const auth = useAuthMock();
  const router = useRouter();

  const initialFormValues = React.useMemo(() => {
    if (auth.profileSetupComplete && auth.userType === 'designer') {
      return {
        name: auth.displayName || auth.username || "", 
        headline: auth.designerHeadline || "",
        avatarUrl: auth.designerAvatarUrl || "",
        skills: auth.designerSkills || [],
        bio: auth.designerBio || "",
        portfolioLinks: auth.designerPortfolioLinks && auth.designerPortfolioLinks.length > 0 ? auth.designerPortfolioLinks : [{ title: "", url: "" }],
        budgetMin: auth.designerBudgetMin ?? 0,
        budgetMax: auth.designerBudgetMax ?? 0,
        email: auth.designerEmail || "",
        phone: auth.designerPhone || "",
      };
    }
    return {
      ...STABLE_EMPTY_PROFILE_VALUES,
      name: auth.username || STABLE_EMPTY_PROFILE_VALUES.name,
      email: auth.designerEmail || STABLE_EMPTY_PROFILE_VALUES.email,
      phone: auth.designerPhone || STABLE_EMPTY_PROFILE_VALUES.phone,
    };
  }, [
    auth.profileSetupComplete, 
    auth.userType, 
    auth.username, 
    auth.displayName,
    auth.designerHeadline, 
    auth.designerAvatarUrl, 
    auth.designerSkills, 
    auth.designerBio, 
    auth.designerPortfolioLinks, 
    auth.designerBudgetMin, 
    auth.designerBudgetMax, 
    auth.designerEmail,
    auth.designerPhone,
  ]);


  const [selectedSkills, setSelectedSkills] = useState<Tag[]>(initialFormValues.skills || []);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialFormValues.avatarUrl);


  const form = useForm<DesignerProfileFormData>({
    resolver: zodResolver(DesignerProfileSchema),
    defaultValues: initialFormValues, 
  });
  
  useEffect(() => {
    form.reset(initialFormValues);
    setSelectedSkills(initialFormValues.skills || []);
    setAvatarPreview(initialFormValues.avatarUrl || "");
  }, [form, initialFormValues]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "portfolioLinks",
  });

  async function onSubmit(data: DesignerProfileFormData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Designer profile data: ", {userId: auth.userId, ...data});
    
    auth.saveDesignerProfile(data); 

    toast({
      title: auth.profileSetupComplete ? "Profile Updated!" : "Profile Set Up!",
      description: `Your designer profile has been successfully ${auth.profileSetupComplete ? 'updated' : 'created'}.`,
      variant: "default",
    });
    
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
    router.push(redirectUrl || "/designer-dashboard");
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        form.setValue('avatarUrl', result, { shouldValidate: true, shouldDirty: true }); 
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <UserCircle className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">{auth.profileSetupComplete ? "Update Your Designer Profile" : "Set Up Your Designer Profile"}</CardTitle>
        <CardDescription>Showcase your skills and attract clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={avatarPreview || form.watch('avatarUrl')} alt={form.watch('name')} data-ai-hint="designer avatar" />
                  <AvatarFallback className="text-4xl">
                    {(form.watch('name') || initialFormValues.name)?.charAt(0)?.toUpperCase() || 'D'}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatarUrl" 
                  render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                     <FormLabel className="text-base">Avatar URL (or upload below)</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="https://example.com/avatar.jpg" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                            field.onChange(e.target.value); 
                            setAvatarPreview(e.target.value); 
                        }}
                        className="text-base py-3"
                       />
                    </FormControl>
                    <FormMessage />
                    <Input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm"/>
                    <FormDescription className="text-xs">Enter URL or upload an image (max 2MB).</FormDescription>
                  </FormItem>
                )}/>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alex Johnson" {...field} value={field.value || ""} className="text-base py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Creative UI/UX Designer specializing in SaaS" {...field} value={field.value || ""} className="text-base py-6" />
                  </FormControl>
                  <FormDescription>A catchy one-liner to describe your expertise.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Contact Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} value={field.value || ""} className="pl-10 text-base py-6" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Contact Phone (Optional)</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="tel" placeholder="+1234567890" {...field} value={field.value || ""} className="pl-10 text-base py-6" />
                    </FormControl>
                  </div>
                  <FormDescription>Your contact phone number (e.g., +1234567890).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Skills</FormLabel>
                   <FormControl>
                     <MultiSelect
                        value={selectedSkills}
                        onChange={(newSkills) => {
                          setSelectedSkills(newSkills);
                          field.onChange(newSkills);
                        }}
                        options={allSkillsOptions}
                        placeholder="Add your skills..."
                      />
                  </FormControl>
                  <FormDescription>Highlight your key skills and technologies.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Bio / About Me</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell clients about your experience, design philosophy, and what makes you unique..."
                      className="min-h-[150px] text-base py-4"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-lg mb-2 block">Portfolio Links</FormLabel>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-end gap-4 mb-4 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`portfolioLinks.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel className="text-sm">Link Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Personal Website, Dribbble" {...field} value={field.value || ""} className="text-base py-3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`portfolioLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel className="text-sm">Link URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com" {...field} value={field.value || ""} className="text-base py-3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} aria-label="Remove link">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: "", url: "" })}
                className="mt-2 border-primary text-primary hover:bg-primary/10"
                disabled={fields.length >= 5}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Portfolio Link
              </Button>
               <FormDescription className="text-sm mt-1">You can add up to 5 links.</FormDescription>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Minimum Project Budget</FormLabel>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                       <FormControl>
                        <Input type="number" placeholder="500" {...field} value={field.value ?? ""} onChange={e => field.onChange(Number(e.target.value))} className="pl-10 text-base py-6" />
                      </FormControl>
                    </div>
                    <FormDescription>Your preferred minimum project budget in USD.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Maximum Project Budget</FormLabel>
                     <div className="relative">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                       <FormControl>
                        <Input type="number" placeholder="10000" {...field} value={field.value ?? ""} onChange={e => field.onChange(Number(e.target.value))} className="pl-10 text-base py-6" />
                      </FormControl>
                    </div>
                    <FormDescription>Your preferred maximum project budget in USD (or leave blank for no max).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving Profile..." : (auth.profileSetupComplete ? "Update Profile" : "Save Profile")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

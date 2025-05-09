"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { JobPostingSchema, type JobPostingFormData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, DollarSign, Users, TagIcon } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select-tag";
import type { Tag } from "@/lib/types";
import { useState } from "react";

const allSkillsOptions: Tag[] = [
  { id: "react", text: "React" },
  { id: "nextjs", text: "Next.js" },
  { id: "vue", text: "Vue.js" },
  { id: "angular", text: "Angular" },
  { id: "typescript", text: "TypeScript" },
  { id: "javascript", text: "JavaScript" },
  { id: "html", text: "HTML" },
  { id: "css", text: "CSS" },
  { id: "tailwindcss", text: "Tailwind CSS" },
  { id: "figma", text: "Figma" },
  { id: "adobexd", text: "Adobe XD" },
  { id: "sketch", text: "Sketch" },
  { id: "ui-design", text: "UI Design" },
  { id: "ux-design", text: "UX Design" },
  { id: "graphic-design", text: "Graphic Design" },
  { id: "branding", text: "Branding" },
  { id: "log-design", text: "Logo Design" },
  { id: "web-design", text: "Web Design" },
  { id: "motion-design", text: "Motion Design" },
];


export function JobPostingForm() {
  const { toast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<Tag[]>([]);

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(JobPostingSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0, // Changed from budgetMin/budgetMax
      skillsRequired: [],
      limitContacts: 10,
    },
  });

 async function onSubmit(data: JobPostingFormData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    toast({
      title: "Job Posted Successfully!",
      description: `Your job "${data.title}" has been posted.`,
      variant: "default",
    });
    form.reset();
    setSelectedSkills([]); // Reset skills in UI
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <Briefcase className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">Post a New Job</CardTitle>
        <CardDescription>Describe your project and find the perfect designer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., E-commerce Website Redesign" {...field} className="text-base py-6" />
                  </FormControl>
                  <FormDescription>A clear and concise title for your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of your project, including goals, target audience, and any specific requirements..."
                      className="min-h-[150px] text-base py-4"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>Be as detailed as possible to attract the right talent.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Project Budget</FormLabel>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1000" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                        className="pl-10 text-base py-6" 
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Your estimated budget for this project in USD.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Skills Required</FormLabel>
                  <FormControl>
                     <MultiSelect
                        value={selectedSkills}
                        onChange={(newSkills) => {
                          setSelectedSkills(newSkills);
                          field.onChange(newSkills); // Update RHF state
                        }}
                        options={allSkillsOptions}
                        placeholder="Add required skills..."
                      />
                  </FormControl>
                  <FormDescription>Select skills needed for this project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limitContacts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Limit Designer Contacts (Optional)</FormLabel>
                   <div className="relative">
                       <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} className="pl-10 text-base py-6" />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Set a maximum number of designers who can contact you for this job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Posting Job..." : "Post Job"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


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
import type { Tag, JobPosting } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

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
  { id: "logo-design", text: "Logo Design" },
  { id: "web-design", text: "Web Design" },
  { id: "motion-design", text: "Motion Design" },
  { id: "illustration", text: "Illustration" },
  { id: "photoshop", text: "Photoshop" },
  { id: "illustrator", text: "Illustrator" },
  { id: "user-research", text: "User Research" },
  { id: "prototyping", text: "Prototyping" },
];

interface JobPostingFormProps {
  jobToEdit?: JobPosting | null;
}

export function JobPostingForm({ jobToEdit }: JobPostingFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { userId: authUserId, email: authEmail, userType } = useAuth(); // Added email and userType for better keying
  
  // Local state for selected skills for MultiSelect, initialized from jobToEdit or empty
  const [selectedSkills, setSelectedSkills] = useState<Tag[]>(jobToEdit?.skillsRequired || []);

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(JobPostingSchema),
    defaultValues: jobToEdit ? {
      title: jobToEdit.title,
      description: jobToEdit.description,
      budget: jobToEdit.budget,
      skillsRequired: jobToEdit.skillsRequired,
      limitContacts: jobToEdit.limitContacts,
    } : {
      title: "",
      description: "",
      budget: 0,
      skillsRequired: [],
      limitContacts: 10,
    },
  });

  // Effect to reset form and skills when jobToEdit changes (e.g., loaded asynchronously)
  useEffect(() => {
    if (jobToEdit) {
      form.reset({
        title: jobToEdit.title,
        description: jobToEdit.description,
        budget: jobToEdit.budget,
        skillsRequired: jobToEdit.skillsRequired,
        limitContacts: jobToEdit.limitContacts,
      });
      setSelectedSkills(jobToEdit.skillsRequired);
    } else {
      form.reset({ // Reset to default for new job form
        title: "",
        description: "",
        budget: 0,
        skillsRequired: [],
        limitContacts: 10,
      });
      setSelectedSkills([]);
    }
  }, [jobToEdit, form]);


  async function onSubmit(data: JobPostingFormData) {
    if (!authUserId || !authEmail || userType !== 'user') {
      toast({
        title: "Error",
        description: "User not authenticated or not a client. Cannot post/edit job.",
        variant: "destructive",
      });
      return;
    }

    const isEditing = !!jobToEdit;

    const jobData: JobPosting = {
      id: isEditing ? jobToEdit.id : `job-${Date.now()}`,
      userId: authUserId,
      title: data.title,
      description: data.description,
      budget: data.budget,
      skillsRequired: data.skillsRequired,
      limitContacts: data.limitContacts,
      createdAt: isEditing ? jobToEdit.createdAt : new Date().toISOString(),
      status: isEditing ? jobToEdit.status : "open", // Preserve status if editing, else 'open'
      bidsCount: isEditing ? jobToEdit.bidsCount : 0,
      // If your JobPosting type includes clientEmail/Phone from the auth context:
      clientEmail: authEmail, // Assuming client email is the auth email
      // clientPhone: authPhone, // If you have client phone in auth context
    };

    try {
      if (typeof window !== 'undefined') {
        const storageKey = `userJobs_${authUserId}`;
        const existingJobsString = localStorage.getItem(storageKey);
        let existingJobs: JobPosting[] = existingJobsString ? JSON.parse(existingJobsString) : [];

        if (isEditing) {
          existingJobs = existingJobs.map(job => job.id === jobData.id ? jobData : job);
        } else {
          existingJobs.push(jobData);
        }
        localStorage.setItem(storageKey, JSON.stringify(existingJobs));
      }
      
      toast({
        title: isEditing ? "Job Updated Successfully!" : "Job Posted Successfully!",
        description: `Your job "${jobData.title}" has been ${isEditing ? 'updated' : 'posted'}.`,
        variant: "default",
      });
      
      if (!isEditing) {
        form.reset(); // Reset form only if creating a new job
        setSelectedSkills([]); 
      }
      router.push('/user-dashboard');
    } catch (error) {
      console.error("Failed to save job to localStorage", error);
      toast({
        title: "Storage Error",
        description: `Could not ${isEditing ? 'update' : 'save'} job posting. Please try again.`,
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <Briefcase className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">{jobToEdit ? "Edit Your Job" : "Post a New Job"}</CardTitle>
        <CardDescription>{jobToEdit ? "Update the details of your job listing." : "Describe your project and find the perfect designer."}</CardDescription>
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
                        value={field.value || ""} // Ensure controlled component has a defined value
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
                        value={selectedSkills} // Use local state for MultiSelect
                        onChange={(newSkills) => {
                          setSelectedSkills(newSkills); // Update local state
                          field.onChange(newSkills);  // Update form state
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
                      <Input 
                        type="number" 
                        placeholder="e.g., 10" 
                        {...field} 
                        value={field.value ?? ""} // Ensure controlled component
                        onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} 
                        className="pl-10 text-base py-6" 
                       />
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
              {form.formState.isSubmitting 
                ? (jobToEdit ? "Updating Job..." : "Posting Job...") 
                : (jobToEdit ? "Update Job" : "Post Job")
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

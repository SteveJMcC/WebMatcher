
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
import { JobPostingSchema, type JobPostingFormData, budgetOptions } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, DollarSign, Users, TagIcon, MapPin, Users2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select-tag";
import type { Tag, JobPosting } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const professionalCategoryOptions = [
  { value: "Web Designer", label: "Web Designer" },
  { value: "Web Developer", label: "Web Developer" },
  { value: "SEO Expert", label: "SEO Expert" },
  { value: "Web Marketer", label: "Web Marketer" },
  { value: "Other", label: "Other (Please specify)" },
];

interface JobPostingFormProps {
  jobToEdit?: JobPosting | null;
}

export function JobPostingForm({ jobToEdit }: JobPostingFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { userId: authUserId, email: authEmail, userType } = useAuth(); 
  
  const [selectedSkills, setSelectedSkills] = useState<Tag[]>(jobToEdit?.skillsRequired || []);

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(JobPostingSchema),
    defaultValues: jobToEdit ? {
      title: jobToEdit.title,
      description: jobToEdit.description,
      budget: jobToEdit.budget as typeof budgetOptions[number]['value'], // Ensure budget is one of the valid string options
      skillsRequired: jobToEdit.skillsRequired,
      limitContacts: jobToEdit.limitContacts,
      workPreference: jobToEdit.workPreference || 'remote',
      professionalCategory: jobToEdit.professionalCategory || '',
      customProfessionalCategory: jobToEdit.customProfessionalCategory || '',
    } : {
      title: "",
      description: "",
      budget: undefined, // Default to undefined for select placeholder
      skillsRequired: [],
      limitContacts: 10,
      workPreference: 'remote',
      professionalCategory: '',
      customProfessionalCategory: '',
    },
  });

  useEffect(() => {
    if (jobToEdit) {
      form.reset({
        title: jobToEdit.title,
        description: jobToEdit.description,
        budget: jobToEdit.budget as typeof budgetOptions[number]['value'],
        skillsRequired: jobToEdit.skillsRequired || [],
        limitContacts: jobToEdit.limitContacts,
        workPreference: jobToEdit.workPreference || 'remote',
        professionalCategory: jobToEdit.professionalCategory || '',
        customProfessionalCategory: jobToEdit.customProfessionalCategory || '',
      });
      setSelectedSkills(jobToEdit.skillsRequired || []);
    } else {
      form.reset({
        title: "",
        description: "",
        budget: undefined,
        skillsRequired: [],
        limitContacts: 10,
        workPreference: 'remote',
        professionalCategory: '',
        customProfessionalCategory: '',
      });
      setSelectedSkills([]);
    }
  }, [jobToEdit, form]);

  const watchedProfessionalCategory = form.watch("professionalCategory");

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
      budget: data.budget, // Budget is now a string
      skillsRequired: data.skillsRequired,
      limitContacts: data.limitContacts,
      workPreference: data.workPreference,
      professionalCategory: data.professionalCategory,
      customProfessionalCategory: data.professionalCategory === 'Other' ? data.customProfessionalCategory : undefined,
      createdAt: isEditing ? jobToEdit.createdAt : new Date().toISOString(),
      status: isEditing ? jobToEdit.status : "open",
      bidsCount: isEditing ? jobToEdit.bidsCount : 0,
      clientEmail: authEmail, 
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
        form.reset();
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
        <CardDescription>{jobToEdit ? "Update the details of your job listing." : "Describe your project and find the perfect web professional."}</CardDescription>
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
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="text-base py-6">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {budgetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormDescription>Your estimated budget for this project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" />Work Preference</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2 pt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="remote" id="remote" />
                        </FormControl>
                        <FormLabel htmlFor="remote" className="font-normal text-base">
                          I'm happy to work remotely with my Web Professional
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="local" id="local" />
                        </FormControl>
                        <FormLabel htmlFor="local" className="font-normal text-base">
                          I only want to work with a local professional
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary"/>Type of Professional Needed</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select a professional category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professionalCategoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the main category of professional you are looking for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedProfessionalCategory === "Other" && (
              <FormField
                control={form.control}
                name="customProfessionalCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Specify Professional Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Shopify Developer, UX Researcher" {...field} value={field.value ?? ""} className="text-base py-6" />
                    </FormControl>
                     <FormDescription>Enter the specific type of professional if not listed above.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="skillsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg flex items-center"><TagIcon className="mr-2 h-5 w-5 text-primary" />Specific Skills Required</FormLabel>
                  <FormControl>
                     <MultiSelect
                        value={selectedSkills} 
                        onChange={(newSkills) => {
                          setSelectedSkills(newSkills); 
                          field.onChange(newSkills);  
                        }}
                        options={allSkillsOptions}
                        placeholder="Add specific skills required..."
                      />
                  </FormControl>
                  <FormDescription>Select specific skills or technologies needed for this project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limitContacts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-primary" />Limit Web Professional Contacts (Optional)</FormLabel>
                   <div className="relative">
                       <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 10" 
                        {...field} 
                        value={field.value ?? ""} 
                        onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} 
                        className="pl-10 text-base py-6" 
                       />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Set a maximum number of Web Professionals who can contact you for this job.
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

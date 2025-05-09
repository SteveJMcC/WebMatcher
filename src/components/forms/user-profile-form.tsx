
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileSchema, type UserProfileFormData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { UserCircle, Building } from "lucide-react";
import React from "react"; // Import React for useMemo

// Mock existing profile data for update scenario
const mockExistingClientProfile: UserProfileFormData = {
  name: "John Client Doe",
  companyName: "Client Innovations Inc.",
};


export function UserProfileForm() {
  const { toast } = useToast();
  const { markProfileComplete, username, userId, profileSetupComplete } = useAuthMock(); 
  const router = useRouter();

  const initialFormValues = React.useMemo(() => {
    if (profileSetupComplete) {
      // If profile is complete, load existing data (mocked for now)
      // In a real app, this would be fetched from a backend
      return {
        name: mockExistingClientProfile.name || username || "",
        companyName: mockExistingClientProfile.companyName || "",
      };
    }
    // For new profile setup
    return {
      name: username || "", 
      companyName: "",
    };
  }, [profileSetupComplete, username]);


  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: initialFormValues,
  });

  // Effect to reset form if initial values change (e.g., profile status changes)
  React.useEffect(() => {
    form.reset(initialFormValues);
  }, [form, initialFormValues]);


  async function onSubmit(data: UserProfileFormData) {
    // Simulate API call to save user profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("User profile data:", { userId, ...data });
    
    if (!profileSetupComplete) {
      markProfileComplete(); 
    }
    
    toast({
      title: profileSetupComplete ? "Profile Updated!" : "Profile Set Up!",
      description: `Your client profile has been successfully ${profileSetupComplete ? 'updated' : 'created'}.`,
      variant: "default",
    });
    
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
    router.push(redirectUrl || "/user-dashboard");
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader className="text-center">
        <UserCircle className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">
          {profileSetupComplete ? "Update Your Profile" : "Set Up Your Profile"}
        </CardTitle>
        <CardDescription>
          {profileSetupComplete ? "Keep your information current." : "Tell us a bit about yourself or your company."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Full Name / Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} className="text-base py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Company Name (Optional)</FormLabel>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., Acme Corp" {...field} className="pl-10 text-base py-6" />
                    </FormControl>
                  </div>
                  <FormDescription>If you're hiring for a company.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting 
                ? (profileSetupComplete ? "Updating Profile..." : "Saving Profile...") 
                : (profileSetupComplete ? "Update Profile" : "Save and Continue")
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

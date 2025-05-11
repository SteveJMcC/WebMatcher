import { z } from 'zod';

export const budgetOptions = [
  { value: "under £250", label: "Under £250" },
  { value: "under £500", label: "Under £500" },
  { value: "under £750", label: "Under £750" },
  { value: "under £1000", label: "Under £1000" },
  { value: "under £2000", label: "Under £2000" },
  { value: "above £2000", label: "Above £2000" },
  { value: "don't know", label: "Don't know" },
] as const;

const budgetValues = budgetOptions.map(option => option.value);

export const JobPostingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(100, "Title must be at most 100 characters."),
  description: z.string().min(20, "Description must be at least 20 characters long.").max(2000, "Description must be at most 2000 characters."),
  budget: z.enum(budgetValues as [string, ...string[]], { // Cast to satisfy z.enum
    required_error: "Please select a budget range.",
  }).describe("The estimated budget range for this project."),
  skillsRequired: z.array(z.object({ id: z.string(), text: z.string() })).min(1, "At least one skill is required."),
  limitContacts: z.coerce.number().int().min(1, "Limit must be at least 1").max(50, "Limit cannot exceed 50").optional(),
  workPreference: z.enum(['remote', 'local'], {
    required_error: "You must select a work preference.",
  }),
  professionalCategory: z.string().min(1, "Please select a professional category."),
  customProfessionalCategory: z.string().max(100, "Custom category must be at most 100 characters.").optional().or(z.literal('')),
}).refine(data => {
  if (data.professionalCategory === 'Other' && (!data.customProfessionalCategory || data.customProfessionalCategory.trim().length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Please specify your custom professional category (min 2 characters).",
  path: ['customProfessionalCategory'],
});

export const DesignerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name must be at most 50 characters."),
  headline: z.string().min(10, "Headline must be at least 10 characters.").max(150, "Headline must be at most 150 characters."),
  avatarUrl: z.string().url("Avatar URL must be a valid URL.").optional().or(z.literal('')),
  skills: z.array(z.object({ id: z.string(), text: z.string() })).min(1, "At least one skill is required."),
  bio: z.string().min(50, "Bio must be at least 50 characters long.").max(2000, "Bio must be at most 2000 characters."),
  portfolioLinks: z.array(z.object({
    title: z.string().min(1, "Link title cannot be empty.").max(50, "Link title too long."),
    url: z.string().url("Link URL must be a valid URL."),
  })).max(5, "You can add up to 5 portfolio links.").optional(),
  budgetMin: z.coerce.number().min(0, "Minimum budget must be a non-negative number."),
  budgetMax: z.coerce.number().min(0, "Maximum budget must be a non-negative number."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890).")
    .optional()
    .or(z.literal('')),
}).refine(data => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget cannot be less than minimum budget.",
  path: ["budgetMax"],
});

export const UserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name must be at most 50 characters."),
  companyName: z.string().max(100, "Company name must be at most 100 characters.").optional().or(z.literal('')),
});

export type JobPostingFormData = z.infer<typeof JobPostingSchema>;
export type DesignerProfileFormData = z.infer<typeof DesignerProfileSchema>;
export type UserProfileFormData = z.infer<typeof UserProfileSchema>;

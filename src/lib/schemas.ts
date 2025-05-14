import { z } from 'zod';
import { budgetValues, professionalCategoryOptions as schemaProfessionalCategoryOptions, limitContactsValues } from './constants'; // Import from constants

export { budgetOptions, limitContactsOptions } from './constants'; // Re-export for use in forms


const professionalCategoryValues = schemaProfessionalCategoryOptions.map(option => option.value);


export const JobPostingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(100, "Title must be at most 100 characters."),
  description: z.string().min(20, "Description must be at least 20 characters long.").max(2000, "Description must be at most 2000 characters."),
  budget: z.enum(budgetValues as [string, ...string[]], { 
    required_error: "Please select a budget range.",
  }).describe("The estimated budget range for this project."),
  clientEmail: z.string().email("Please enter a valid email address for client contact."),
  clientPhone: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890).").or(z.literal("")),
  clientCity: z.string().min(2, "City must be at least 2 characters.").max(50, "City must be at most 50 characters."),
  clientPostalCode: z.string().min(3, "Postal code must be at least 3 characters.").max(20, "Postal code must be at most 20 characters."),
  skillsRequired: z.array(z.object({ id: z.string(), text: z.string() })).optional().default([]),
  limitContacts: z.enum(limitContactsValues as [string, ...string[]], {
    required_error: "Please select a contact limit option.",
  }).optional().default('unlimited'),
  workPreference: z.enum(['remote', 'local'], {
    required_error: "You must select a work preference.",
  }),
  professionalCategory: z.enum(professionalCategoryValues as [string, ...string[]], {
    required_error: "Please select a professional category.",
  }),
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
  })).max(5, "You can add up to 5 portfolio links.").optional().default([{ title: "", url: "" }]),
  budgetMin: z.coerce.number().min(0, "Minimum budget must be a non-negative number."),
  budgetMax: z.coerce.number().min(0, "Maximum budget must be a non-negative number."),
  email: z.string().email("Invalid email address."),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890).")
    .optional().or(z.literal('')),
  city: z.string().min(2, "City must be at least 2 characters.").max(50, "City must be at most 50 characters.").optional().or(z.literal('')),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters.").max(20, "Postal code must be at most 20 characters.").optional().or(z.literal('')),
}).refine(data => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget cannot be less than minimum budget.",
  path: ["budgetMax"],
});

export const UserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name must be at most 50 characters."),
  companyName: z.string().max(100, "Company name must be at most 100 characters.").optional().or(z.literal('')),
});

export const SignupFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  displayName: z.string().min(2, "Display Name must be at least 2 characters.").max(50, "Display Name must be at most 50 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  userType: z.enum(['user', 'designer'], {
    required_error: "Please select an account type."
  }),
});


export type JobPostingFormData = z.infer<typeof JobPostingSchema>;
export type DesignerProfileFormData = z.infer<typeof DesignerProfileSchema>;
export type UserProfileFormData = z.infer<typeof UserProfileSchema>;
export type SignupFormData = z.infer<typeof SignupFormSchema>;

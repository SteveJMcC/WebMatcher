
import type { Tag } from "./types";

export const allSkillsOptions: Tag[] = [
  // High-level skills first
  { id: "seo", text: "SEO" },
  { id: "copywriting", text: "Copywriting" },
  { id: "web-design", text: "Web Design" },
  { id: "graphic-design", text: "Graphic Design" },
  { id: "ui-design", text: "UI Design" },
  { id: "ux-design", text: "UX Design" },
  { id: "branding", text: "Branding" },
  { id: "logo-design", text: "Logo Design" },
  { id: "content-writing", text: "Content Writing" },
  { id: "social-media-marketing", text: "Social Media Marketing" },
  { id: "email-marketing", text: "Email Marketing" },
  { id: "project-management", text: "Project Management" },
  { id: "product-management", text: "Product Management" },
  { id: "accessibility", text: "Accessibility (WCAG)"},
  { id: "landing-page", text: "Landing Page Design"},
  { id: "shopifiy", text: "Shopify Development" },
  { id: "wordpress", text: "WordPress" },
  { id: "mobile-app-design", text: "Mobile App Design" },
  { id: "user-research", text: "User Research" },
  { id: "prototyping", text: "Prototyping" },
  { id: "illustration", text: "Illustration" },
  { id: "motion-design", text: "Motion Design" },
  { id: "data-analysis", text: "Data Analysis" },
  // Technical skills/tools later
  { id: "html", text: "HTML" },
  { id: "css", text: "CSS" },
  { id: "javascript", text: "JavaScript" },
  { id: "typescript", text: "TypeScript" },
  { id: "tailwindcss", text: "Tailwind CSS" },
  { id: "figma", text: "Figma" },
  { id: "adobexd", text: "Adobe XD" },
  { id: "sketch", text: "Sketch" },
  { id: "photoshop", text: "Photoshop" },
  { id: "illustrator", text: "Illustrator" },
  { id: "react", text: "React" },
  { id: "nextjs", text: "Next.js" },
  { id: "vue", text: "Vue.js" },
  { id: "angular", text: "Angular" },
  { id: "dont-know", text: "Don't know / Not sure" }, // Added for skillsRequired default
];


export const professionalCategoryOptions = [
  { value: "Web Designer", label: "Web Designer" },
  { value: "Web Developer", label: "Web Developer" },
  { value: "SEO Expert", label: "SEO Expert" },
  { value: "Web Marketer", label: "Web Marketer" },
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Content Writer", label: "Content Writer" },
  { value: "Other", label: "Other (Please specify)" },
];

export const budgetOptions = [
  { value: "under £250", label: "Under £250" },
  { value: "under £500", label: "Under £500" },
  { value: "under £750", label: "Under £750" },
  { value: "under £1000", label: "Under £1000" },
  { value: "under £1500", label: "Under £1500" },
  { value: "under £2000", label: "Under £2000" },
  { value: "above £2000", label: "Above £2000" },
  { value: "don't know", label: "Don't know" },
] as const;

export const budgetValues = budgetOptions.map(option => option.value);

export const limitContactsOptions = [
  { value: "unlimited", label: "Unlimited" },
  { value: "7", label: "Under 7" },
  { value: "11", label: "Under 11" },
  { value: "16", label: "Under 16" },
] as const;

export const limitContactsValues = limitContactsOptions.map(option => option.value);

export const getJobApplicationTokenCost = (budget: string): number => {
  switch (budget) {
    case "under £250":
      return 4;
    case "under £500":
      return 15;
    case "under £750":
      return 15;
    case "under £1000":
      return 20;
    case "under £1500":
      return 30;
    case "under £2000":
      return 40;
    case "above £2000":
      return 50;
    case "don't know":
      return 10; // Default for "don't know"
    default:
      return 10; // Fallback default
  }
};

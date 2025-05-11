import type { Tag } from "./types";

export const allSkillsOptions: Tag[] = [
  { id: "react", text: "React" }, { id: "nextjs", text: "Next.js" }, { id: "vue", text: "Vue.js" },
  { id: "angular", text: "Angular" }, { id: "typescript", text: "TypeScript" }, { id: "javascript", text: "JavaScript" },
  { id: "html", text: "HTML" }, { id: "css", text: "CSS" }, { id: "tailwindcss", text: "Tailwind CSS" },
  { id: "figma", text: "Figma" }, { id: "adobexd", text: "Adobe XD" }, { id: "sketch", text: "Sketch" },
  { id: "ui-design", text: "UI Design" }, { id: "ux-design", text: "UX Design" }, { id: "graphic-design", text: "Graphic Design" },
  { id: "branding", text: "Branding" }, { id: "logo-design", text: "Logo Design" }, { id: "web-design", text: "Web Design" },
  { id: "motion-design", text: "Motion Design" }, { id: "illustration", text: "Illustration" }, { id: "photoshop", text: "Photoshop" },
  { id: "illustrator", text: "Illustrator" }, { id: "user-research", text: "User Research" }, { id: "prototyping", text: "Prototyping" },
  { id: "wordpress", text: "WordPress" }, { id: "seo", text: "SEO" }, { id: "content-writing", text: "Content Writing" },
  { id: "copywriting", text: "Copywriting" }, { id: "social-media-marketing", text: "Social Media Marketing" },
  { id: "email-marketing", text: "Email Marketing" }, { id: "project-management", text: "Project Management" },
  { id: "product-management", text: "Product Management" }, { id: "data-analysis", text: "Data Analysis" },
  { id: "shopifiy", text: "Shopify Development" }, { id: "mobile-app-design", text: "Mobile App Design" },
  { id: "accessibility", text: "Accessibility (WCAG)"}, {id:"landing-page", text:"Landing Page Design"},
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
  { value: "under £2000", label: "Under £2000" },
  { value: "above £2000", label: "Above £2000" },
  { value: "don't know", label: "Don't know" },
] as const;

export const budgetValues = budgetOptions.map(option => option.value);

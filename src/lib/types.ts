import type { limitContactsOptions } from "./constants";

export type LimitContactsValue = typeof limitContactsOptions[number]['value'];

export interface JobPostingCore {
  title: string;
  description: string;
  budget: string; 
  skillsRequired: Tag[]; 
  limitContacts?: LimitContactsValue;
  workPreference: 'remote' | 'local';
  professionalCategory: string;
  customProfessionalCategory?: string;
}

export interface JobPosting extends JobPostingCore {
  id: string;
  userId: string; 
  clientEmail?: string; 
  clientPhone?: string; 
  createdAt: string; 
  status: 'open' | 'in-progress' | 'closed';
  bidsCount?: number;
  applicants?: { designerId: string; appliedAt: string }[];
}

export interface DesignerProfileCore {
  name: string;
  headline: string;
  avatarUrl?: string;
  skills: Tag[]; 
  bio: string;
  portfolioLinks: { title: string; url: string }[];
  budgetMin: number;
  budgetMax: number;
  email?: string;
  phone?: string; 
}

export interface DesignerProfile extends DesignerProfileCore {
  id: string; 
  userId: string;
  tokens: number; 
  joinedDate: string; 
}

export interface UserProfile {
  id: string; 
  userId: string;
  name: string;
  companyName?: string;
  email?: string; 
  joinedDate: string; 
}

export interface BidCore {
  bidAmount: number;
  coverLetter: string;
  experienceSummary: string; 
}

export interface Bid extends BidCore {
  id: string;
  jobId: string;
  designerId: string;
  designerName: string; 
  designerAvatar?: string; 
  submittedAt: string; 
  aiSummary?: string;
  rank?: number; 
}

export interface BidForSummary {
  designerProfile: string; 
  bidAmount: number;
  experienceSummary: string;
  coverLetter: string;
}

export interface SummarizeBidsServiceInput {
  jobDescription: string;
  jobBudget: string; 
  bids: BidForSummary[];
}

export interface SummarizedBidOutput {
  designerProfile: string; 
  summary: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  tokens: number;
  features: string[];
  isPopular?: boolean;
}

export type Tag = {
  id: string;
  text: string;
};

export interface JobPostingCore {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  skillsRequired: Tag[]; // Changed from string[] to Tag[]
  limitContacts?: number;
}

export interface JobPosting extends JobPostingCore {
  id: string;
  userId: string; // ID of the user (client) who posted the job
  createdAt: string; // ISO date string
  status: 'open' | 'in-progress' | 'closed';
  bidsCount?: number;
}

export interface DesignerProfileCore {
  name: string;
  headline: string;
  avatarUrl?: string;
  skills: Tag[]; // Changed from string[] to Tag[]
  bio: string;
  portfolioLinks: { title: string; url: string }[];
  budgetMin: number;
  budgetMax: number;
  email?: string;
}

export interface DesignerProfile extends DesignerProfileCore {
  id: string; 
  userId: string;
  tokens: number; 
  joinedDate: string; 
}

export interface UserProfile {
  id: string; // Corresponds to user ID of the client/user
  userId: string;
  name: string;
  companyName?: string;
  email?: string; // from auth
  joinedDate: string; // ISO date string
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

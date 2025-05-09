export interface JobPostingCore {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  skillsRequired: string[];
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
  skills: string[];
  bio: string;
  portfolioLinks: { title: string; url: string }[];
  budgetMin: number;
  budgetMax: number;
}

export interface DesignerProfile extends DesignerProfileCore {
  id: string; // Corresponds to user ID of the designer
  userId: string;
  tokens: number; // Number of tokens the designer has
  email?: string; // Optional email for contact
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
  designerName: string; // For easier display
  designerAvatar?: string; // For easier display
  submittedAt: string; // ISO date string
  aiSummary?: string;
  rank?: number; 
}

// For AI Ranker Input (matching src/ai/flows/summarize-bids.ts)
export interface BidForSummary {
  designerProfile: string; // A string summary of the designer's profile for the AI
  bidAmount: number;
  experienceSummary: string;
  coverLetter: string;
}

// For AI Ranker Input (matching src/ai/flows/summarize-bids.ts SummarizeBidsInput)
export interface SummarizeBidsServiceInput {
  jobDescription: string;
  bids: BidForSummary[];
}

// For AI Ranker Output (matching src/ai/flows/summarize-bids.ts SummarizeBidsOutput items)
export interface SummarizedBidOutput {
  designerProfile: string; // The same string passed in, used for matching.
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


'use server';

/**
 * @fileOverview Summarizes designer bids using AI to help users quickly understand proposals and rank them.
 *
 * - summarizeBids - A function that summarizes designer bids.
 * - SummarizeBidsInput - The input type for the summarizeBids function.
 * - SummarizeBidsOutput - The return type for the summarizeBids function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBidsInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job posted by the user.'),
  jobBudget: z.string().describe('The budget range for the job posted by the user (e.g., "under £500", "above £2000").'),
  bids: z
    .array(
      z.object({
        designerProfile: z.string().describe('The designer profile information.'),
        bidAmount: z.number().describe('The bid amount proposed by the designer.'),
        experienceSummary: z.string().describe('Summary of the designer experience.'),
        coverLetter: z.string().describe('The cover letter submitted by the designer.'),
      })
    )
    .describe('An array of designer bids for the job.'),
});

export type SummarizeBidsInput = z.infer<typeof SummarizeBidsInputSchema>;

const SummarizeBidsOutputSchema = z.array(
  z.object({
    designerProfile: z.string().describe('The designer profile information.'),
    summary: z.string().describe('A summary of the designer bid, focusing on budget fit and experience.'),
  })
);

export type SummarizeBidsOutput = z.infer<typeof SummarizeBidsOutputSchema>;

export async function summarizeBids(input: SummarizeBidsInput): Promise<SummarizeBidsOutput> {
  return summarizeBidsFlow(input);
}

const summarizeBidsPrompt = ai.definePrompt({
  name: 'summarizeBidsPrompt',
  input: {schema: SummarizeBidsInputSchema},
  output: {schema: SummarizeBidsOutputSchema},
  prompt: `You are an AI assistant helping a user to evaluate web professional bids for a project.

  The user has provided the following job description:
  {{jobDescription}}

  The project budget range set by the client is: {{jobBudget}}.

  For each bid, create a concise summary (maximum 150 words) that highlights the web professional's relevant experience, how well their proposed bid amount ({{this.bidAmount}}) fits the project budget ({{jobBudget}}), and any other factors that would help the user rank the bids effectively. The bid summaries must all be in the same language as the job description.

  The bids are as follows:
  {{#each bids}}
  Web Professional Profile: {{this.designerProfile}}
  Bid Amount: £{{this.bidAmount}}
  Experience Summary: {{this.experienceSummary}}
  Cover Letter: {{this.coverLetter}}
  ---
  {{/each}}

  Return an array of JSON objects with the designerProfile and summary for each bid.
  Make sure the bid summaries are professional, concise, and directly relevant to the user's decision-making process.
  Ensure that the output is a valid JSON array.
  `,
});

const summarizeBidsFlow = ai.defineFlow(
  {
    name: 'summarizeBidsFlow',
    inputSchema: SummarizeBidsInputSchema,
    outputSchema: SummarizeBidsOutputSchema,
  },
  async input => {
    const {output} = await summarizeBidsPrompt(input);
    return output!;
  }
);

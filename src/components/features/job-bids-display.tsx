"use client";

import type { Bid, JobPosting, SummarizedBidOutput, SummarizeBidsServiceInput, BidForSummary } from "@/lib/types";
import type { DesignerProfile } from "@/lib/types"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, UserCircle, MessageSquare, ThumbsUp, ThumbsDown, Sparkles, Info, AlertTriangle, Loader2, Mail, Phone } from "lucide-react";
import { summarizeBids } from "@/ai/flows/summarize-bids"; 
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface JobBidsDisplayProps {
  job: JobPosting;
  initialBids: Bid[];
  getDesignerProfileString: (designerId: string) => Promise<string>; 
  getDesignerDetails: (designerId: string) => Promise<DesignerProfile | null>; 
}

interface DisplayBid extends Bid {
  aiSummaryText?: string;
  isLoadingSummary?: boolean;
  designerDetails?: DesignerProfile | null;
}

const getInitials = (name: string) => {
    if (!name) return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function JobBidsDisplay({ job, initialBids, getDesignerProfileString, getDesignerDetails }: JobBidsDisplayProps) {
  const [displayBids, setDisplayBids] = useState<DisplayBid[]>(initialBids.map(b => ({...b, isLoadingSummary: false })));
  const [isSummarizingAll, setIsSummarizingAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDesignerDetailsForBids = async () => {
      const bidsWithDetails = await Promise.all(
        initialBids.map(async (bid) => {
          const details = await getDesignerDetails(bid.designerId);
          return { ...bid, designerDetails: details, isLoadingSummary: false };
        })
      );
      setDisplayBids(bidsWithDetails);
    };
    fetchDesignerDetailsForBids();
  }, [initialBids, getDesignerDetails]);


  const handleSummarizeBid = async (bidId: string) => {
    const bidIndex = displayBids.findIndex(b => b.id === bidId);
    if (bidIndex === -1) return;

    setDisplayBids(prev => prev.map(b => b.id === bidId ? { ...b, isLoadingSummary: true } : b));

    try {
      const bidToSummarize = displayBids[bidIndex];
      const designerProfileString = await getDesignerProfileString(bidToSummarize.designerId);

      const aiInput: SummarizeBidsServiceInput = {
        jobDescription: job.description,
        jobBudget: job.budget, 
        bids: [{
          designerProfile: designerProfileString, 
          bidAmount: bidToSummarize.bidAmount,
          experienceSummary: bidToSummarize.experienceSummary,
          coverLetter: bidToSummarize.coverLetter,
        }]
      };
      
      const summaries = await summarizeBids(aiInput); 

      if (summaries && summaries.length > 0) {
        const matchedSummary = summaries.find(s => s.designerProfile === designerProfileString);
        if (matchedSummary) {
          setDisplayBids(prev => prev.map(b => b.id === bidId ? { ...b, aiSummaryText: matchedSummary.summary, isLoadingSummary: false } : b));
          toast({ title: "Summary Generated", description: `AI summary created for ${bidToSummarize.designerName}'s bid.`});
        } else {
           throw new Error("AI summary output did not match expected format or input profile string.");
        }
      } else {
        throw new Error("No summary returned from AI.");
      }
    } catch (error) {
      console.error("Error summarizing bid:", error);
      toast({ title: "Error", description: `Failed to generate summary. ${(error as Error).message}`, variant: "destructive" });
      setDisplayBids(prev => prev.map(b => b.id === bidId ? { ...b, isLoadingSummary: false } : b));
    }
  };
  
  const handleSummarizeAllBids = async () => {
    setIsSummarizingAll(true);
    setDisplayBids(prev => prev.map(b => ({ ...b, isLoadingSummary: !b.aiSummaryText }))); 

    try {
        const bidsToProcess: BidForSummary[] = await Promise.all(
            displayBids
            .filter(bid => !bid.aiSummaryText) 
            .map(async (bid) => {
                const designerProfileString = await getDesignerProfileString(bid.designerId);
                return {
                    designerProfile: designerProfileString, 
                    bidAmount: bid.bidAmount,
                    experienceSummary: bid.experienceSummary,
                    coverLetter: bid.coverLetter,
                };
            })
        );

        if (bidsToProcess.length === 0) {
            toast({ title: "All Bids Summarized", description: "All bids already have AI summaries."});
            setIsSummarizingAll(false);
            setDisplayBids(prev => prev.map(b => ({ ...b, isLoadingSummary: false })));
            return;
        }

        const aiInput: SummarizeBidsServiceInput = {
            jobDescription: job.description,
            jobBudget: job.budget, 
            bids: bidsToProcess,
        };

        const summariesOutput = await summarizeBids(aiInput);

        const updatedBids = displayBids.map(originalBid => {
            const summaryForThisBid = summariesOutput.find(s => {
                const matchingProcessedBid = bidsToProcess.find(pBid => pBid.designerProfile === s.designerProfile);
                if (!matchingProcessedBid) return false;
                return matchingProcessedBid.bidAmount === originalBid.bidAmount &&
                       matchingProcessedBid.coverLetter.startsWith(originalBid.coverLetter.substring(0,20));
            });


            if (summaryForThisBid) {
                return { ...originalBid, aiSummaryText: summaryForThisBid.summary, isLoadingSummary: false };
            }
            return { ...originalBid, isLoadingSummary: false }; 
        });
        

        setDisplayBids(updatedBids);
        toast({ title: "Summaries Generated", description: `AI summaries created for applicable bids.`});

    } catch (error) {
        console.error("Error summarizing all bids:", error);
        toast({ title: "Error", description: `Failed to generate all summaries. ${(error as Error).message}`, variant: "destructive" });
    } finally {
        setIsSummarizingAll(false);
        setDisplayBids(prev => prev.map(b => ({ ...b, isLoadingSummary: false })));
    }
  };


  if (displayBids.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">No Bids Received Yet</CardTitle>
          <CardDescription>Check back later to see applications from talented designers.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Once designers start applying, their bids will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const rankedBids = [...displayBids].sort((a, b) => {
    if (a.bidAmount < b.bidAmount) return -1;
    if (a.bidAmount > b.bidAmount) return 1;
    if (a.aiSummaryText && !b.aiSummaryText) return -1; 
    if (!a.aiSummaryText && b.aiSummaryText) return 1;
    return 0;
  }).map((bid, index) => ({...bid, rank: index + 1}));


  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-foreground">Received Bids ({rankedBids.length})</h2>
            <Button onClick={handleSummarizeAllBids} disabled={isSummarizingAll || rankedBids.every(b => b.aiSummaryText)}>
                {isSummarizingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isSummarizingAll ? "Summarizing..." : "Summarize All Bids with AI"}
            </Button>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
        {rankedBids.map((bid) => (
          <AccordionItem value={`bid-${bid.id}`} key={bid.id} className="border bg-card rounded-lg shadow-md">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                <div className="flex items-center gap-4 flex-grow">
                  {bid.designerDetails?.avatarUrl ? (
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={bid.designerDetails.avatarUrl} alt={bid.designerName} data-ai-hint="designer avatar"/>
                        <AvatarFallback>{getInitials(bid.designerName)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserCircle className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-primary group-hover:underline">
                        <Link href={`/designer/${bid.designerId}`} onClick={(e) => e.stopPropagation()}>{bid.designerName}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{bid.designerDetails?.headline || 'Professional Designer'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1 text-sm md:text-right">
                    <Badge variant="secondary" className="text-lg px-3 py-1.5 bg-primary/10 text-primary">
                        <DollarSign className="mr-1.5 h-5 w-5" /> ${bid.bidAmount.toLocaleString()}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Submitted: {new Date(bid.submittedAt).toLocaleDateString()}</p>
                    {bid.rank && <Badge variant="outline" className="border-accent text-accent">Rank #{bid.rank}</Badge>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="border-t pt-4 space-y-4">
                {bid.aiSummaryText ? (
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center text-primary"><Sparkles className="mr-2 h-5 w-5"/> AI Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground/80 whitespace-pre-line">{bid.aiSummaryText}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center p-4 border border-dashed rounded-md">
                         {bid.isLoadingSummary ? (
                            <Button disabled size="sm">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Summary...
                            </Button>
                         ) : (
                             <Button onClick={() => handleSummarizeBid(bid.id)} size="sm" variant="outline" className="text-primary border-primary hover:bg-primary/10">
                                <Sparkles className="mr-2 h-4 w-4" /> Generate AI Summary
                            </Button>
                         )}
                    </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Cover Letter Snippet:</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{bid.coverLetter}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Experience Summary:</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{bid.experienceSummary}</p>
                </div>

                {/* Contact Information Section */}
                {bid.designerDetails && (
                    <Card className="bg-secondary/30 border-secondary">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-md flex items-center text-foreground">
                          <UserCircle className="mr-2 h-5 w-5 text-primary"/> Designer Contact
                        </CardTitle>
                         <CardDescription className="text-xs">
                            Contact information provided by the designer.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1 pb-4">
                        {bid.designerDetails.email && (
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-primary/70" /> Email: {bid.designerDetails.email}
                          </p>
                        )}
                        {bid.designerDetails.phone && (
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-primary/70" /> Phone: {bid.designerDetails.phone}
                          </p>
                        )}
                        {(!bid.designerDetails.email && !bid.designerDetails.phone) && (
                            <p className="text-sm text-muted-foreground italic">Contact information not publicly shared by the designer.</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-4">
                  <Button asChild className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={`/designer/${bid.designerId}/contact`}> {/* Placeholder contact link */}
                      <MessageSquare className="mr-2 h-4 w-4" /> Contact {bid.designerName.split(' ')[0]}
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Shortlist
                  </Button>
                   <Button variant="ghost" className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <ThumbsDown className="mr-2 h-4 w-4" /> Decline
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

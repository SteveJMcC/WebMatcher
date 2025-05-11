
"use client";

import type { Bid, JobPosting, SummarizedBidOutput, SummarizeBidsServiceInput, BidForSummary } from "@/lib/types";
import type { DesignerProfile } from "@/lib/types"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, UserCircle, MessageSquare, ThumbsUp, ThumbsDown, Sparkles, Info, AlertTriangle, Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { summarizeBids } from "@/ai/flows/summarize-bids"; 
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface JobBidsDisplayProps {
  job: JobPosting;
  initialBids: Bid[]; // These might already contain info about deleted designers from manage page
  getDesignerProfileString: (designerId: string) => Promise<string>; 
  getDesignerDetails: (designerId: string) => Promise<DesignerProfile | null>; 
}

interface DisplayBid extends Bid {
  aiSummaryText?: string;
  isLoadingSummary?: boolean;
  designerDetails?: DesignerProfile | null;
  designerAccountDeleted?: boolean; // Flag for deleted designer
}

const getInitials = (name: string) => {
    if (!name || name === "Deleted Web Professional") return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function JobBidsDisplay({ job, initialBids, getDesignerProfileString, getDesignerDetails }: JobBidsDisplayProps) {
  const [displayBids, setDisplayBids] = useState<DisplayBid[]>([]);
  const [isSummarizingAll, setIsSummarizingAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDesignerDetailsForBids = async () => {
      if (!initialBids || initialBids.length === 0) {
        setDisplayBids([]);
        return;
      }
      const bidsWithDetails = await Promise.all(
        initialBids.map(async (bid) => {
          // Check if this bid explicitly marks the designer as deleted (from manage page logic)
          if ((bid as any).designerAccountDeleted || bid.designerName === "Deleted Web Professional") {
            return { ...bid, designerDetails: null, isLoadingSummary: false, designerAccountDeleted: true };
          }
          // Otherwise, try to fetch details
          const details = await getDesignerDetails(bid.designerId);
          return { 
            ...bid, 
            designerDetails: details, 
            isLoadingSummary: false, 
            designerAccountDeleted: !details // If no details, assume deleted
          };
        })
      );
      setDisplayBids(bidsWithDetails as DisplayBid[]);
    };
    
    fetchDesignerDetailsForBids();
  }, [initialBids, getDesignerDetails]);


  const handleSummarizeBid = async (bidId: string) => {
    const bidIndex = displayBids.findIndex(b => b.id === bidId);
    if (bidIndex === -1) return;
    
    const bidToSummarize = displayBids[bidIndex];
    if (bidToSummarize.designerAccountDeleted) {
        toast({ title: "Cannot Summarize", description: "This web professional's account has been deleted.", variant: "destructive" });
        return;
    }

    setDisplayBids(prev => prev.map(b => b.id === bidId ? { ...b, isLoadingSummary: true } : b));

    try {
      const designerProfileString = await getDesignerProfileString(bidToSummarize.designerId);
      if (designerProfileString.includes("profile not available or has been removed")) {
        setDisplayBids(prev => prev.map(b => b.id === bidId ? { ...b, isLoadingSummary: false, designerAccountDeleted: true, aiSummaryText: "Web Professional profile not available for summary." } : b));
        toast({ title: "Cannot Summarize", description: "Web Professional profile not available.", variant: "destructive" });
        return;
      }


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
    setDisplayBids(prev => prev.map(b => ({ ...b, isLoadingSummary: !b.aiSummaryText && !b.designerAccountDeleted }))); 

    try {
        const bidsToProcess: BidForSummary[] = [];
        const profileStringsMap = new Map<string, string>(); // Map designerId to profileString

        for (const bid of displayBids) {
            if (!bid.aiSummaryText && !bid.designerAccountDeleted) {
                const designerProfileString = await getDesignerProfileString(bid.designerId);
                if (designerProfileString.includes("profile not available or has been removed")) {
                    // Mark this specific bid as undeletable and skip
                    setDisplayBids(prevBids => prevBids.map(pb => pb.id === bid.id ? {...pb, designerAccountDeleted: true, isLoadingSummary: false, aiSummaryText: "Web Professional profile not available."} : pb));
                    continue;
                }
                profileStringsMap.set(bid.designerId, designerProfileString);
                bidsToProcess.push({
                    designerProfile: designerProfileString, 
                    bidAmount: bid.bidAmount,
                    experienceSummary: bid.experienceSummary,
                    coverLetter: bid.coverLetter,
                });
            }
        }


        if (bidsToProcess.length === 0) {
            toast({ title: "All Bids Handled", description: "All applicable bids already have AI summaries or associated designer accounts are unavailable."});
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
            if (originalBid.designerAccountDeleted || originalBid.aiSummaryText) { // Skip if already handled or summarized
                 return { ...originalBid, isLoadingSummary: false };
            }
            const originalProfileString = profileStringsMap.get(originalBid.designerId);
            const summaryForThisBid = summariesOutput.find(s => s.designerProfile === originalProfileString);

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
        // Ensure all loading states are false
        setDisplayBids(prev => prev.map(b => ({ ...b, isLoadingSummary: false })));
    }
  };


  if (displayBids.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">No Responses Received Yet</CardTitle>
          <CardDescription>Once web professionals apply to your job, their interest will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Check back later or share your job posting to attract talent.</p>
        </CardContent>
      </Card>
    );
  }

  const rankedBids = [...displayBids].sort((a, b) => {
    if (a.bidAmount === 0 && b.bidAmount !== 0) return 1; 
    if (a.bidAmount !== 0 && b.bidAmount === 0) return -1;
    if (a.bidAmount < b.bidAmount) return -1;
    if (a.bidAmount > b.bidAmount) return 1;
    if (a.aiSummaryText && !b.aiSummaryText) return -1; 
    if (!a.aiSummaryText && b.aiSummaryText) return 1;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(); 
  }).map((bid, index) => ({...bid, rank: index + 1}));


  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-foreground">Received Responses ({rankedBids.length})</h2>
            <Button onClick={handleSummarizeAllBids} disabled={isSummarizingAll || rankedBids.every(b => b.aiSummaryText || b.designerAccountDeleted)}>
                {isSummarizingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isSummarizingAll ? "Summarizing..." : "Summarize All with AI"}
            </Button>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
        {rankedBids.map((bid) => (
          <AccordionItem value={`bid-${bid.id}`} key={bid.id} className="border bg-card rounded-lg shadow-md">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                <div className="flex items-center gap-4 flex-grow">
                  {bid.designerAccountDeleted ? (
                    <Avatar className="h-12 w-12">
                        <AvatarFallback><Trash2 className="text-destructive"/></AvatarFallback>
                    </Avatar>
                  ) : bid.designerDetails?.avatarUrl || bid.designerAvatar ? (
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={bid.designerDetails?.avatarUrl || bid.designerAvatar} alt={bid.designerName} data-ai-hint="designer avatar"/>
                        <AvatarFallback>{getInitials(bid.designerName)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserCircle className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                        {bid.designerName}
                    </h3>
                    {!bid.designerAccountDeleted && bid.designerDetails?.headline && (
                        <p className="text-sm text-muted-foreground">{bid.designerDetails.headline}</p>
                    )}
                    {bid.designerAccountDeleted && (
                        <p className="text-sm text-destructive">Account Deleted</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1 text-sm md:text-right">
                    {bid.bidAmount > 0 ? (
                      <Badge variant="secondary" className="text-lg px-3 py-1.5 bg-primary/10 text-primary">
                          <DollarSign className="mr-1.5 h-5 w-5" /> ${bid.bidAmount.toLocaleString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-sm px-2 py-1 border-dashed">
                        Contact Unlocked
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">Applied: {new Date(bid.submittedAt).toLocaleDateString()}</p>
                    {bid.rank && <Badge variant="outline" className="border-accent text-accent">Rank #{bid.rank}</Badge>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="border-t pt-4 space-y-4">
                {bid.designerAccountDeleted ? (
                    <Card className="bg-destructive/10 border-destructive/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md flex items-center text-destructive"><AlertTriangle className="mr-2 h-5 w-5"/> Account Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-destructive/80">This web professional's account has been deleted. Bid details and AI summary are unavailable.</p>
                        </CardContent>
                    </Card>
                ) : bid.aiSummaryText ? (
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
                
                {!bid.designerAccountDeleted && (
                    <>
                        <div>
                        <h4 className="font-semibold text-foreground mb-1">Interest Note / Cover Letter:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{bid.coverLetter}</p>
                        </div>
                        <div>
                        <h4 className="font-semibold text-foreground mb-1">Experience Summary:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{bid.experienceSummary}</p>
                        </div>
                    </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

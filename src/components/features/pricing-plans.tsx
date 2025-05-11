
"use client";

import type { PricingPlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Star, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const plans: PricingPlan[] = [
  {
    id: "bronze",
    name: "Bronze Plan",
    price: 89,
    tokens: 50,
    features: ["50 Tokens to apply for jobs", "Basic profile listing", "Standard support"],
  },
  {
    id: "silver",
    name: "Silver Plan",
    price: 129,
    tokens: 100,
    features: [
      "100 Tokens",
      "Featured profile listing",
      "Improved search visibility",
      "Access to more jobs",
      "Priority support",
    ],
    isPopular: true,
  },
  {
    id: "gold",
    name: "Gold Plan",
    price: 299,
    tokens: 250,
    features: [
      "250 Tokens for your team",
      "Top-tier profile visibility",
      "Dedicated account manager",
      "Early access to new features",
      "24/7 Premium support",
    ],
  },
];

interface PlanStyles {
  cardBg: string;
  cardBorder: string;
  buttonClass: string;
}

const getPlanStyles = (planId: string): PlanStyles => {
  switch (planId) {
    case "gold":
      return {
        cardBg: "bg-accent/5", 
        cardBorder: "border-accent", 
        buttonClass: "bg-accent hover:bg-accent/90 text-accent-foreground",
      };
    case "silver":
      return {
        cardBg: "bg-secondary/30", 
        cardBorder: "border-secondary", 
        buttonClass: "bg-muted hover:bg-muted/80 text-muted-foreground border border-border",
      };
    case "bronze":
      return {
        cardBg: "bg-accent/10", // Use accent (gold/yellow) for a bronze feel - very light gold
        cardBorder: "border-accent border-opacity-75", // Gold border, slightly less opaque
        buttonClass: "bg-accent/80 hover:bg-accent/70 text-accent-foreground", // Gold button, less opaque/vibrant
      };
    default:
      return {
        cardBg: "bg-card",
        cardBorder: "border-border",
        buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
      };
  }
};


export function PricingPlans() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-3">Web Professional Token Plans</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Purchase tokens to apply for jobs and get noticed by clients. Choose the plan that fits your needs.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const planStyles = getPlanStyles(plan.id);
            let cardSpecificClasses = cn(planStyles.cardBg, planStyles.cardBorder);
            let popularBadgeVariant: "default" | "outline" = "default";
            let popularBadgeClasses = "bg-accent text-accent-foreground";
            
            if (plan.isPopular) {
              if (plan.id === "silver") {
                cardSpecificClasses = cn(planStyles.cardBg, "border-2", planStyles.cardBorder, "ring-2 ring-border");
                popularBadgeVariant = "outline";
                popularBadgeClasses = "bg-muted text-muted-foreground border-border";
              } else { // For other popular plans (e.g. if Gold becomes popular)
                cardSpecificClasses = cn(planStyles.cardBg, "border-2 border-accent ring-2 ring-accent/50");
              }
            }
            
            const buttonClass = plan.isPopular && plan.id !== "silver" 
              ? "bg-accent hover:bg-accent/90 text-accent-foreground" 
              : plan.isPopular && plan.id === "silver" 
              ? "bg-muted hover:bg-muted/80 text-muted-foreground border border-border" 
              : planStyles.buttonClass;


            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 relative", 
                  cardSpecificClasses
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge variant={popularBadgeVariant} className={cn("text-sm px-4 py-1 flex items-center gap-1 shadow-md", popularBadgeClasses)}>
                          <Star className="h-4 w-4"/> Popular Choice
                      </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-10"> 
                  <CardTitle className="text-3xl font-semibold mb-2">{plan.name}</CardTitle>
                  <p className="text-4xl font-bold text-primary">
                    £{plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/ one-time</span>
                  </p>
                  <CardDescription className="text-lg font-semibold text-amber-600 mt-2">{plan.tokens} Tokens</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 text-muted-foreground">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full text-lg py-6",
                      buttonClass
                    )}
                  >
                    <Link href={`/payment?planId=${plan.id}&planName=${encodeURIComponent(plan.name)}&price=${plan.price}&tokens=${plan.tokens}`}>
                      <CreditCard className="mr-2 h-5 w-5" /> Purchase Tokens
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center p-8 bg-secondary rounded-lg shadow">
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Need More Tokens or a Custom Plan?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                If you have specific needs or require a larger volume of tokens for your agency,
                get in touch with us for a custom solution.
            </p>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                Contact Sales
            </Button>
        </div>
      </div>
    </section>
  );
}


"use client";

import type { PricingPlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Pack",
    price: 29,
    tokens: 50,
    features: ["50 Tokens to apply for jobs", "Basic profile listing", "Standard support"],
  },
  {
    id: "pro",
    name: "Pro Designer",
    price: 59,
    tokens: 120,
    features: [
      "120 Tokens (Best Value!)",
      "Featured profile listing",
      "Priority in search results",
      "Access to premium jobs",
      "Priority support",
    ],
    isPopular: true,
  },
  {
    id: "elite",
    name: "Elite Agency",
    price: 99,
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

export function PricingPlans() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-3">Designer Token Plans</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Purchase tokens to apply for jobs and get noticed by clients. Choose the plan that fits your needs.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300",
                plan.isPopular ? "border-2 border-accent ring-2 ring-accent/50" : ""
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="bg-accent text-accent-foreground text-sm px-4 py-1 flex items-center gap-1">
                        <Star className="h-4 w-4"/> Popular Choice
                    </Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-3xl font-semibold mb-2">{plan.name}</CardTitle>
                <p className="text-4xl font-bold text-primary">
                  ${plan.price}
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
                  size="lg"
                  className={cn(
                    "w-full text-lg py-6",
                    plan.isPopular ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "bg-primary hover:bg-primary/90"
                  )}
                >
                  Purchase Tokens
                </Button>
              </CardFooter>
            </Card>
          ))}
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


"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

function PaymentGatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { updateDesignerTokens } = useAuth();

  const planId = searchParams.get('planId');
  const planName = searchParams.get('planName');
  const price = searchParams.get('price');
  const tokensString = searchParams.get('tokens'); // Read as string

  if (!planId || !planName || !price || !tokensString) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold">Invalid Plan Information</CardTitle>
          <CardDescription>The selected plan details are missing or incomplete. Please try selecting a plan again.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/pricing">Go to Pricing</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const planTokens = parseInt(tokensString, 10);

  const handleConfirmPayment = () => {
    // Mock payment processing
    if (planTokens > 0) {
      updateDesignerTokens(planTokens);
    }

    toast({
      title: "Payment Successful!",
      description: `You have successfully purchased the ${planName} for $${price} (${planTokens} tokens).`,
      variant: "default",
      duration: 5000,
      action: <CheckCircle className="text-green-500" />,
    });
    router.push('/designer-dashboard'); 
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
        <CardTitle className="text-3xl font-bold">Complete Your Purchase</CardTitle>
        <CardDescription>You are about to purchase the following token plan:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-secondary rounded-lg">
          <h3 className="text-xl font-semibold text-primary mb-2">{planName}</h3>
          <p className="text-2xl font-bold text-foreground">${price}</p>
          <p className="text-md text-muted-foreground">{planTokens} Tokens</p>
        </div>
        
        {/* Placeholder for payment form fields */}
        <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
                This is a mock payment gateway. In a real application, you would enter your payment details here.
            </p>
             {/* Example of where form fields would go */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-1">Card Number</label>
              <input id="cardNumber" type="text" placeholder="**** **** **** ****" className="w-full p-2 border rounded-md bg-background" disabled />
            </div>
             <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground mb-1">Expiry Date</label>
              <input id="expiryDate" type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md bg-background" disabled />
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button onClick={handleConfirmPayment} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
          <Sparkles className="mr-2 h-5 w-5" /> Confirm Payment & Get Tokens
        </Button>
        <Button variant="outline" asChild className="w-full">
            <Link href="/pricing">Cancel and Go Back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-15rem)]">
       <Suspense fallback={<div className="text-center text-lg">Loading payment details...</div>}>
        <PaymentGatewayContent />
      </Suspense>
    </div>
  );
}


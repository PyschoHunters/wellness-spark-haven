
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, AlertCircle, CreditCard, Award, Shield } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PlanFeature {
  included: boolean;
  text: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  billingPeriod: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 299,
    oldPrice: 499,
    billingPeriod: 'monthly',
    description: 'Essential features for your fitness journey',
    features: [
      { included: true, text: 'Workout tracking' },
      { included: true, text: 'Basic nutrition guidance' },
      { included: true, text: 'Weekly progress reports' },
      { included: false, text: 'Personalized workout plans' },
      { included: false, text: 'One-on-one coaching' },
      { included: false, text: 'Premium content' }
    ]
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 799,
    oldPrice: 999,
    billingPeriod: 'monthly',
    description: 'Advanced features for dedicated fitness enthusiasts',
    features: [
      { included: true, text: 'Workout tracking' },
      { included: true, text: 'Advanced nutrition guidance' },
      { included: true, text: 'Weekly progress reports' },
      { included: true, text: 'Personalized workout plans' },
      { included: true, text: 'One-on-one coaching sessions (2/month)' },
      { included: false, text: 'Premium content' }
    ],
    highlighted: true
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 1499,
    billingPeriod: 'monthly',
    description: 'Comprehensive suite for serious fitness goals',
    features: [
      { included: true, text: 'Workout tracking' },
      { included: true, text: 'Expert nutrition guidance' },
      { included: true, text: 'Daily progress reports' },
      { included: true, text: 'Personalized workout plans' },
      { included: true, text: 'One-on-one coaching sessions (unlimited)' },
      { included: true, text: 'Premium content' }
    ]
  }
];

const yearlyPlans: Plan[] = plans.map(plan => ({
  ...plan,
  id: `${plan.id}-yearly`,
  price: Math.floor(plan.price * 10.8), // 10% discount for yearly billing
  oldPrice: plan.oldPrice ? Math.floor(plan.oldPrice * 12) : undefined,
  billingPeriod: 'yearly'
}));

const RazorpayPayment = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    orderId: string;
    amount: number;
    planName: string;
  } | null>(null);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan: Plan) => {
    setSelectedPlan(plan);
    setPaymentLoading(true);
    
    try {
      // Ensure Razorpay is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }
      
      // Create order via our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: {
          amount: plan.price,
          userId: user?.id,
          currency: 'INR',
          description: `${plan.name} - ${plan.billingPeriod} subscription`
        }
      });
      
      if (error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
      
      // Open Razorpay checkout
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "FitTrack",
        description: `${plan.name} - ${plan.billingPeriod} subscription`,
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            // Update payment status in database
            const { error: updateError } = await supabase
              .from('payments')
              .update({
                status: 'completed',
                payment_id: response.razorpay_payment_id,
                payment_signature: response.razorpay_signature
              })
              .eq('order_id', response.razorpay_order_id);
              
            if (updateError) {
              throw new Error(`Failed to update payment: ${updateError.message}`);
            }
            
            // Show success confirmation
            setTransactionDetails({
              orderId: response.razorpay_order_id,
              amount: plan.price,
              planName: plan.name
            });
            setShowConfirmation(true);
            
          } catch (error) {
            console.error("Payment verification error:", error);
            showActionToast("Payment recorded but verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4F46E5",
        },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      showActionToast("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Upgrade Your Fitness Journey</h2>
        <p className="text-fitness-gray max-w-xl mx-auto">
          Unlock premium features and personalized guidance to accelerate your fitness results
        </p>
        
        <Tabs 
          defaultValue="monthly" 
          value={billingCycle}
          onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
          className="mt-6"
        >
          <TabsList className="mx-auto">
            <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly Billing
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Save 10%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(billingCycle === 'monthly' ? plans : yearlyPlans).map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.highlighted ? 'border-fitness-primary shadow-lg' : ''}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max bg-fitness-primary text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="mt-4">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  {plan.oldPrice && (
                    <span className="text-sm text-fitness-gray line-through ml-2">₹{plan.oldPrice}</span>
                  )}
                </div>
                <p className="text-sm text-fitness-gray mt-1">
                  per {plan.billingPeriod === 'monthly' ? 'month' : 'year'}
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <AlertCircle size={18} className="text-fitness-gray" />
                    )}
                    <span className={feature.included ? '' : 'text-fitness-gray'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${plan.highlighted ? 'bg-fitness-primary' : ''}`}
                onClick={() => handlePayment(plan)}
                disabled={paymentLoading}
              >
                {paymentLoading && selectedPlan?.id === plan.id ? 'Processing...' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-fitness-primary/10 p-3 rounded-full mb-3">
            <CreditCard className="h-6 w-6 text-fitness-primary" />
          </div>
          <h3 className="font-medium mb-1">Secure Payments</h3>
          <p className="text-sm text-fitness-gray">
            All transactions are processed securely with Razorpay
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-fitness-primary/10 p-3 rounded-full mb-3">
            <Award className="h-6 w-6 text-fitness-primary" />
          </div>
          <h3 className="font-medium mb-1">Satisfaction Guaranteed</h3>
          <p className="text-sm text-fitness-gray">
            7-day money-back guarantee if you're not satisfied
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-fitness-primary/10 p-3 rounded-full mb-3">
            <Shield className="h-6 w-6 text-fitness-primary" />
          </div>
          <h3 className="font-medium mb-1">Privacy Protected</h3>
          <p className="text-sm text-fitness-gray">
            Your personal data is never shared with third parties
          </p>
        </div>
      </div>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful!</DialogTitle>
            <DialogDescription>
              Thank you for upgrading your FitTrack subscription
            </DialogDescription>
          </DialogHeader>
          
          {transactionDetails && (
            <div className="space-y-4 my-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
                <Check className="h-6 w-6" />
                <p>Your payment was successfully processed</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fitness-gray">Plan:</span>
                  <span className="font-medium">{transactionDetails.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fitness-gray">Amount:</span>
                  <span className="font-medium">₹{transactionDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fitness-gray">Order ID:</span>
                  <span className="font-medium">{transactionDetails.orderId}</span>
                </div>
              </div>
              
              <p className="text-sm text-fitness-gray">
                A receipt has been sent to your email address. Your premium features are now unlocked!
              </p>
            </div>
          )}
          
          <Button onClick={() => setShowConfirmation(false)}>
            Continue to Dashboard
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RazorpayPayment;

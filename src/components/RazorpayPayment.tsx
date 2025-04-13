
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { BadgeCheck, CheckCircle, Shield } from "lucide-react";
import { showActionToast } from "@/utils/toast-utils";
import { useAuth } from "@/contexts/AuthContext";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 999,
    description: "Essential features to start your fitness journey",
    features: [
      "Unlimited workouts",
      "Basic progress tracking",
      "3 workout plans",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1999,
    description: "Advanced features for serious fitness enthusiasts",
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Unlimited workout plans",
      "Nutrition guidance",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 3999,
    description: "Complete fitness solution for maximum results",
    features: [
      "Everything in Pro",
      "Personal trainer consultation",
      "Custom workout creation",
      "Meal planning",
      "Premium content",
      "Family accounts (up to 5)",
    ],
  },
];

const RazorpayPayment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectedPlan = () => {
    return plans.find((plan) => plan.id === selectedPlan);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call your backend to create an order
      // For demonstration, we're simulating a successful payment after a delay
      
      setTimeout(() => {
        showActionToast(`Payment successful for ${getSelectedPlan()?.name} plan!`);
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error("Payment error:", error);
      showActionToast("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Prefill form with user data if available
  React.useEffect(() => {
    if (user) {
      const userData = {
        email: user.email || "",
        name: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
      };
      
      setFormData(prevData => ({
        ...prevData,
        ...userData
      }));
    }
  }, [user]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upgrade Your Plan</CardTitle>
        <CardDescription>
          Choose a plan that works for your fitness goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            defaultValue={selectedPlan}
            value={selectedPlan}
            onValueChange={setSelectedPlan}
            className="grid gap-4"
          >
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${
                    plan.popular ? "ring-2 ring-primary/30" : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-base font-semibold">
                        {plan.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">
                        ₹{plan.price.toLocaleString()}
                      </span>
                      <p className="text-xs text-muted-foreground">per year</p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 mt-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.popular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white flex items-center gap-0.5">
                        <BadgeCheck className="h-3 w-3" />
                        POPULAR
                      </div>
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-medium">
                Total: ₹{getSelectedPlan()?.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Billed annually
              </p>
            </div>
            <Button
              onClick={handlePayment}
              disabled={
                isProcessing ||
                !formData.name ||
                !formData.email ||
                !formData.phone
              }
              className="relative"
            >
              {isProcessing ? "Processing..." : "Pay Now"}
              <Shield className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2 flex items-center justify-center">
            <Shield className="inline h-3 w-3 mr-1" />
            Secure payment processing powered by Razorpay
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;

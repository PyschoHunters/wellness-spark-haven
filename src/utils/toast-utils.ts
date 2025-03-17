
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

export const showToast = (title: string, description?: string) => {
  toast({
    title,
    description,
  });
};

export const showActionToast = (message: string) => {
  sonnerToast(message, {
    position: "bottom-center",
    duration: 2000,
  });
};

export const sendEmailReminder = (email: string, workoutTitle: string, workoutTime: string) => {
  // NOTE: This is a demo app, so no actual emails are sent
  // In a production environment, this would connect to a backend email service
  console.log(`[DEMO] Email would be sent to ${email} for ${workoutTitle} at ${workoutTime}`);
  
  // Show more detailed information
  showToast(
    "Reminder Email Configured", 
    `In a real app, a reminder email would be sent to ${email} for your "${workoutTitle}" workout at ${workoutTime}. This is a demo version, so no actual email is sent.`
  );
  
  // Also show a more immediate notification
  showActionToast(`Email reminder configured for ${email}`);
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  console.log(`[DEMO] Diet reminder would be sent to ${email} for ${mealType}`);
  
  showToast(
    "Diet Reminder Configured", 
    `In a real app, a meal plan reminder would be sent to ${email} for your ${mealType}. This is a demo version, so no actual email is sent.`
  );
  
  return true;
};

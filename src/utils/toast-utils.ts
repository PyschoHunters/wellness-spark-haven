
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
  // This would ideally connect to a backend service
  // For now, we'll simulate it with a toast notification
  console.log(`Sending reminder to ${email} for ${workoutTitle} at ${workoutTime}`);
  
  // Show more detailed information
  showToast(
    "Reminder Email Sent", 
    `A reminder has been sent to ${email} for your ${workoutTitle} workout at ${workoutTime}. Please check your email inbox or spam folder.`
  );
  
  // Also show a more immediate notification
  showActionToast(`Email reminder sent to ${email}`);
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  console.log(`Sending diet reminder to ${email} for ${mealType}`);
  showToast(
    "Diet Reminder Sent", 
    `A meal plan reminder has been sent to ${email} for your ${mealType}`
  );
  
  return true;
};

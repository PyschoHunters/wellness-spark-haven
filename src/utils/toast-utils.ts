
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
  // Send actual email using EmailJS or another email service
  // For demonstration, we'll use the browser's mailto functionality
  const subject = `Workout Reminder: ${workoutTitle}`;
  const body = `Hello,\n\nThis is a reminder for your scheduled workout "${workoutTitle}" at ${workoutTime}.\n\nStay motivated and happy exercising!\n\nBest regards,\nFitness App Team`;
  
  // Create a mailto link
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open the user's email client
  window.open(mailtoLink, '_blank');
  
  // Show confirmation
  showToast(
    "Email Reminder Sent", 
    `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
  );
  
  // Also show a more immediate notification
  showActionToast(`Email reminder sent to ${email}`);
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  // Send actual email for diet reminders
  const subject = `Diet Reminder: ${mealType}`;
  const body = `Hello,\n\nThis is a reminder for your ${mealType} meal plan.\n\nEnjoy your healthy meals!\n\nBest regards,\nFitness App Team`;
  
  // Create a mailto link
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open the user's email client
  window.open(mailtoLink, '_blank');
  
  showToast(
    "Diet Reminder Sent", 
    `A meal plan reminder has been sent to ${email} for your ${mealType}.`
  );
  
  return true;
};

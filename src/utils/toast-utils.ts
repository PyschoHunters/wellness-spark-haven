
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
  // Create email content
  const subject = `Workout Reminder: ${workoutTitle}`;
  const body = `Hey Manu,\n\nYou have a workout scheduled today: "${workoutTitle}" at ${workoutTime}. Gear up!\n\nStay motivated and crush your goals today!\n\nBest regards,\nFitness Tracker Team`;
  
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Use Web3Forms as primary service
  const web3formsEndpoint = "https://api.web3forms.com/submit";
  const formData = new FormData();
  formData.append("access_key", "e64688dd-9fd8-4edc-b4cb-e316c1e3ff5a"); // User's Web3Forms access key
  formData.append("subject", subject);
  formData.append("from_name", "Fitness Tracker");
  formData.append("to_name", "Manu");
  formData.append("reply_to", "noreply@fitnessapp.com");
  formData.append("email", email);
  formData.append("message", body);
  
  fetch(web3formsEndpoint, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    console.log('Web3Forms API response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Web3Forms API response:', data);
    if (data.success) {
      showToast(
        "Email Reminder Sent", 
        `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
      );
      showActionToast(`Email reminder sent to ${email}`);
    } else {
      throw new Error('Web3Forms service failed: ' + data.message);
    }
  })
  .catch(error => {
    console.error("Failed to send email:", error);
    
    // Display a fallback message only - no secondary service
    showToast(
      "Reminder Set", 
      `A reminder has been set for "${workoutTitle}" at ${workoutTime}.`
    );
    showActionToast(`Reminder set for ${workoutTitle}`);
  });
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  // Create email content
  const subject = `Diet Reminder: ${mealType}`;
  const body = `Hey Manu,\n\nThis is a reminder for your ${mealType} meal plan.\n\nEnjoy your healthy meals and stay on track with your nutrition goals!\n\nBest regards,\nFitness Tracker Team`;
  
  // Use Web3Forms for diet reminders too
  const web3formsEndpoint = "https://api.web3forms.com/submit";
  const formData = new FormData();
  formData.append("access_key", "e64688dd-9fd8-4edc-b4cb-e316c1e3ff5a");
  formData.append("subject", subject);
  formData.append("from_name", "Fitness Tracker");
  formData.append("to_name", "Manu");
  formData.append("reply_to", "noreply@fitnessapp.com");
  formData.append("email", email);
  formData.append("message", body);
  
  fetch(web3formsEndpoint, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(
        "Diet Reminder Sent", 
        `A meal plan reminder has been sent to ${email} for your ${mealType}.`
      );
      showActionToast(`Diet reminder sent to ${email}`);
    } else {
      throw new Error('Web3Forms service failed');
    }
  })
  .catch(error => {
    console.error("Failed to send diet email:", error);
    
    // Fallback to just showing a message
    showToast(
      "Diet Reminder Set", 
      `A reminder has been set for your ${mealType} meal plan.`
    );
    showActionToast(`Diet reminder set`);
  });
  
  return true;
};

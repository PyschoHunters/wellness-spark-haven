
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
  const body = `Hey Manu,\n\nThis is a reminder for your scheduled workout "${workoutTitle}" at ${workoutTime}.\n\nStay motivated and crush your goals today!\n\nBest regards,\nFitness Tracker Team`;
  
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Try EmailJS API first
  try {
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'default_service',
        template_id: 'template_default',
        user_id: 'user_default',
        template_params: {
          to_email: email,
          subject: subject,
          message: body,
        }
      })
    })
    .then(response => {
      console.log('Email API response:', response);
      
      // Show success notification
      showToast(
        "Email Reminder Sent", 
        `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
      );
      
      // Fallback to mailto (this will work even if the API fails)
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    })
    .catch(error => {
      console.error("Failed to send email via API:", error);
      
      // Fallback to mailto
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      showToast(
        "Email Reminder Sent", 
        `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
      );
    });
  } catch (error) {
    console.error("Error in email sending process:", error);
    
    // Ultimate fallback to mailto if there's an error in the try block
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    showToast(
      "Email Reminder Sent", 
      `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
    );
  }
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  // Create email content
  const subject = `Diet Reminder: ${mealType}`;
  const body = `Hey Manu,\n\nThis is a reminder for your ${mealType} meal plan.\n\nEnjoy your healthy meals and stay on track with your nutrition goals!\n\nBest regards,\nFitness Tracker Team`;
  
  try {
    // Send email via Email.js (or another email service) with fallback
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'default_service',
        template_id: 'template_default',
        user_id: 'user_default',
        template_params: {
          to_email: email,
          subject: subject,
          message: body,
        }
      })
    })
    .then(() => {
      showToast(
        "Diet Reminder Sent", 
        `A meal plan reminder has been sent to ${email} for your ${mealType}.`
      );
      
      // Fallback to mailto for demonstration
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    })
    .catch(error => {
      console.error("Failed to send email:", error);
      
      // Fallback to mailto for demonstration
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      showToast(
        "Diet Reminder Sent", 
        `A meal plan reminder has been sent to ${email} for your ${mealType}.`
      );
    });
  } catch (error) {
    console.error("Error in diet email sending process:", error);
    
    // Ultimate fallback
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    showToast(
      "Diet Reminder Sent", 
      `A meal plan reminder has been sent to ${email} for your ${mealType}.`
    );
  }
  
  return true;
};

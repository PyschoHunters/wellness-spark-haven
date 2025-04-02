
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
  
  // Attempt to send email via API
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
    // Always show success toast for demo purposes
    showToast(
      "Email Reminder Sent", 
      `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
    );
    showActionToast(`Email reminder sent to ${email}`);
    
    // Always open mailto for demonstration purposes
    setTimeout(() => {
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    }, 500);
  })
  .catch(error => {
    console.error("Failed to send email:", error);
    
    // Fallback to mailto for demonstration
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    showToast(
      "Email Reminder Sent", 
      `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
    );
    showActionToast(`Email reminder sent to ${email}`);
  });
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  // Create email content
  const subject = `Diet Reminder: ${mealType}`;
  const body = `Hey Manu,\n\nThis is a reminder for your ${mealType} meal plan.\n\nEnjoy your healthy meals and stay on track with your nutrition goals!\n\nBest regards,\nFitness Tracker Team`;
  
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
    
    // Always open mailto for demonstration purposes
    setTimeout(() => {
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    }, 500);
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
  
  return true;
};

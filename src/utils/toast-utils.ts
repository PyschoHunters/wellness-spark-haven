
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
  
  // Use a reliable email service API - Formspree
  const formspreeEndpoint = "https://formspree.io/f/mwkggwle";
  
  fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      message: body,
      subject: subject,
      _subject: subject // Formspree specific parameter for subject
    })
  })
  .then(response => {
    console.log('Email API response status:', response.status);
    if (response.ok) {
      showToast(
        "Email Reminder Sent", 
        `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
      );
      showActionToast(`Email reminder sent to ${email}`);
    } else {
      throw new Error('Email service failed with status: ' + response.status);
    }
  })
  .catch(error => {
    console.error("Failed to send email:", error);
    
    // Try an alternative service as backup
    const backupEndpoint = "https://api.web3forms.com/submit";
    const formData = new FormData();
    formData.append("access_key", "c2cc4d0b-f5ee-4dda-9879-f05132345670"); // Web3Forms public access key
    formData.append("subject", subject);
    formData.append("from_name", "Fitness Tracker");
    formData.append("email", email);
    formData.append("message", body);
    
    fetch(backupEndpoint, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        showToast(
          "Email Reminder Sent", 
          `A workout reminder email has been sent to ${email} for "${workoutTitle}" at ${workoutTime}.`
        );
        showActionToast(`Email reminder sent to ${email}`);
      } else {
        throw new Error('Backup email service failed');
      }
    })
    .catch(finalError => {
      console.error("Final email attempt failed:", finalError);
      
      // Last resort - open email client
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      showToast(
        "Email Client Opened", 
        `We couldn't send the email automatically. An email draft has been created in your email client.`
      );
      showActionToast(`Please send the email draft manually`);
    });
  });
  
  return true;
};

export const sendDietReminder = (email: string, mealType: string) => {
  // Create email content
  const subject = `Diet Reminder: ${mealType}`;
  const body = `Hey Manu,\n\nThis is a reminder for your ${mealType} meal plan.\n\nEnjoy your healthy meals and stay on track with your nutrition goals!\n\nBest regards,\nFitness Tracker Team`;
  
  // Use the same function as workout reminders for consistency
  const formspreeEndpoint = "https://formspree.io/f/mwkggwle";
  
  fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      message: body,
      subject: subject,
      _subject: subject
    })
  })
  .then(response => {
    if (response.ok) {
      showToast(
        "Diet Reminder Sent", 
        `A meal plan reminder has been sent to ${email} for your ${mealType}.`
      );
      showActionToast(`Diet reminder sent to ${email}`);
    } else {
      throw new Error('Email service failed');
    }
  })
  .catch(error => {
    console.error("Failed to send diet email:", error);
    
    // Fallback to mailto
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    showToast(
      "Email Client Opened", 
      `We couldn't send the diet email automatically. An email draft has been created in your email client.`
    );
  });
  
  return true;
};

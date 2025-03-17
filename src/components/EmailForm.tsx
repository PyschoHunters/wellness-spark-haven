
import React, { useState } from 'react';
import { X, Mail, Info } from 'lucide-react';
import { showActionToast, sendEmailReminder } from '@/utils/toast-utils';

interface EmailFormProps {
  workoutTitle: string;
  workoutTime: string;
  onClose: () => void;
  onSubmit: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ 
  workoutTitle, 
  workoutTime, 
  onClose,
  onSubmit
}) => {
  const [email, setEmail] = useState('manumohan.ai21@gmail.com');
  const [isSending, setIsSending] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showActionToast('Please enter a valid email address');
      return;
    }
    
    setIsSending(true);
    
    // Send actual email reminder immediately
    sendEmailReminder(email, workoutTitle, workoutTime);
    
    // Close modal and notify parent
    setTimeout(() => {
      onSubmit();
      onClose();
      setIsSending(false);
    }, 1000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden animate-scale-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Schedule Reminder</h2>
          <button 
            className="w-8 h-8 bg-fitness-gray-light rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p className="text-sm text-fitness-gray mb-2">
              You'll receive an email reminder for your scheduled workout:
            </p>
            <div className="bg-fitness-gray-light p-3 rounded-xl mb-3">
              <p className="font-medium">{workoutTitle}</p>
              <p className="text-sm text-fitness-gray">{workoutTime}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-fitness-gray mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitness-primary"
              placeholder="your@email.com"
              required
            />
            <div className="mt-2 flex items-start gap-2 text-xs text-fitness-gray">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p>An email will be sent immediately to this address with workout details.</p>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} />
                Send Reminder
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;

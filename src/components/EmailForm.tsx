
import React, { useState } from 'react';
import { X } from 'lucide-react';
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showActionToast('Please enter a valid email address');
      return;
    }
    
    // Send reminder email
    sendEmailReminder(email, workoutTitle, workoutTime);
    
    // Close modal and notify parent
    onSubmit();
    onClose();
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
              You'll receive an email reminder before your scheduled workout:
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
          </div>
          
          <button 
            type="submit"
            className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium"
          >
            Send Reminder
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;

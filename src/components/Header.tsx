
import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showActionToast } from '@/utils/toast-utils';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  action,
  className 
}) => {
  const { user, signOut } = useAuth();
  
  // Get the user's name for the greeting
  const getUserDisplayName = () => {
    if (!user) return "Guest";
    
    // First try to get the username if available
    if (user.username) {
      return user.username;
    }
    
    // Fall back to email (before the @ symbol)
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize the first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return "User";
  };
  
  const handleBellClick = () => {
    showActionToast("No new notifications");
  };
  
  const handleLogout = async () => {
    await signOut();
    showActionToast("You've been logged out successfully");
  };

  // If no title is provided, create a personalized greeting
  const displayTitle = title || `Hi, ${getUserDisplayName()}`;

  return (
    <header className={cn("pt-6 pb-4 animate-fade-in", className)}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold">{displayTitle}</h1>
          {subtitle && <p className="text-sm text-fitness-gray mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {action || (
            <button 
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
              onClick={handleBellClick}
            >
              <Bell size={20} className="text-fitness-dark" />
            </button>
          )}
          <button 
            className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-full shadow-sm"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

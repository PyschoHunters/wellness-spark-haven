
import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showActionToast } from '@/utils/toast-utils';

interface HeaderProps {
  title: string;
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
  const handleBellClick = () => {
    showActionToast("No new notifications");
  };

  return (
    <header className={cn("pt-6 pb-4 animate-fade-in", className)}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-fitness-gray mt-1">{subtitle}</p>}
        </div>
        {action || (
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBellClick}
          >
            <Bell size={20} className="text-fitness-dark" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

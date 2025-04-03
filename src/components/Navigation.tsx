
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Calendar, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/activity', icon: BarChart2, label: 'Activity' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/buddy-finder', icon: Users, label: 'Buddies' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-300 relative cursor-pointer",
                isActive ? "text-fitness-primary" : "text-fitness-gray"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon 
                size={22} 
                className={cn(
                  "transition-all duration-300",
                  isActive && "animate-pulse-light"
                )} 
              />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-fitness-primary" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

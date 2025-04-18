
import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BuddyFinderButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/buddy-finder');
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
    >
      <Users size={20} />
      <span>Find Workout Buddies</span>
    </Button>
  );
};

export default BuddyFinderButton;

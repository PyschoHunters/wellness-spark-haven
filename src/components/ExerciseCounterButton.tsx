
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ExerciseCounterButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/exercise-counter')}
      className="w-full flex items-center justify-center gap-3 bg-fitness-primary hover:bg-fitness-primary/90 text-white py-4 rounded-xl shadow-lg transition-all duration-300 animate-fade-up text-base"
    >
      <div className="bg-white/20 p-1.5 rounded-full">
        <Activity className="w-5 h-5" />
      </div>
      <span className="font-medium">AI Exercise Counter</span>
    </Button>
  );
};

export default ExerciseCounterButton;


import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FormAnalysisButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/form-analysis')}
      className="w-full flex items-center justify-center gap-3 bg-fitness-primary hover:bg-fitness-primary/90 text-white py-4 rounded-xl shadow-lg transition-all duration-300 animate-fade-up text-base"
    >
      <div className="bg-white/20 p-1.5 rounded-full">
        <Camera className="w-5 h-5" />
      </div>
      <span className="font-medium">AI Workout Form Analyzer</span>
    </Button>
  );
};

export default FormAnalysisButton;


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
      <Camera className="w-6 h-6" />
      AI Workout Form Analyzer
    </Button>
  );
};

export default FormAnalysisButton;

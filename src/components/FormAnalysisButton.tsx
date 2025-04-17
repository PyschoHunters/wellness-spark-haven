
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FormAnalysisButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/form-analysis')}
      className="w-full flex items-center justify-center gap-2 bg-fitness-primary hover:bg-fitness-primary/90 text-white py-3 rounded-xl shadow-lg transition-all duration-300 animate-fade-up"
    >
      <Camera className="w-5 h-5" />
      AI Workout Form Analyzer
    </Button>
  );
};

export default FormAnalysisButton;

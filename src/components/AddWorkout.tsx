
import React, { useState } from 'react';
import { X, Plus, Trash, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';

interface ExerciseFormData {
  id: string;
  name: string;
  duration: string;
  sets?: number;
  reps?: number;
}

interface WorkoutFormData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  calories: number;
  exercises: ExerciseFormData[];
}

interface AddWorkoutProps {
  onClose: () => void;
  onSave: (workout: WorkoutFormData) => void;
}

const AddWorkout: React.FC<AddWorkoutProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    title: '',
    description: '',
    difficulty: 'medium',
    duration: '30 min',
    calories: 150,
    exercises: [{ id: Date.now().toString(), name: '', duration: '45 sec', sets: 3, reps: 10 }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (id: string, field: keyof ExerciseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const addExercise = () => {
    const newExercise = { 
      id: Date.now().toString(), 
      name: '', 
      duration: '45 sec',
      sets: 3,
      reps: 10
    };
    
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const removeExercise = (id: string) => {
    if (formData.exercises.length <= 1) {
      showActionToast("Workout must have at least one exercise");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
  };
  
  const moveExercise = (id: string, direction: 'up' | 'down') => {
    const currentIndex = formData.exercises.findIndex(ex => ex.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === formData.exercises.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newExercises = [...formData.exercises];
    [newExercises[currentIndex], newExercises[newIndex]] = [newExercises[newIndex], newExercises[currentIndex]];
    
    setFormData(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title) {
      showActionToast("Please enter a workout title");
      return;
    }
    
    if (formData.exercises.some(ex => !ex.name)) {
      showActionToast("All exercises must have a name");
      return;
    }
    
    // Calculate total duration based on exercises
    const totalDurationInSeconds = formData.exercises.reduce((total, ex) => {
      const durationParts = ex.duration.split(' ');
      const value = parseInt(durationParts[0]);
      const unit = durationParts[1];
      
      if (unit.includes('min')) {
        return total + (value * 60);
      } else {
        return total + value;
      }
    }, 0);
    
    // Round to nearest minute for display
    const totalMinutes = Math.max(1, Math.round(totalDurationInSeconds / 60));
    
    // Update form data with calculated duration
    const updatedFormData = {
      ...formData,
      duration: `${totalMinutes} min`,
      calories: Math.round(totalMinutes * 5) // Simple calories estimation
    };
    
    onSave(updatedFormData);
    showActionToast("Workout saved successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Create Workout</h2>
          <button 
            className="w-8 h-8 bg-fitness-gray-light rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-fitness-gray mb-1">
                Workout Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitness-primary"
                placeholder="e.g., Full Body HIIT"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-fitness-gray mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitness-primary h-24"
                placeholder="Brief description of this workout"
              />
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-fitness-gray mb-1">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitness-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-fitness-gray mb-3">Exercises</h3>
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="bg-fitness-gray-light p-3 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Exercise {index + 1}</h4>
                      <div className="flex items-center gap-1">
                        <button 
                          type="button" 
                          onClick={() => moveExercise(exercise.id, 'up')}
                          className="p-1 text-fitness-gray hover:text-fitness-primary"
                          disabled={index === 0}
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveExercise(exercise.id, 'down')}
                          className="p-1 text-fitness-gray hover:text-fitness-primary"
                          disabled={index === formData.exercises.length - 1}
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeExercise(exercise.id)}
                          className="p-1 text-fitness-gray hover:text-fitness-secondary"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs text-fitness-gray mb-1">
                          Exercise Name
                        </label>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fitness-primary text-sm"
                          placeholder="e.g., Push-ups, Squats, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-fitness-gray mb-1">
                            Duration
                          </label>
                          <select
                            value={exercise.duration}
                            onChange={(e) => handleExerciseChange(exercise.id, 'duration', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fitness-primary text-sm"
                          >
                            <option value="15 sec">15 sec</option>
                            <option value="30 sec">30 sec</option>
                            <option value="45 sec">45 sec</option>
                            <option value="60 sec">60 sec</option>
                            <option value="90 sec">90 sec</option>
                            <option value="2 min">2 min</option>
                            <option value="3 min">3 min</option>
                            <option value="5 min">5 min</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-fitness-gray mb-1">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(exercise.id, 'sets', parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fitness-primary text-sm"
                            min="1"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-fitness-gray mb-1">
                            Reps
                          </label>
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(exercise.id, 'reps', parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fitness-primary text-sm"
                            min="1"
                            max="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addExercise}
                  className="w-full py-2 border border-dashed border-fitness-primary text-fitness-primary rounded-xl flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  <span>Add Exercise</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 pt-4 mt-4 border-t border-gray-100">
            <button 
              type="submit"
              className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              <span>Save Workout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkout;

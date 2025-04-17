
import React from 'react';
import { Layout } from '@/components/Layout';
import FormAnalyzer from '@/components/FormAnalyzer';
import { Dumbbell, Camera, Award, PieChart } from 'lucide-react';

const FormAnalysisPage = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Form Analysis</h1>
          <p className="text-gray-600">
            Perfect your workout technique with AI-powered form analysis and personalized feedback.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <FormAnalyzer />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                    <Camera size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Take a Photo</p>
                    <p className="text-sm text-gray-600">Upload a photo of yourself performing an exercise</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0">
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI Analysis</p>
                    <p className="text-sm text-gray-600">Our AI analyzes your form and posture</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Get Feedback</p>
                    <p className="text-sm text-gray-600">Receive personalized tips to improve your form</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0">
                    <PieChart size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Track Progress</p>
                    <p className="text-sm text-gray-600">Monitor your improvement over time</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-fitness-primary/10 rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-2">Why Form Matters</h3>
              <p className="text-sm text-gray-700 mb-3">
                Proper exercise form is crucial for:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-fitness-primary">•</span>
                  <span>Preventing injuries and strain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fitness-primary">•</span>
                  <span>Maximizing muscle engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fitness-primary">•</span>
                  <span>Improving overall workout efficiency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fitness-primary">•</span>
                  <span>Achieving better results faster</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormAnalysisPage;


import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import Activity from './pages/Activity';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import FitnessChallenges from './pages/FitnessChallenges';
import BuddyFinder from './pages/BuddyFinder';
import FitChain from './pages/FitChain';
import MeditationPage from './pages/MeditationPage';
import NariShakti from './pages/NariShakti';
import PregnancyWorkouts from './pages/PregnancyWorkouts';
import ExpertAdvicePage from './pages/ExpertAdvicePage';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
        <SonnerToaster position="top-center" closeButton richColors />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-fitness-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute>{<Index />}</ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute>{<Activity />}</ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute>{<Profile />}</ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute>{<Schedule />}</ProtectedRoute>} />
      <Route path="/challenges" element={<ProtectedRoute>{<FitnessChallenges />}</ProtectedRoute>} />
      <Route path="/buddy-finder" element={<ProtectedRoute>{<BuddyFinder />}</ProtectedRoute>} />
      <Route path="/fitchain" element={<ProtectedRoute>{<FitChain />}</ProtectedRoute>} />
      <Route path="/meditation" element={<ProtectedRoute>{<MeditationPage />}</ProtectedRoute>} />
      <Route path="/nari-shakti" element={<ProtectedRoute>{<NariShakti />}</ProtectedRoute>} />
      <Route path="/pregnancy-workouts" element={<ProtectedRoute>{<PregnancyWorkouts />}</ProtectedRoute>} />
      <Route path="/expert-advice" element={<ProtectedRoute>{<ExpertAdvicePage />}</ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

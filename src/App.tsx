
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Activity from "./pages/Activity";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import BuddyFinder from "./pages/BuddyFinder";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ExpertAdvicePage, { BlogPostDetail } from "./pages/ExpertAdvicePage";
import NariShakti from "./pages/NariShakti";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/buddy-finder" element={<BuddyFinder />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/expert-advice" element={<ExpertAdvicePage />} />
              <Route path="/expert-advice/:id" element={<BlogPostDetail />} />
              <Route path="/nari-shakti" element={<NariShakti />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

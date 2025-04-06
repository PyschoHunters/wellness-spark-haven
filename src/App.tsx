
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Activity from "./pages/Activity";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import BuddyFinder from "./pages/BuddyFinder";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ChatAssistant from "./components/ChatAssistant";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/buddy-finder" element={<BuddyFinder />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

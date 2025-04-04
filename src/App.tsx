
import { useState, useEffect } from "react";
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
import ChatAssistant from "./components/ChatAssistant";

const queryClient = new QueryClient();

const App = () => {
  // Add a state to force rerender
  const [refresh, setRefresh] = useState(0);
  
  // Force a refresh once when the app loads
  useEffect(() => {
    // This will cause the app to rerender once
    setRefresh(prev => prev + 1);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter key={refresh}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/buddy-finder" element={<BuddyFinder />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

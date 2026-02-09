import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import EventsPage from "./pages/EventsPage";
import ClanPage from "./pages/ClanPage";
import PulsePage from "./pages/PulsePage";
import ProfilePage from "./pages/ProfilePageNew";
import WellnessPage from "./pages/WellnessPageNew";
import JournalPage from "./pages/JournalPage";
import GoalsPage from "./pages/GoalsPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNavNew";
import FloatingAIChat from "./components/FloatingAIChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <main className="pb-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/groups" element={<ClanPage />} />
              <Route path="/pulse" element={<PulsePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <BottomNav />
          <FloatingAIChat />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

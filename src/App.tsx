import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrioMatch from "./pages/TrioMatch";
import ClanPage from "./pages/ClanPage";
import PulsePage from "./pages/PulsePage";
import ProfilePage from "./pages/ProfilePage";
import WellnessPage from "./pages/WellnessPage";
import JournalPage from "./pages/JournalPage";
import GoalsPage from "./pages/GoalsPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <BottomNav />
          <main className="flex-1 ml-56">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trio" element={<TrioMatch />} />
              <Route path="/clan" element={<ClanPage />} />
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
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

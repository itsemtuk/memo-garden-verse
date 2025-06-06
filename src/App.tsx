
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SecurityMonitor from "@/components/SecurityMonitor";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import PublicBoard from "./pages/PublicBoard";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/board/:boardId" element={<PublicBoard />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {process.env.NODE_ENV === 'development' && <SecurityMonitor />}
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

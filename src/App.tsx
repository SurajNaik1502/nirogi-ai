
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Consultant from "./pages/Consultant";
import MentalHealth from "./pages/MentalHealth";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Diet from "./pages/Diet";
import Exercise from "./pages/Exercise";
import MedicineTracker from "./pages/MedicineTracker";
import Appointments from "./pages/Appointments";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import HospitalTracker from "./pages/HospitalTracker";
import SkinAnalysis from "./pages/SkinAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/consultant" element={
              <ProtectedRoute>
                <Consultant />
              </ProtectedRoute>
            } />
            <Route path="/mental-health" element={
              <ProtectedRoute>
                <MentalHealth />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/diet" element={
              <ProtectedRoute>
                <Diet />
              </ProtectedRoute>
            } />
            <Route path="/exercise" element={
              <ProtectedRoute>
                <Exercise />
              </ProtectedRoute>
            } />
            <Route path="/skin-analysis" element={
              <ProtectedRoute>
                <SkinAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/medicine-tracker" element={
              <ProtectedRoute>
                <MedicineTracker />
              </ProtectedRoute>
            } />
            <Route path="/report-analyzer" element={
              <ProtectedRoute>
                <ReportAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/hospital-tracker" element={
              <ProtectedRoute>
                <HospitalTracker />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Waitlist from "./pages/Waitlist";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import RegulatoryFeed from "./pages/RegulatoryFeed";
import ContractAuditor from "./pages/ContractAuditor";
import DocumentVault from "./pages/DocumentVault";
import MatterDetail from "./pages/MatterDetail";
import TrialPrep from "./pages/TrialPrep";
import SettingsPage from "./pages/SettingsPage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/waitlist" element={<Waitlist />} />

            {/* Onboarding (protected but no layout) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/regulatory-feed"
              element={
                <ProtectedRoute>
                  <Layout><RegulatoryFeed /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contract-auditor"
              element={
                <ProtectedRoute>
                  <Layout><ContractAuditor /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/document-vault"
              element={
                <ProtectedRoute>
                  <Layout><DocumentVault /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/document-vault/:id"
              element={
                <ProtectedRoute>
                  <Layout><MatterDetail /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trial-prep"
              element={
                <ProtectedRoute>
                  <Layout><TrialPrep /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout><SettingsPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

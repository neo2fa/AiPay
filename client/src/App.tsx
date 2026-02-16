import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Dashboard from "@/pages/dashboard";
import Invoices from "@/pages/invoices";
import CreateInvoice from "@/pages/create-invoice";
import InvoiceDetails from "@/pages/invoice-details";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // In a real app with wouter, you might use useLocation to redirect
    // Since we are inside the render, we can return a Redirect component
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Or a splash screen

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Landing />}
      </Route>

      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/invoices">
        <ProtectedRoute component={Invoices} />
      </Route>

      <Route path="/invoices/:id">
        <ProtectedRoute component={InvoiceDetails} />
      </Route>

      <Route path="/create-invoice">
        <ProtectedRoute component={CreateInvoice} />
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

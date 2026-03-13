import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import UserLogin from "@/pages/user/Login";
import UserDashboard from "@/pages/user/Dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* User Routes */}
      <Route path="/dashboard" component={UserLogin} />
      <Route path="/dashboard/home" component={UserDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

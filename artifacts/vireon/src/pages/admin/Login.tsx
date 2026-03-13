import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-auth";
import { useAdminLogin } from "@workspace/api-client-react";
import { CyberButton, CyberCard, CyberInput } from "@/components/ui/cyber-ui";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const { login } = useAdminAuth();
  const { toast } = useToast();
  
  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          login(data.token);
          toast({
            title: "ACCESS GRANTED",
            description: "Welcome to the mainframe.",
            variant: "default"
          });
        }
      },
      onError: (error) => {
        toast({
          title: "ACCESS DENIED",
          description: error.error || "Invalid master code.",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    loginMutation.mutate({ data: { code } });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 scanlines relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <CyberCard className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Terminal className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-display font-bold tracking-widest text-white">ADMIN_OVERRIDE</h1>
          <p className="text-xs text-muted-foreground mt-2 font-mono uppercase">Enter master protocol code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <CyberInput
              type="password"
              placeholder="> _"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-xl tracking-[0.5em] uppercase font-bold"
              autoFocus
            />
          </div>
          
          <CyberButton 
            type="submit" 
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "AUTHENTICATING..." : "BYPASS_SECURITY"}
          </CyberButton>
        </form>
      </CyberCard>
    </div>
  );
}

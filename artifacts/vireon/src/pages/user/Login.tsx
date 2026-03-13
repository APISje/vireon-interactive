import { useState } from "react";
import { useUserAuth } from "@/hooks/use-auth";
import { useUserLogin } from "@workspace/api-client-react";
import { CyberButton, CyberCard, CyberInput } from "@/components/ui/cyber-ui";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserLogin() {
  const [key, setKeyInput] = useState("");
  const { login } = useUserAuth();
  const { toast } = useToast();
  
  const loginMutation = useUserLogin({
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          login(data.key);
          toast({
            title: "LICENSE VERIFIED",
            description: `Welcome back, ${data.username}`,
            variant: "default"
          });
        }
      },
      onError: (error) => {
        toast({
          title: "ACCESS DENIED",
          description: error.error || "Invalid or expired license key.",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    // Real implementation would grab actual HWID if possible via launcher headers
    loginMutation.mutate({ data: { key } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 scanlines relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-background to-background pointer-events-none"></div>
      
      <div className="mb-8 text-center z-10">
        <h1 className="text-4xl font-display font-black tracking-widest text-white mb-2 neon-text">VIREON <span className="text-primary">PREMIUM</span></h1>
      </div>

      <CyberCard className="w-full max-w-md z-10 border-secondary/30">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-secondary mx-auto mb-4 animate-pulse-glow rounded-full p-2 border border-secondary/50" />
          <h2 className="text-lg font-bold text-white uppercase">AUTHENTICATE LICENSE</h2>
          <p className="text-xs text-muted-foreground mt-2 border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 p-2 rounded">
            HWID Lock is active. Ensure you use this key on your primary device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <CyberInput
              placeholder="VIREON-XXXX-PREMIUM"
              value={key}
              onChange={(e) => setKeyInput(e.target.value)}
              className="text-center font-bold tracking-widest uppercase border-secondary/50 focus:ring-secondary focus:border-secondary focus:bg-secondary/5 text-secondary"
            />
          </div>
          
          <CyberButton 
            type="submit" 
            className="w-full !border-secondary !text-secondary before:!bg-secondary hover:!text-white hover:!shadow-[0_0_20px_rgba(0,87,255,0.6)]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "VERIFYING..." : "ACCESS_DASHBOARD"}
          </CyberButton>
        </form>
      </CyberCard>
    </div>
  );
}

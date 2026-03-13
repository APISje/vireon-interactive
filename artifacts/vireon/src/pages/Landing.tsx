import { Navbar } from "@/components/layout/Navbar";
import { CyberButton, CyberCard } from "@/components/ui/cyber-ui";
import { motion } from "framer-motion";
import { Shield, Key, Zap, Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const openWhatsApp = () => {
    window.open("https://wa.me/6281330032894?text=Halo%20saya%20ingin%20membeli%20Premium%20Vireon%20Interactive", "_blank");
  };

  return (
    <div className="min-h-screen bg-background scanlines">
      <Navbar />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
              alt="Cyberpunk grid" 
              className="w-full h-full object-cover opacity-30 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-glitch.png`} 
                alt="Vireon Logo" 
                className="w-32 h-32 animate-pulse-glow rounded-full border border-primary/50"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter"
            >
              <span className="text-primary hover:animate-glitch inline-block">VIREON</span> INTERACTIVE
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-mono"
            >
              Enterprise-grade script protection & licensing system for Roblox developers. Prevent theft, lock HWIDs, and secure your code.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <CyberButton onClick={openWhatsApp} className="text-lg px-10 py-4">
                INITIATE_PREMIUM_ACCESS
              </CyberButton>
              <button
                onClick={() => setLocation("/admin")}
                className="text-sm font-bold px-8 py-4 border border-primary/40 text-primary bg-transparent hover:bg-primary/10 hover:border-primary transition-all tracking-widest font-mono shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]"
              >
                LOGIN_DEVELOPMENT
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card/30 border-y border-primary/20 relative z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-white mb-4">SYSTEM_CAPABILITIES</h2>
              <div className="w-24 h-1 bg-primary mx-auto shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Lock, title: "HWID LOCKING", desc: "Cryptographic hardware ID binding prevents key sharing across different machines." },
                { icon: Key, title: "DYNAMIC KEYS", desc: "Time-based licensing system with automated expiry and instant revocation capabilities." },
                { icon: Shield, title: "ANTI-TAMPER", desc: "Browser detection and advanced obfuscation prevents raw source code extraction." },
                { icon: Zap, title: "LOW LATENCY", desc: "Edge-deployed validation checks ensure zero performance impact during execution." }
              ].map((feature, i) => (
                <CyberCard 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:-translate-y-2 transition-transform"
                >
                  <feature.icon className="w-12 h-12 text-primary mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CyberCard>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

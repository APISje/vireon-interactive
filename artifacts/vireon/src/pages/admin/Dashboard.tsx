import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Users, Key, TerminalSquare, Code, LogOut, Terminal } from "lucide-react";
import AdminUsers from "./tabs/Users";
import AdminKeys from "./tabs/Keys";
import AdminScripts from "./tabs/Scripts";
import AdminDevScripts from "./tabs/DevScripts";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("users");

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const tabs = [
    { id: "users", label: "USERS", icon: Users },
    { id: "keys", label: "KEYS", icon: Key },
    { id: "scripts", label: "PROTECTED_SCRIPTS", icon: TerminalSquare },
    { id: "dev", label: "CORE_MODULES", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row scanlines">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-primary/20 bg-card/50 flex flex-col z-10 backdrop-blur-md">
        <div className="h-16 flex items-center px-6 border-b border-primary/20">
          <Terminal className="w-5 h-5 text-primary mr-3" />
          <span className="font-display font-bold tracking-widest text-primary">ADMIN_SYS</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-sm transition-all ${
                activeTab === tab.id 
                  ? "bg-primary/20 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_rgba(0,240,255,0.1)]" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-3" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 rounded transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 relative z-0 h-screen overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto">
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "keys" && <AdminKeys />}
          {activeTab === "scripts" && <AdminScripts />}
          {activeTab === "dev" && <AdminDevScripts />}
        </div>
      </main>
    </div>
  );
}

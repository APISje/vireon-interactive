import { Link } from "wouter";
import { Terminal } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full border-b border-primary/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/50 group-hover:bg-primary/20 transition-all">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-primary transition-colors">
            VIREON<span className="text-primary">_OS</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider">
            USER LOGIN
          </Link>
          <Link
            href="/admin"
            className="text-sm font-bold px-4 py-2 border border-primary/60 text-primary bg-primary/10 hover:bg-primary/20 hover:border-primary transition-all tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          >
            LOGIN DEVELOPMENT
          </Link>
        </div>
      </div>
    </nav>
  );
}

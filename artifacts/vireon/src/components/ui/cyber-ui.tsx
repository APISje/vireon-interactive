import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export const CyberButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'destructive' | 'outline' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative px-6 py-2.5 font-display font-bold uppercase tracking-widest overflow-hidden transition-all duration-300",
          "before:absolute before:inset-0 before:-z-10 before:transition-all before:duration-300",
          "hover:before:opacity-100 before:opacity-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variant === 'primary' && "text-primary border border-primary bg-primary/10 hover:text-black hover:bg-primary shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] before:bg-primary",
          variant === 'destructive' && "text-destructive border border-destructive bg-destructive/10 hover:text-white hover:bg-destructive shadow-[0_0_15px_rgba(255,0,60,0.2)] hover:shadow-[0_0_25px_rgba(255,0,60,0.6)] before:bg-destructive",
          variant === 'outline' && "text-muted-foreground border border-border hover:text-white hover:border-primary hover:bg-primary/5",
          className
        )}
        {...props}
      />
    );
  }
);
CyberButton.displayName = "CyberButton";

export const CyberCard = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        "bg-card/80 backdrop-blur-md border border-primary/30 rounded-sm p-6",
        "shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden",
        "before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
CyberCard.displayName = "CyberCard";

export const CyberInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full bg-input/50 border border-primary/30 px-4 py-2 text-sm text-primary",
        "placeholder:text-muted-foreground/50 transition-all duration-300",
        "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-primary/5",
        "disabled:cursor-not-allowed disabled:opacity-50 rounded-none",
        className
      )}
      {...props}
    />
  )
);
CyberInput.displayName = "CyberInput";

export const CyberTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full bg-input/50 border border-primary/30 px-4 py-3 text-sm text-primary font-mono",
        "placeholder:text-muted-foreground/50 transition-all duration-300",
        "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-primary/5",
        "disabled:cursor-not-allowed disabled:opacity-50 rounded-none resize-y",
        className
      )}
      {...props}
    />
  )
);
CyberTextarea.displayName = "CyberTextarea";

export const CyberBadge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'destructive' | 'warning', className?: string }) => {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border",
      variant === 'default' && "bg-primary/10 text-primary border-primary/30",
      variant === 'success' && "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
      variant === 'destructive' && "bg-destructive/10 text-destructive border-destructive/30 shadow-[0_0_10px_rgba(255,0,60,0.2)]",
      variant === 'warning' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
      className
    )}>
      {children}
    </span>
  );
};

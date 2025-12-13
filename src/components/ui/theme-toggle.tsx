"use client";

import * as React from "react";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Force dark mode whenever this toggle is mounted (light mode is intentionally disabled).
    setTheme("dark");
  }, [setTheme]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
        <div className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-200",
          "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
        )}
        title="Dark"
        aria-label="Dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}








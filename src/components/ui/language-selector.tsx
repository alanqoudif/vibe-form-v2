"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "EN", fullLabel: "English", flag: "🇺🇸" },
  { code: "ar", label: "AR", fullLabel: "العربية", flag: "🇸🇦" },
] as const;

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'ar' });
    setIsOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all duration-200"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 min-w-[140px] py-2 rounded-xl bg-[rgba(20,20,25,0.95)] border border-white/10 backdrop-blur-xl shadow-2xl z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "w-full px-4 py-2 flex items-center gap-3 text-left rtl:text-right transition-colors duration-150",
                locale === lang.code
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.fullLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}









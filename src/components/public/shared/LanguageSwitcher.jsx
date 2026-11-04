"use client";

import React, { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "bn", name: "বাংলা", short: "বাং" },
    { code: "en", name: "English", short: "EN" },
    { code: "ar", name: "العربية", short: "عربي" },
  ];

  const activeLang =
    languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-300 focus:outline-none cursor-pointer shadow-sm ${
          isOpen
            ? "border-amber-400/50 bg-amber-400/15 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            : "border-white/15 bg-white/[0.06] text-slate-100 hover:bg-white/[0.12] hover:border-amber-400/35 hover:text-white"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-amber-300" />
        <span className="text-[11px] sm:text-xs font-semibold tracking-wide flex items-center gap-1">
          <span className="hidden sm:inline">{activeLang.name}</span>
          <span className="inline sm:hidden">{activeLang.short}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-amber-200/80 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-amber-300" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute ltr:right-0 rtl:left-0 mt-2 w-40 origin-top-right rounded-2xl border border-emerald-500/25 dark:border-amber-400/25 bg-[#032216]/95 dark:bg-[#02120b]/95 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl focus:outline-none z-[100] overflow-hidden"
          role="menu"
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <div className="p-1.5 space-y-0.5">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500/25 to-amber-500/15 text-amber-300 font-bold border border-amber-400/25"
                      : "text-slate-200 hover:bg-white/[0.08] hover:text-amber-200"
                  }`}
                  role="menuitem"
                >
                  <span>{lang.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

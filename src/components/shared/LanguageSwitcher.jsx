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
        className={`flex items-center px-2.5 py-1.5 rounded-xl border transition-all duration-300 focus:outline-none cursor-pointer shadow-sm ${
          isOpen
            ? "border-amber-400/50 bg-amber-400/15 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            : "border-white/15 bg-white/[0.06] text-slate-100 hover:bg-white/[0.12] hover:border-amber-400/35 hover:text-white"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-black" />

        <ChevronDown
          className={`className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#008744] transition-colors ${
            isOpen ? "rotate-180 text-amber-300" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute ltr:right-0 rtl:left-0 mt-2 w-40 origin-top-right rounded-lg bg-white text-slate-800 shadow-xl border border-gray-100 focus:outline-none z-[100] overflow-hidden"
          role="menu"
        >
          <div className="p-1.5 space-y-0.5">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#e6f4ea] text-[#008744] font-semibold"
                      : "text-slate-700 hover:bg-[#e6f4ea] hover:text-[#008744]"
                  }`}
                  role="menuitem"
                >
                  <span>{lang.name}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#008744]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "bn", name: "বাংলা", flag: "🇧🇩" },
        { code: "ar", name: "العربية", flag: "🇸🇦" }
    ];

    const activeLang = languages.find((lang) => lang.code === language) || languages[1];

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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-400/30 bg-emerald-950/20 text-emerald-50 hover:bg-emerald-800/40 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-sm cursor-pointer"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide flex items-center gap-1">
                    <span>{activeLang.flag}</span>
                    <span className="hidden sm:inline">{activeLang.name}</span>
                    <span className="inline sm:hidden uppercase">{activeLang.code}</span>
                </span>
                <ChevronDown className={`w-3 h-3 text-amber-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl border border-emerald-800/50 bg-emerald-950/95 text-white shadow-2xl backdrop-blur-lg focus:outline-none z-[100] dark:bg-slate-900/95 dark:border-slate-800/50"
                    style={{ animation: "fadeIn 0.2s ease-out" }}
                    role="menu"
                >
                    <style jsx>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-4px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                    <div className="py-1 px-1 space-y-0.5">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-amber-400/15 hover:text-amber-300 cursor-pointer ${
                                    language === lang.code 
                                        ? "bg-amber-500/20 text-amber-300 font-bold" 
                                        : "text-slate-100"
                                }`}
                                role="menuitem"
                            >
                                <span className="flex items-center gap-2">
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </span>
                                {language === lang.code && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

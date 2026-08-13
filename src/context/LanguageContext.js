"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import bn from '../locales/bn.json';
import ar from '../locales/ar.json';

const translations = { en, bn, ar };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState('bn'); // default to Bangla

    // Load language preference on mount
    useEffect(() => {
        const storedLang = localStorage.getItem('lang');
        if (storedLang && ['en', 'bn', 'ar'].includes(storedLang)) {
            setLanguageState(storedLang);
        } else {
            // Optional: detect browser language
            if (typeof navigator !== 'undefined') {
                const browserLang = navigator.language.split('-')[0];
                if (['en', 'bn', 'ar'].includes(browserLang)) {
                    setLanguageState(browserLang);
                }
            }
        }
    }, []);

    const setLanguage = (lang) => {
        if (['en', 'bn', 'ar'].includes(lang)) {
            setLanguageState(lang);
            localStorage.setItem('lang', lang);
        }
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // Apply RTL and fonts dynamically to the document
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('dir', dir);
        root.setAttribute('lang', language);

        // Apply premium font-family override based on language
        const body = document.body;
        if (body) {
            if (language === 'ar') {
                body.style.fontFamily = 'var(--font-reem-kufi), serif';
            } else if (language === 'bn') {
                body.style.fontFamily = 'var(--font-hind-siliguri), sans-serif';
            } else {
                body.style.fontFamily = 'var(--font-geist-sans), sans-serif';
            }
        }
    }, [language, dir]);

    // t function supporting nested dot-notation (e.g. "menu.home")
    const t = (key) => {
        if (!key) return '';
        const keys = key.split('.');
        let val = translations[language];
        
        for (const k of keys) {
            if (val && typeof val === 'object' && k in val) {
                val = val[k];
            } else {
                // Fallback to English translation if key is missing in active language
                let fallbackVal = translations['en'];
                for (const fallbackKey of keys) {
                    if (fallbackVal && typeof fallbackVal === 'object' && fallbackKey in fallbackVal) {
                        fallbackVal = fallbackVal[fallbackKey];
                    } else {
                        fallbackVal = null;
                        break;
                    }
                }
                return fallbackVal || key;
            }
        }
        return val || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

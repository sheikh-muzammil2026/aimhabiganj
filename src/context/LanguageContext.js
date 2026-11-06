"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import bn from '../locales/bn.json';
import ar from '../locales/ar.json';

const translations = { en, bn, ar };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState('bn'); // default to Bangla

    // Load language preference on mount (default Bengali)
    useEffect(() => {
        const storedLang = localStorage.getItem('lang');
        if (storedLang && ['en', 'bn', 'ar'].includes(storedLang)) {
            setLanguageState(storedLang);
        } else {
            setLanguageState('bn');
        }
    }, []);

    const setLanguage = (lang) => {
        if (['en', 'bn', 'ar'].includes(lang)) {
            setLanguageState(lang);
            localStorage.setItem('lang', lang);
        }
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // Apply RTL and language-specific font system dynamically to the document
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('dir', dir);
        root.setAttribute('lang', language);

        // Bangla -> Bornomala, English / UI -> Ubuntu Sans
        const body = document.body;
        if (body) {
            if (language === 'bn') {
                body.style.fontFamily = '"Bornomala", "Ubuntu Sans", sans-serif';
            } else {
                body.style.fontFamily = '"Ubuntu Sans", "Bornomala", sans-serif';
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
                // Fallback to Bengali translation if key is missing in active language
                let fallbackVal = translations['bn'] || translations['en'];
                for (const fallbackKey of keys) {
                    if (fallbackVal && typeof fallbackVal === 'object' && fallbackKey in fallbackVal) {
                        fallbackVal = fallbackVal[fallbackKey];
                    } else {
                        fallbackVal = (translations['en'] && typeof translations['en'] === 'object') ? translations['en'][fallbackKey] : null;
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

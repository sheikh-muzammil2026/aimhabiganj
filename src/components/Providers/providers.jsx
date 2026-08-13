"use client";

import React from 'react';
import { ToastContainer } from 'react-toastify';
import { LanguageProvider } from '@/context/LanguageContext';

const Providers = ({ children }) => {
    return (
        <LanguageProvider>
            <div>
                {children}
                <ToastContainer />
            </div>
        </LanguageProvider>
    );
};

export default Providers;
import React from 'react';
import { ToastContainer } from 'react-toastify';

const Providers = ({ children }) => {
    return (
        <div>
            {children}
            <ToastContainer />
        </div>
    );
};

export default Providers;
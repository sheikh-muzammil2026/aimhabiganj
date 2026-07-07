import Footer from '@/components/public/shared/footer';
import Navbar from '@/components/public/shared/navbar/navbar';
import TopHeader from '@/components/public/shared/topHeader';
import React from 'react';

const layout = ({ children }) => {
  return (
    <div>
      <TopHeader />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
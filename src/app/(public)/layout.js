import Footer from '@/components/public/shared/footer';
import Navbar from '@/components/public/shared/navbar/navbar';
import TopHeader from '@/components/public/shared/topHeader';
import React from 'react';
// import Header from '../../components/public/shared/header';

const layout = ({ children }) => {
  return (
    <div>
      {/* <Header /> */}
      <TopHeader />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;

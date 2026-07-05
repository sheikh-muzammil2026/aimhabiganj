import HomePage from '@/components/public/home/homePage';
import Navbar from '@/components/public/home/navbar/navbar';
import React from 'react';

const page = () => {
  return (
    <div>
      <Navbar />
      <HomePage />
    </div>
  );
};

export default page;
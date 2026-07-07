import FeaturedSections from '@/components/public/home/featuredSection';
import HeroSection from '@/components/public/home/hero';
import ReviewSection from '@/components/public/home/reviews';
import StatsSection from '@/components/public/home/statsSection';
import WhyChooseUs from '@/components/public/home/whyChooseUs';
import React from 'react';

const page = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <FeaturedSections />
      <StatsSection />
      <ReviewSection />
    </div>
  );
};

export default page;
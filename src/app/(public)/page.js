import FeaturedSections from '@/components/public/home/featuredSection';
import HeroSection from '@/components/public/home/hero';
import ReviewSection from '@/components/public/home/reviews';
import StatsSection from '@/components/public/home/statsSection';
import WhyChooseUs from '@/components/public/home/whyChooseUs';
import Navbar from '@/components/public/shared/navbar/navbar';
import WhatsAppButton from "@/components/WhatsAppButton";
import React from 'react';

const page = () => {
  return (
    <div>

      <HeroSection />
      <Navbar />
      <WhyChooseUs />
      <FeaturedSections />
      <StatsSection />
      <ReviewSection />
      <WhatsAppButton />
    </div>
  );
};

export default page;

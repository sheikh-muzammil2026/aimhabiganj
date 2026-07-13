import FeaturedSections from '@/components/public/home/featuredSection';
import HeroSection from '@/components/public/home/hero';
import ReviewSection from '@/components/public/home/reviews';
import StatsSection from '@/components/public/home/statsSection';
import WhyChooseUs from '@/components/public/home/whyChooseUs';
import WhatsAppButton from "@/components/dashboard/admission/WhatsAppButton";
import React from 'react';

const page = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <FeaturedSections />
      <StatsSection />
      <ReviewSection />
      <WhatsAppButton />
    </div>
  );
};

export default page;

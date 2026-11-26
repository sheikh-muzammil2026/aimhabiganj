import FeaturedSections from "@/components/public/home/featuredSection";
import HeroSection from "@/components/public/home/hero";

import WhyChooseUs from "@/components/public/home/whyChooseUs";
import GallerySection from "@/components/public/home/GallerySection";
import HomeCtaBanner from "@/components/public/home/ctaBanner";
import React from "react";
import Faculty from "@/components/public/home/Faculty";

const page = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <FeaturedSections />

      <Faculty />


      <GallerySection />
      <HomeCtaBanner />
    </div>
  );
};

export default page;

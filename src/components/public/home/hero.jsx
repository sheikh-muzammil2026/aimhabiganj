"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: "/deenishikka.png",
      title: t("hero.slides.0.title"),
      subtitle: t("hero.slides.0.subtitle"),
    },
    {
      url: "/hero2.png",
      title: t("hero.slides.1.title"),
      subtitle: t("hero.slides.1.subtitle"),
    },
    {
      url: "/hero3.png",
      title: t("hero.slides.2.title"),
      subtitle: t("hero.slides.2.subtitle"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="relative w-full select-none">
      {/* ব্যানার ক্যারোসল (Hero Banner Carousel) */}
      <div className="relative h-[450px] md:h-[700px] w-full overflow-hidden bg-slate-900">
        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 invisible"
            }`}
          >
            {/* ব্যাকগ্রাউন্ড ওভারলে: ইমেজের অতিরিক্ত হলুদ উজ্জ্বলতা কমিয়ে টেক্সট ও নেভবার ফুটিয়ে তোলার জন্য ডুয়াল গ্রেডিয়েন্ট */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/65 z-10" />

            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[5000ms]"
            />

            {/* স্লাইড টেক্সট */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 z-20 max-w-3xl text-white pt-6">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-white drop-shadow-md transition-colors duration-300">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-slate-200/95 mb-8 font-light">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admission"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  {t("hero.btn_form")}
                </Link>
                <Link
                  href="/about"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-6 py-3 rounded-xl transition-all text-sm md:text-base"
                >
                  {t("hero.btn_about")}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* স্লাইডার ডট ইন্ডিকেটর */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-amber-400 w-6"
                  : "bg-white/40 w-2.5 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

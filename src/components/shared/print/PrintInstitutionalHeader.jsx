import React from "react";
import Image from "next/image";

export default function PrintInstitutionalHeader({
  logoSrc = "/aimlogo1.png",
  bannerSrc = "/banner.png",
  logoWrapperClassName = "w-22 h-22 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center",
  logoWidth = 120,
  logoHeight = 120,
  logoClassName = "w-full h-full object-cover scale-[1.05] transform-gpu",
  bannerWidth = 1200,
  bannerHeight = 240,
  bannerClassName = "w-full h-auto max-h-24 object-contain mx-auto",
  containerClassName = "flex justify-between items-center relative gap-2 flex-shrink-0 w-full overflow-hidden",
  children,
}) {
  return (
    <div className={containerClassName}>
      {/* মাদ্রাসার লোগো */}
      <div className={logoWrapperClassName}>
        <Image
          src={logoSrc}
          alt="Institution Logo"
          width={logoWidth}
          height={logoHeight}
          quality={100}
          priority
          className={logoClassName}
        />
      </div>

      {/* লোগো ও ছবির মাঝখানে ব্যানার */}
      <div className="flex-1 text-center min-w-0">
        <div className="w-full text-center">
          <Image
            src={bannerSrc}
            alt="Institution Banner"
            width={bannerWidth}
            height={bannerHeight}
            quality={100}
            priority
            className={bannerClassName}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

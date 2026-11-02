import React from "react";

// অটো-ফিট নাম এবং তথ্যের জন্য SVG টেক্সট কম্পোনেন্ট (ফুল উইডথ নিবে ও অটো ছোট/বড় হবে)
export default function AutoScaledText({
  text,
  className = "",
  fontWeight = "bold",
  fill = "#000",
  fontFamily,
}) {
  return (
    <div
      className={`w-full h-4 flex items-center overflow-hidden ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
      >
        <text
          x="0"
          y="18"
          fontSize="18"
          fontWeight={fontWeight}
          fill={fill}
          fontFamily={fontFamily}
          textLength="300"
          lengthAdjust="spacingAndGlyphs"
        >
          {text || "N/A"}
        </text>
      </svg>
    </div>
  );
}

import React from "react";
import Image from "next/image";

export default function PrintSignatures({
  variant = "compact",
  controllerSignatureSrc = "/anarul.png",
  principalSignatureSrc = "/principle's_signature.jpg",
  controllerLabel = "পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর",
  principalLabel = "প্রিন্সিপালের স্বাক্ষর",
  principalTopClass = "-top-1",
  className,
}) {
  if (variant === "large") {
    return (
      <div
        className={
          className || "flex justify-between items-end px-4 sm:px-12 mb-6"
        }
      >
        <div className="text-center flex flex-col items-center">
          <div className="relative w-28 sm:w-36 h-10 flex items-end justify-center mb-1">
            <Image
              src={controllerSignatureSrc || "/anarul.png"}
              alt="Exam Controller Signature"
              width={90}
              height={34}
              priority
              className="signature-controller max-h-10 w-auto object-contain mix-blend-multiply contrast-[800%] brightness-[60%] grayscale -rotate-90 mx-auto"
            />
          </div>
          <div className="w-28 sm:w-36 border-b border-slate-800 mb-1"></div>
          <span className="text-[9.5px] sm:text-xs font-bold text-slate-800 block">
            {controllerLabel}
          </span>
        </div>

        <div className="text-center flex flex-col items-center">
          <div className="relative w-28 sm:w-36 h-10 flex items-end justify-center mb-1">
            <Image
              src={principalSignatureSrc || "/principle's_signature.jpg"}
              alt="Principal Signature"
              width={90}
              height={34}
              priority
              className="signature-principal max-h-10 w-auto object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45 mx-auto"
            />
          </div>
          <div className="w-28 sm:w-36 border-b border-slate-800 mb-1"></div>
          <span className="text-[9.5px] sm:text-xs font-bold text-slate-800 block">
            {principalLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        className || "flex justify-between items-end my-1 px-4 flex-shrink-0"
      }
    >
      {/* পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর */}
      <div className="text-center flex flex-col items-center print:mt-auto relative">
        <div className="relative w-28 h-5">
          <Image
            src={controllerSignatureSrc || "/anarul.png"}
            alt="Controller Signature"
            width={100}
            height={40}
            unoptimized
            className="absolute -top-1 right-6 h-6 w-12 object-contain mix-blend-multiply contrast-[800%] brightness-[60%] grayscale -rotate-90"
          />
        </div>
        <div className="w-28 border-b border-gray-800 mb-0.5"></div>
        <span className="text-[9.5px] font-bold text-gray-800">
          {controllerLabel}
        </span>
      </div>

      {/* প্রিন্সিপাল এর স্বাক্ষর */}
      <div className="text-center flex flex-col items-center">
        <div className="relative w-28 h-5 print:mt-auto relative">
          <Image
            src={principalSignatureSrc || "/principle's_signature.jpg"}
            alt="Principal Signature"
            width={100}
            height={40}
            unoptimized
            className={`absolute ${principalTopClass} right-6 h-6 w-12 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45`}
          />
        </div>
        <div className="w-28 border-b border-gray-800 mb-0.5"></div>
        <span className="text-[9.5px] font-bold text-gray-800">
          {principalLabel}
        </span>
      </div>
    </div>
  );
}

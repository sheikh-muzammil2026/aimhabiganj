import React from "react";
import { Globe, Mail, Phone } from "lucide-react";
import { BsWhatsapp, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

export default function PrintSocialFooter({
  className = "pt-1 border-t border-gray-300",
  innerClassName = "flex flex-wrap justify-center items-center gap-x-1 gap-y-0.5 text-[8.5px] font-semibold text-gray-800",
  englishDigits = false,
}) {
  return (
    <div className={className}>
      <div className={innerClassName}>
        <span className="flex items-center gap-0.5">
          <Phone className="w-2.5 h-2.5 text-gray-700" />
          {englishDigits ? "01316-209201" : "০১৩১৬-২০৯২০১"}
        </span>

        <span className="flex items-center gap-0.5">
          <BsWhatsapp className="w-2.5 h-2.5 text-green-600" />
          {englishDigits ? "01748-886161" : "০১৭৪৮-৮৮৬১৬১"}
        </span>

        <span className="flex items-center gap-0.5">
          <Globe className="w-2.5 h-2.5 text-blue-500" />
          www.aimhabiganj.com
        </span>

        <span className="flex items-center gap-0.5">
          <Mail className="w-2.5 h-2.5 text-red-500" />
          aimhabiganj@gmail.com
        </span>

        <span className="flex items-center gap-0.5">
          <FaFacebook className="w-2.5 h-2.5 text-blue-600" />
          aimhabiganj
        </span>

        <span className="flex items-center gap-0.5">
          <BsYoutube className="w-2.5 h-2.5 text-red-600" />
          aimhabiganj
        </span>
      </div>
    </div>
  );
}

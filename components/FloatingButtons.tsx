"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin, ChevronUp, MessageCircle } from "lucide-react";
import { hospitalConfig } from "../lib/hospitalConfig";

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappMessage = `Hi, I'd like to know more about ${hospitalConfig.name}`;
  const whatsappUrl = `${hospitalConfig.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospitalConfig.address)}`;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[44px] h-[44px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={20} />
      </a>

      {/* Call Button */}
      <a
        href={`tel:${hospitalConfig.phone.replace(/[^0-9+]/g, '')}`}
        className="w-[44px] h-[44px] bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
        aria-label="Call us"
      >
        <Phone size={20} />
      </a>

      {/* Google Maps Button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[44px] h-[44px] bg-[#EA4335] text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
        aria-label="Get Directions"
      >
        <MapPin size={20} />
      </a>

      {/* Scroll to Top Button */}
      <div
        className={`transition-all duration-300 transform ${
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToTop}
          className="w-[44px] h-[44px] bg-gray-800 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </div>
  );
}

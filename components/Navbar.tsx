"use client";

import { useState, useEffect } from "react";
import { Menu, X, HeartPulse } from "lucide-react";
import Link from "next/link";
import { hospitalConfig } from "../lib/hospitalConfig";
import { useAppointment } from "../context/AppointmentContext";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Specialities", href: "#specialities" },
  { name: "Services", href: "#services" },
  { name: "Doctors", href: "#doctors" },
  { name: "Facilities", href: "#gallery" },
  { name: "Gallery", href: "#facilities" },
  { name: "About Us", href: "#about" },
  { name: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsAppointmentModalOpen } = useAppointment();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Smooth scroll implementation
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    if (elem) {
      window.scrollTo({
        top: elem.offsetTop - 80, // Adjust for navbar height
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link 
            href="#home" 
            onClick={(e) => handleSmoothScroll(e, "#home")}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <HeartPulse size={28} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold leading-none text-primary tracking-tight">
                {hospitalConfig.name.split(" ")[0]}
              </span>
              <span className="text-xs font-semibold text-secondary tracking-wide uppercase mt-1">
                Super Speciality Hospital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-colors bg-secondary rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Book Appointment
            </button>
            
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 hover:text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] w-full max-w-sm h-full bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-secondary" size={24} />
            <span className="font-bold text-primary">{hospitalConfig.shortName}</span>
          </div>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col py-4 overflow-y-auto h-[calc(100vh-140px)]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="px-6 py-4 text-base font-medium text-gray-800 border-b border-gray-50 hover:bg-accent hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsAppointmentModalOpen(true);
            }}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white transition-colors bg-secondary rounded-xl hover:bg-orange-600"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </header>
  );
}

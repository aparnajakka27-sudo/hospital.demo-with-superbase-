"use client";

import { useState, useEffect } from "react";
import { Menu, X, HeartPulse, Smartphone, Users, Stethoscope, Pill, Star, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { hospitalConfig } from "../lib/hospitalConfig";
import { useAppointment } from "../context/AppointmentContext";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Specialities", href: "#specialities" },
  { name: "Services", href: "#services" },
  { name: "Doctors", href: "#doctors" },
  { name: "Facilities", href: "#gallery" },
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
    
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    if (elem) {
      window.scrollTo({
        top: elem.offsetTop - 120, // Adjusted for taller navbar
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-col gap-4">
          
          {/* Top Row: Logo, Dashboard Pills, Book Button */}
          <div className="flex items-center justify-between">
            {/* Left: Logo Section */}
            <Link 
              href="#home" 
              onClick={(e) => handleSmoothScroll(e, "#home")}
              className="flex items-center gap-3 group shrink-0"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white transition-colors">
                <HeartPulse size={28} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-black font-serif leading-none text-primary tracking-tighter">
                  {hospitalConfig.name.split(" ")[0]}
                </span>
                <span className="text-[10px] font-bold text-secondary tracking-widest uppercase mt-1">
                  SUPER SPECIALITY HOSPITAL
                </span>
              </div>
            </Link>

            {/* Middle: Dashboards */}
            <div className="flex items-center gap-5">
              <Link href="#" className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-semibold shadow-sm hover:bg-primary-hover transition-colors">
                <Smartphone size={14} />
                Patient Booking
              </Link>
              
              <Link href="/reception" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors">
                <Users size={16} className="text-emerald-500" />
                Reception Intake: <span className="bg-emerald-100 text-emerald-700 px-1.5 rounded text-[10px] ml-0.5">7</span>
              </Link>

              <Link href="/doctor-login" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors">
                <Stethoscope size={16} className="text-teal-500" />
                Doctor Desk
              </Link>

              <Link href="/pharmacy" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors">
                <Pill size={16} className="text-amber-500" />
                Pharmacy
              </Link>

              <Link href="/admin" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors">
                <LayoutDashboard size={16} className="text-blue-500" />
                Admin
              </Link>
            </div>

            {/* Right: CTA */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAppointmentModalOpen(true)}
              className="flex items-center justify-center px-6 py-2 text-sm font-bold text-white transition-colors bg-secondary rounded-xl hover:bg-secondary-hover shadow-md shrink-0"
            >
              Book Appointment
            </motion.button>
          </div>

          {/* Bottom Row: Main Navigation Links */}
          <nav className="flex items-center gap-6 xl:gap-8 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="relative text-[13px] font-bold text-gray-600 hover:text-primary transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden items-center justify-between">
          <Link 
            href="#home" 
            onClick={(e) => handleSmoothScroll(e, "#home")}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white transition-colors">
              <HeartPulse size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black font-serif leading-none text-primary tracking-tighter">
                {hospitalConfig.name.split(" ")[0]}
              </span>
              <span className="text-[8px] font-bold text-secondary tracking-widest uppercase mt-0.5">
                SUPER SPECIALITY HOSPITAL
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAppointmentModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white transition-colors bg-secondary rounded-lg"
              >
                Book
              </motion.button>
            <button
              type="button"
              className="p-1 text-gray-600 hover:text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
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
          {/* Dashboard links on mobile */}
          <div className="px-6 py-2 mb-4 border-b pb-4 space-y-3">
             <Link href="#" className="flex items-center gap-3 text-sm font-semibold text-primary">
                <Smartphone size={18} /> Patient Booking
             </Link>
             <Link href="/reception" className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <Users size={18} className="text-emerald-500" /> Reception Intake
             </Link>
             <Link href="/doctor-login" className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <Stethoscope size={18} className="text-teal-500" /> Doctor Desk
             </Link>
             <Link href="/pharmacy" className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <Pill size={18} className="text-amber-500" /> Pharmacy
             </Link>
             <Link href="/admin" className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <LayoutDashboard size={18} className="text-blue-500" /> Admin
             </Link>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-accent hover:text-primary transition-colors"
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
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white transition-colors bg-secondary rounded-xl hover:bg-secondary-hover"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </motion.header>
  );
}

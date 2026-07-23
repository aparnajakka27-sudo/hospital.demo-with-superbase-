"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FloatingButtons from "../components/FloatingButtons";
import AboutSection from '../components/AboutSection';
import SpecialitiesSection from '../components/SpecialitiesSection';
import ServicesSection from '../components/ServicesSection';
import DoctorsSection from '../components/DoctorsSection';
import GallerySection from '../components/GallerySection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import BuildingSection from '../components/BuildingSection';
import ContactInfoStrip from '../components/ContactInfoStrip';
import Footer from '../components/Footer';

import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col bg-white"
    >
      <Navbar />
      
      <div className="flex-1">
        <HeroSection />
        <SpecialitiesSection />
        <ServicesSection />
        <DoctorsSection />
        <GallerySection />
        <WhyChooseUsSection />
        <BuildingSection />
        <AboutSection />
        <ContactInfoStrip />
      </div>

      <Footer />
      
      <FloatingButtons />
    </motion.main>
  );
}

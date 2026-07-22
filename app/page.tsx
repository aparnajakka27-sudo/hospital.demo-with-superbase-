"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FloatingButtons from "../components/FloatingButtons";
import dynamic from 'next/dynamic';

const AboutSection = dynamic(() => import('../components/AboutSection'));
const SpecialitiesSection = dynamic(() => import('../components/SpecialitiesSection'));
const ServicesSection = dynamic(() => import('../components/ServicesSection'));
const DoctorsSection = dynamic(() => import('../components/DoctorsSection'));
const GallerySection = dynamic(() => import('../components/GallerySection'));
const WhyChooseUsSection = dynamic(() => import('../components/WhyChooseUsSection'));
const BuildingSection = dynamic(() => import('../components/BuildingSection'));
const ContactInfoStrip = dynamic(() => import('../components/ContactInfoStrip'));
const Footer = dynamic(() => import('../components/Footer'));

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
        <AboutSection />
        <SpecialitiesSection />
        <ServicesSection />
        <DoctorsSection />
        <GallerySection />
        <WhyChooseUsSection />
        <BuildingSection />
        <ContactInfoStrip />
      </div>

      <Footer />
      
      <FloatingButtons />
    </motion.main>
  );
}

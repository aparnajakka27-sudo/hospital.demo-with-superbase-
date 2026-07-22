"use client";

import { hospitalConfig } from "../lib/hospitalConfig";
import { CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useTransform, animate, Variants } from "framer-motion";

import AnimatedCounter from "./AnimatedCounter";

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 10 } }
};

const statsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { 
    scale: 1.03,
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 }
  }
};

export default function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column - Why Choose Us List */}
          <div className="w-full lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block"
            >
              Our Excellence
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-extrabold text-primary mb-8 leading-tight"
            >
              Why Choose {hospitalConfig.shortName}?
            </motion.h2>
            
            <motion.ul 
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="space-y-6"
            >
              {hospitalConfig.whyChooseUs.map((reason, index) => (
                <motion.li key={index} variants={listItemVariants} className="flex items-start gap-4">
                  <motion.div variants={iconVariants}>
                    <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={24} />
                  </motion.div>
                  <span className="text-lg text-gray-700 font-medium">
                    {reason}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right Column - Stats 2x2 Grid */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              variants={statsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-2 gap-4 md:gap-6"
            >
              {hospitalConfig.stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={statCardVariants}
                  whileHover="hover"
                  className="bg-accent rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-colors"
                >
                  <span className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="text-sm md:text-base font-semibold text-gray-700">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

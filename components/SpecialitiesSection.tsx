"use client";

import { useState, useEffect } from "react";
import { hospitalConfig } from "../lib/hospitalConfig";
import { supabase } from "../lib/supabase";
import { HeartPulse, Brain, Bone, Stethoscope, Activity, Cross, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

// Helper to map string icon names from config to actual Lucide components
const IconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Brain,
  Bone,
  Stethoscope,
  Activity,
  Cross,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
  hover: { 
    scale: 1.03, 
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const iconVariants = {
  hover: { rotate: 5, transition: { duration: 0.2 } }
};

export default function SpecialitiesSection() {
  const [showAll, setShowAll] = useState(false);
  const [fetchedSpecialities, setFetchedSpecialities] = useState<{name: string, icon: string, description: string}[]>(hospitalConfig.specialities);

  useEffect(() => {
    let isMounted = true;
    async function fetchDepartments() {
      try {
        const { data, error } = await supabase.from('Departments').select('Names').order('Names');
        if (!isMounted) return;
        if (error) {
          console.error(error);
        } else if (data) {
          const mapped = data.map(d => {
            const name = d.Names ? d.Names.trim() : "";
            if (!name) return null;
            // Map the Supabase name to local config for icon and description
            const localConfig = hospitalConfig.specialities.find(s => s.name.toLowerCase() === name.toLowerCase());
            return {
              name,
              icon: localConfig?.icon || "Activity",
              description: localConfig?.description || "Specialized care and treatment for this department."
            };
          }).filter(Boolean) as {name: string, icon: string, description: string}[];
          
          setFetchedSpecialities(mapped);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching specialities:", err);
      }
    }
    fetchDepartments();
    return () => { isMounted = false; };
  }, []);

  const displayedSpecialities = showAll 
    ? fetchedSpecialities 
    : fetchedSpecialities.slice(0, 6);

  return (
    <section id="specialities" className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Our Specialities
          </h2>
          {/* Orange Underline Accent */}
          <div className="w-24 h-1.5 bg-secondary rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl text-lg">
            Delivering excellence in healthcare through specialized departments 
            equipped with cutting-edge technology and renowned medical experts.
          </p>
        </motion.div>

        {/* Specialities Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayedSpecialities.map((speciality, index) => {
            const IconComponent = IconMap[speciality.icon] || Activity; // fallback to Activity
            
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group bg-white rounded-xl p-8 text-center border border-gray-100 transition-colors duration-300"
              >
                {/* Icon in Light Blue Circle */}
                <motion.div 
                  variants={iconVariants}
                  className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                >
                  <IconComponent size={36} strokeWidth={2} />
                </motion.div>
                
                {/* Text Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {speciality.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {speciality.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Button */}
        {!showAll && fetchedSpecialities.length > 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16 flex justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAll(true)}
              className="px-8 py-3.5 text-sm font-bold text-white transition-colors bg-primary rounded-xl hover:bg-blue-900 shadow-sm hover:shadow-md"
            >
              View All Specialities
            </motion.button>
          </motion.div>
        )}

      </div>
    </section>
  );
}

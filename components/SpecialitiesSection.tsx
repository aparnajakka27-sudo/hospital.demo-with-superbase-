"use client";

import { useState } from "react";
import { hospitalConfig } from "../lib/hospitalConfig";
import { HeartPulse, Brain, Bone, Stethoscope, Activity, Cross, LucideIcon } from "lucide-react";

// Helper to map string icon names from config to actual Lucide components
const IconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Brain,
  Bone,
  Stethoscope,
  Activity,
  Cross,
};

export default function SpecialitiesSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedSpecialities = showAll 
    ? hospitalConfig.specialities 
    : hospitalConfig.specialities.slice(0, 6);

  return (
    <section id="specialities" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Our Specialities
          </h2>
          {/* Orange Underline Accent */}
          <div className="w-24 h-1.5 bg-secondary rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl text-lg">
            Delivering excellence in healthcare through specialized departments 
            equipped with cutting-edge technology and renowned medical experts.
          </p>
        </div>

        {/* Specialities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all">
          {displayedSpecialities.map((speciality, index) => {
            const IconComponent = IconMap[speciality.icon] || Activity; // fallback to Activity
            
            return (
              <div 
                key={index}
                className="group bg-white rounded-xl p-8 text-center border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:scale-[1.02]"
              >
                {/* Icon in Light Blue Circle */}
                <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <IconComponent size={36} strokeWidth={2} />
                </div>
                
                {/* Text Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {speciality.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {speciality.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Button */}
        {!showAll && hospitalConfig.specialities.length > 6 && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => setShowAll(true)}
              className="px-8 py-3.5 text-sm font-bold text-white transition-colors bg-primary rounded-xl hover:bg-blue-900 shadow-sm hover:shadow-md"
            >
              View All Specialities
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

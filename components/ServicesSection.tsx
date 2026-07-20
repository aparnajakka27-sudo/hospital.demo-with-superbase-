import { hospitalConfig } from "../lib/hospitalConfig";
import * as Icons from "lucide-react";

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 inline-block relative">
            Our Services
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Comprehensive healthcare services under one roof.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hospitalConfig.services.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Stethoscope;
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconComponent size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

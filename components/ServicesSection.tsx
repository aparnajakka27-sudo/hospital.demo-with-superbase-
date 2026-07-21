import { hospitalConfig } from "../lib/hospitalConfig";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { 
    y: -8,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 } 
  }
};

const iconVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } }
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 inline-block relative">
            Our Services
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Comprehensive healthcare services under one roof.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {hospitalConfig.services.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Stethoscope;
            
            return (
              <motion.div 
                key={index} 
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-2xl border border-gray-100 p-6 transition-colors duration-300 group"
              >
                <motion.div 
                  variants={iconVariants}
                  className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  <IconComponent size={28} />
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

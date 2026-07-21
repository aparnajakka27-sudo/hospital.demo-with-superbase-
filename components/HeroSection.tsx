import Image from "next/image";
import { hospitalConfig } from "../lib/hospitalConfig";
import { Clock, Users, Stethoscope } from "lucide-react";
import { useAppointment } from "../context/AppointmentContext";
import AppointmentCard from "./AppointmentCard";
import MagneticButton from "./MagneticButton";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 150 } }
};

const badgeScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function HeroSection() {
  const { setIsAppointmentModalOpen } = useAppointment();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="home" className="relative w-full bg-primary overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center">
      
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent z-10 hidden md:block"></div>
        <div className="absolute inset-0 bg-primary/80 z-10 md:hidden"></div>
        
        <motion.div 
          style={{ y }}
          initial={{ opacity: 0, x: 50, scale: 1.05 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 md:left-1/3 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600"
            alt="Horizon Super Speciality Hospital Building"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.85] via-primary/70 to-primary/40 z-10"></div>
          
          {/* Subtle Decorative Pattern (Bottom Left) */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 z-10 opacity-20 pointer-events-none"
          >
            <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle fill="#F26522" cx="2" cy="2" r="2"></circle>
                </pattern>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#dots)"></rect>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 py-16 md:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="w-full lg:w-[55%] text-white"
          >
            
            {/* Eyebrow Label */}
            <motion.div variants={itemLeft} className="inline-block px-4 py-1.5 bg-secondary rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-md border border-white/20">
              Trusted Healthcare Since 2010
            </motion.div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-6 max-w-2xl drop-shadow-sm">
              <motion.span variants={itemLeft} className="block">{hospitalConfig.name.split(" ")[0]}</motion.span>
              <motion.span variants={itemLeft} className="block mt-2">
                {hospitalConfig.name.split(" ").slice(1).join(" ")}
              </motion.span>
            </h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-xl border-l-4 border-secondary pl-4 drop-shadow-sm">
              {hospitalConfig.tagline}
            </motion.p>

            {/* Feature Badges - Glassmorphism */}
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 mb-10">
              <motion.div variants={badgeScale} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-lg">
                <div className="bg-secondary/90 p-2 rounded-lg text-white">
                  <Clock size={20} />
                </div>
                <span className="text-sm font-semibold text-white tracking-wide">24/7 Emergency Care</span>
              </motion.div>
              
              <motion.div variants={badgeScale} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-lg">
                <div className="bg-secondary/90 p-2 rounded-lg text-white">
                  <Users size={20} />
                </div>
                <span className="text-sm font-semibold text-white tracking-wide">Experienced Specialists</span>
              </motion.div>
              
              <motion.div variants={badgeScale} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-lg">
                <div className="bg-secondary/90 p-2 rounded-lg text-white">
                  <Stethoscope size={20} />
                </div>
                <span className="text-sm font-semibold text-white tracking-wide">Advanced Technology</span>
              </motion.div>
            </motion.div>

            {/* Primary CTA */}
            <MagneticButton>
              <motion.button 
                variants={scaleUp}
                onClick={() => setIsAppointmentModalOpen(true)}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-colors"
              >
                Book Appointment
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.button>
            </MagneticButton>

          </motion.div>

          {/* Right Content - Appointment Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full lg:w-[45%] xl:w-[40%] flex justify-center lg:justify-end mt-12 lg:mt-0 z-30"
          >
            <AppointmentCard />
          </motion.div>

        </div>
      </div>

      {/* Overlapping Stats Bar at Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-40 px-4 md:px-6"
      >
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-wrap justify-between items-center gap-6 max-w-5xl mx-auto">
            {hospitalConfig.stats.slice(0, 4).map((stat, index) => (
              <div key={index} className="flex-1 text-center border-r last:border-r-0 border-gray-100 px-4 min-w-[120px]">
                <p className="text-3xl font-extrabold text-primary mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

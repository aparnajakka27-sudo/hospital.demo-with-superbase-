import Image from "next/image";
import { hospitalConfig } from "../lib/hospitalConfig";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 leading-tight">
              Welcome to {hospitalConfig.name}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              HORIZON Super Speciality Hospital is a state-of-the-art medical facility 
              equipped with advanced technology and a team of renowned specialists. We 
              are committed to delivering comprehensive healthcare services across various 
              disciplines, ensuring the highest standards of medical excellence.
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              With a patient-first approach, our highly experienced doctors and 
              compassionate staff utilize the latest medical advancements and advanced 
              technology to provide personalized care. Your health, safety, and rapid 
              recovery remain our utmost priority at every step of your journey.
            </p>

            <a
              href="#facilities"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-secondary transition-colors border-2 border-secondary rounded-xl hover:bg-secondary hover:text-white"
            >
              Learn More
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right Column - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1000&auto=format&fit=crop"
                alt="About Horizon Hospital"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

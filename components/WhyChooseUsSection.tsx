import { hospitalConfig } from "../lib/hospitalConfig";
import { CheckCircle2 } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column - Why Choose Us List */}
          <div className="w-full lg:w-1/2">
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
              Our Excellence
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 leading-tight">
              Why Choose {hospitalConfig.shortName}?
            </h2>
            
            <ul className="space-y-6">
              {hospitalConfig.whyChooseUs.map((reason, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={24} />
                  <span className="text-lg text-gray-700 font-medium">
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Stats 2x2 Grid */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {hospitalConfig.stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-accent rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300"
                >
                  <span className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-gray-700">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { hospitalConfig } from "../lib/hospitalConfig";

export default function BuildingSection() {
  return (
    <section id="facilities" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-8">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
            Gallery
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            Our Hospital
          </h2>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
            alt={`${hospitalConfig.name} Building`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

      </div>
    </section>
  );
}

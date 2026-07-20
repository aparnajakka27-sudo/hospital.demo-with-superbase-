import Image from "next/image";
import { hospitalConfig } from "../lib/hospitalConfig";

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 inline-block relative">
            Our Facilities
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Take a look inside HORIZON Super Speciality Hospital.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitalConfig.gallery.map((item, index) => (
            <div 
              key={index} 
              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-gray-100 shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.caption}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import { hospitalConfig } from "../lib/hospitalConfig";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

export default function ContactInfoStrip() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* Address Card */}
          <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-5 rounded-xl transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">Address</p>
              <p className="text-xs text-gray-600 leading-tight">
                {hospitalConfig.address}
              </p>
            </div>
          </div>

          {/* Hours Card */}
          <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-5 rounded-xl transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">Working Hours</p>
              <p className="text-xs text-gray-600 leading-tight">
                {hospitalConfig.hours}
              </p>
            </div>
          </div>

          {/* Phone Card */}
          <a href={`tel:${hospitalConfig.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-5 rounded-xl transition-shadow hover:shadow-md group">
            <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">Phone Number</p>
              <p className="text-xs text-gray-600 leading-tight">
                {hospitalConfig.phone}
              </p>
            </div>
          </a>

          {/* Location / Plus Code Card */}
          <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-5 rounded-xl transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">Location Code</p>
              <p className="text-xs text-gray-600 leading-tight">
                8J23+4X Hyderabad
              </p>
            </div>
          </div>

        </div>

        {/* Google Maps iframe */}
        <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <iframe
            src={hospitalConfig.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>

      </div>
    </section>
  );
}

import { hospitalConfig } from "../lib/hospitalConfig";
import { HeartPulse, MapPin, Phone, Clock, Mail } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Doctors", href: "#doctors" },
  { name: "Gallery", href: "#facilities" },
  { name: "Contact Us", href: "#contact" },
];

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.61l.39-4H14V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col">
            <Link href="#home" className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary">
                <HeartPulse size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none tracking-tight">
                  {hospitalConfig.shortName}
                </span>
                <span className="text-[10px] font-semibold text-accent tracking-wider uppercase mt-1">
                  Super Speciality Hospital
                </span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 mb-6 leading-relaxed">
              {hospitalConfig.tagline}
            </p>
            <div className="flex items-center gap-4">
              <a href={hospitalConfig.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <FacebookIcon size={16} />
              </a>
              <a href={hospitalConfig.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <InstagramIcon size={16} />
              </a>
              <a href={hospitalConfig.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors inline-block hover:translate-x-1 transform duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Specialities */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">
              Specialities
            </h4>
            <ul className="space-y-3">
              {hospitalConfig.specialities.map((speciality) => (
                <li key={speciality.name}>
                  <a href="#specialities" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors inline-block hover:translate-x-1 transform duration-200">
                    {speciality.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80 leading-snug">
                  {hospitalConfig.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <a href={`tel:${hospitalConfig.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {hospitalConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <a href={`mailto:${hospitalConfig.email}`} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {hospitalConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-secondary shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  {hospitalConfig.hours}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60 text-center md:text-left">
            &copy; {currentYear} {hospitalConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

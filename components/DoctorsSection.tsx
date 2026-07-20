"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { hospitalConfig } from "../lib/hospitalConfig";
import { X } from "lucide-react";
import { useAppointment } from "../context/AppointmentContext";

export default function DoctorsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsAppointmentModalOpen, setSelectedDepartment } = useAppointment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);
  return (
    <section id="doctors" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 inline-block relative">
            Meet Our Doctors
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Experienced specialists dedicated to your care.
          </p>
        </div>

        {/* Doctors Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {hospitalConfig.doctors.slice(0, 4).map((doctor, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center border border-gray-100"
            >
              {/* Image */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-5 border-4 border-accent">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
              <p className="text-secondary text-sm font-semibold mb-2">{doctor.specialization}</p>
              <p className="text-gray-500 text-xs mb-1">{doctor.qualification}</p>
              <p className="text-gray-500 text-xs mb-6">{doctor.experience} Experience</p>

              {/* Action */}
              <div className="mt-auto w-full">
                <button 
                  onClick={() => {
                    setSelectedDepartment(doctor.department);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block px-8 py-3 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            View All Doctors
          </button>
        </div>

      </div>

      {/* Full Doctors Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-gray-50 w-full max-w-7xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-primary">All Our Specialists</h2>
                <p className="text-gray-500 text-sm mt-1">Our comprehensive team of healthcare professionals</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Grid */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {hospitalConfig.doctors.map((doctor, index) => (
                  <div 
                    key={`modal-${index}`} 
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col items-center text-center border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 border-4 border-accent">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="text-base font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-secondary text-xs font-semibold mb-2">{doctor.specialization}</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mb-1 line-clamp-1">{doctor.qualification}</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mb-5">{doctor.experience} Exp.</p>

                    {/* Action */}
                    <div className="mt-auto w-full">
                      <button 
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedDepartment(doctor.department);
                          setIsAppointmentModalOpen(true);
                        }}
                        className="w-full py-2 px-3 text-xs md:text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

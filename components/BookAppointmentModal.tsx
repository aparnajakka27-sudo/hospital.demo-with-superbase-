"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useAppointment } from "../context/AppointmentContext";
import AppointmentCard from "./AppointmentCard";

export default function BookAppointmentModal() {
  const { isAppointmentModalOpen, setIsAppointmentModalOpen } = useAppointment();
  
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAppointmentModalOpen(false);
      }
    };
    if (isAppointmentModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isAppointmentModalOpen, setIsAppointmentModalOpen]);

  if (!isAppointmentModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsAppointmentModalOpen(false)}
    >
      <div className="relative w-full max-w-md mx-auto animate-in zoom-in-95 duration-200">
        <button 
          onClick={() => setIsAppointmentModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <AppointmentCard onClose={() => setIsAppointmentModalOpen(false)} />
      </div>
    </div>
  );
}

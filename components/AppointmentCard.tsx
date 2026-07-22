"use client";

import { useState, useEffect } from "react";
import { Calendar, User, Phone, CheckSquare, Square, ChevronDown, Mail } from "lucide-react";
import { useAppointment } from "../context/AppointmentContext";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

interface AppointmentCardProps {
  onClose?: () => void;
}

export default function AppointmentCard({ onClose }: AppointmentCardProps) {
  const { selectedDepartment } = useAppointment();
  
  const [countryCode, setCountryCode] = useState("+91");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    department: "",
    doctor: "",
    date: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicDepartments, setDynamicDepartments] = useState<string[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchDepartments() {
      try {
        const { data, error } = await supabase
          .from("Departments")
          .select("Names")
          .order("Names");
          
        if (!isMounted) return;

        if (error) {
          console.error(error);
          setFetchError(true);
        } else if (data) {
          setDynamicDepartments(data.map(d => d.Names ? d.Names.trim() : "").filter(Boolean));
        }
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setFetchError(true);
      } finally {
        if (isMounted) {
          setIsLoadingDepartments(false);
        }
      }
    }
    fetchDepartments();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync with global selected department
  useEffect(() => {
    if (selectedDepartment) {
      setFormData((prev) => ({ ...prev, department: selectedDepartment }));
    }
  }, [selectedDepartment]);

  const doctorsList = ["Dr. Smith (Cardiology)", "Dr. Jones (Neurology)", "Dr. Patel (Orthopaedics)", "Dr. Kumar (General)"];

  const isFormValid = formData.fullName.trim() !== "" && formData.email.trim() !== "" && formData.mobile.trim() !== "" && formData.consent && dynamicDepartments.length > 0 && !isLoadingDepartments && !fetchError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setIsSubmitting(true);
      
      // Convert phone to integer as Supabase expects int8
      const phoneNum = parseInt((countryCode + formData.mobile).replace(/\D/g, ''), 10);
      
      const { error } = await supabase
        .from('Booking Appointment')
        .upsert([
          { 
            Name: formData.fullName, 
            Email: formData.email, 
            Phone: isNaN(phoneNum) ? null : phoneNum,
            Department:formData.department,
            Date:formData.date,
            Doctor:formData.doctor,
            booking_type: 'Online',
            queue_status: 'Scheduled'
          }
        ]);
        
      setIsSubmitting(false);

      if (error) {
        console.error("Supabase Error:", error);
        alert("There was an error saving to Supabase: " + error.message);
      } else {
        alert("Appointment requested successfully! Our team will contact you shortly.");
        
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          department: "",
          doctor: "",
          date: "",
          consent: false,
        });
        
        if (onClose) onClose();
      }
    }
  };

  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-md mx-auto md:mx-0 border border-gray-100 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-primary/5 px-6 py-4 border-b border-gray-100 pr-12">
        <h3 className="text-xl font-bold text-primary">Book an Appointment</h3>
        <p className="text-sm text-gray-500 mt-1">Get prioritized scheduling</p>
      </div>

      <div className="px-6 py-5">


        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:shadow-md focus:pl-11 outline-none transition-all duration-300 text-sm text-gray-900 placeholder:text-gray-400"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:shadow-md focus:pl-11 outline-none transition-all duration-300 text-sm text-gray-900 placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-24 relative bg-gray-50 border border-gray-200 rounded-xl flex items-center">
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full h-full appearance-none bg-transparent pl-3 pr-6 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary rounded-xl cursor-pointer"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+65">+65 (SG)</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="Mobile Number *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:shadow-md focus:pl-11 outline-none transition-all duration-300 text-sm text-gray-900 placeholder:text-gray-400"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:shadow-md focus:pl-4 outline-none transition-all duration-300 text-sm appearance-none text-gray-900"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={isLoadingDepartments || fetchError || dynamicDepartments.length === 0}
              >
                {isLoadingDepartments ? (
                  <option value="" disabled className="text-gray-400">Loading departments...</option>
                ) : fetchError ? (
                  <option value="" disabled className="text-gray-400">Unable to load departments. Please try again.</option>
                ) : dynamicDepartments.length === 0 ? (
                  <option value="" disabled className="text-gray-400">No departments available</option>
                ) : (
                  <>
                    <option value="" disabled className="text-gray-400">Select Department</option>
                    {dynamicDepartments.map((deptName) => (
                      <option key={deptName} value={deptName}>{deptName}</option>
                    ))}
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            
            <div className="relative flex-1">
              <select
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:shadow-md focus:pl-4 outline-none transition-all duration-300 text-sm appearance-none text-gray-900"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              >
                <option value="" disabled className="text-gray-400">Doctor</option>
                {doctorsList.map((doc) => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:shadow-md focus:pl-11 outline-none transition-all duration-300 text-sm text-gray-900"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <button
              type="button"
              className="mt-0.5 text-primary focus:outline-none shrink-0"
              onClick={() => setFormData({ ...formData, consent: !formData.consent })}
            >
              {formData.consent ? (
                <CheckSquare size={16} className="text-secondary" />
              ) : (
                <Square size={16} className="text-gray-400" />
              )}
            </button>
            <p className="text-[10px] leading-tight text-gray-500">
              I agree to the Privacy Policy and consent to receive SMS/WhatsApp communications regarding my appointment.
            </p>
          </div>

          <motion.button
            whileHover={!isFormValid || isSubmitting ? {} : { scale: 1.03, boxShadow: "0 0 15px rgba(249, 115, 22, 0.6)" }}
            whileTap={!isFormValid || isSubmitting ? {} : { scale: 0.97 }}
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-4 ${
              isFormValid && !isSubmitting
                ? "bg-primary text-white hover:bg-blue-800 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Booking..." : "Schedule Appointment"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

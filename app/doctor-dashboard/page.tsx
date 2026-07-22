"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { Stethoscope, ChevronDown, CheckCircle2, User, Activity, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function DoctorDashboard() {
  const { user, isLoading, logout } = useDoctorAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Prescription Form State
  const [medName, setMedName] = useState("");
  const [frequency, setFrequency] = useState("1-0-1 (Morning & Night)");
  const [duration, setDuration] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/doctor-login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMyPatients();
      
      const subscription = supabase
        .channel('doctor-queue')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Booking Appointment', filter: `Doctor=eq.${user.name}` }, () => {
          fetchMyPatients();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchMyPatients = async () => {
    if (!user) return;
    try {
      // Strict data isolation: fetch only patients for the logged-in doctor
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .eq('Doctor', user.name);

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error("Error fetching doctor patients:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddMedicine = () => {
    if (!medName) return;
    setMedicines([...medicines, { name: medName, frequency, duration }]);
    setMedName("");
    setDuration("");
  };

  const handleSendToPharmacy = () => {
    setIsSending(true);
    
    // Simulating sending to pharmacy via localStorage for the demo
    const newPrescription = {
      id: "RX-" + Math.floor(Math.random() * 10000),
      patientName: selectedPatient.Name || selectedPatient.patientName || "Unknown",
      uhid: "HZ-2026-100" + (patients.findIndex(p => p.id === selectedPatient.id) > -1 ? patients.findIndex(p => p.id === selectedPatient.id) : "X"),
      doctorName: user?.name,
      medicines: [...medicines],
      status: "Pending Dispense",
      timestamp: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("hospital_prescriptions") || "[]");
    localStorage.setItem("hospital_prescriptions", JSON.stringify([newPrescription, ...existing]));
    
    // Dispatch event so other tabs can update instantly
    window.dispatchEvent(new Event('prescription_added'));

    setTimeout(() => {
      setIsSending(false);
      setMedicines([]);
      alert("Prescription sent to pharmacy successfully!");
    }, 800);
  };

  if (isLoading || !user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-primary font-semibold">Verifying secure session...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1400px]">
        
        {/* Back Button */}
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 hover:shadow-md text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <button 
            onClick={logout} 
            className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100"
          >
            Logout session
          </button>
        </div>
        {/* Header Console */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-wider text-xs uppercase mb-2">
              <Stethoscope size={16} />
              OPD CLINICAL DOCTOR CONSOLE
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Consultation & e-Prescription Desk</h1>
            <p className="text-gray-500 text-sm">Write digital prescriptions, record vitals, use AI diagnosis assistance, and dispatch via WhatsApp.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">Active Doctor:</span>
            {/* Visual Match: A select dropdown mimicking the screenshot, but locked to the current doctor for strict isolation */}
            <div className="relative">
              <select className="appearance-none bg-white border border-emerald-500 rounded-full px-5 py-2.5 pr-10 text-sm font-bold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option>{user.name} ({user.specialty}) - Room {user.room}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600">
                <ChevronDown size={16} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          
          {/* Left Column: Today's Patient Queue */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 min-h-[400px] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Today's Patient Queue</h3>
                  <p className="text-xs text-gray-500 mt-1">{user.specialty} ({patients.length})</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Room {user.room}
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                {isFetching ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <p className="text-gray-400 text-sm font-medium">No patients scheduled for {user.name} today.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patients.map((p, idx) => (
                      <div 
                        key={p.id || idx}
                        onClick={() => setSelectedPatient(p)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPatient?.id === p.id 
                            ? "border-emerald-500 bg-emerald-50 shadow-sm" 
                            : "border-gray-100 bg-white hover:border-emerald-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{p.Name || p.patientName}</h4>
                          <span className="text-xs font-bold text-gray-500">#{101 + idx}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Activity size={12} className="text-emerald-500" />
                          <span>{p.timeSlot || p.Date || "Waiting"}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
                          <span className="text-primary font-medium">{p.Department || user.specialty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Patient Details */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full min-h-[500px] flex items-center justify-center p-8">
              
              {!selectedPatient ? (
                <div className="text-center max-w-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Stethoscope size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Patient Selected</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Select a patient from the waiting queue on the left to start consultation and issue e-prescriptions.
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{selectedPatient.Name || selectedPatient.patientName}</h2>
                      <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
                        <span className="flex items-center gap-1.5"><User size={16} className="text-gray-400" /> UHID: HZ-2026-100{patients.findIndex(p => p.id === selectedPatient.id)}</span>
                        <span className="flex items-center gap-1.5"><FileText size={16} className="text-gray-400" /> {selectedPatient.Department || "General"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Active Consultation
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-white rounded-xl border border-gray-100 flex flex-col h-full overflow-hidden">
                    
                    {/* Prescription Form */}
                    <div className="p-6 border-b border-gray-100 flex-1 overflow-y-auto bg-gray-50/30">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-primary" /> Add Medicines
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 mb-1">Medicine Name</label>
                          <input 
                            type="text" 
                            value={medName}
                            onChange={(e) => setMedName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                            placeholder="e.g. Amoxicillin 500mg" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Frequency</label>
                          <select 
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option>1-0-1 (Morning & Night)</option>
                            <option>1-1-1 (Three times a day)</option>
                            <option>1-0-0 (Morning only)</option>
                            <option>0-0-1 (Night only)</option>
                            <option>SOS (As needed)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Duration</label>
                          <input 
                            type="text" 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                            placeholder="e.g. 5 Days" 
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleAddMedicine}
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors mb-6"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">+</span> Add Medicine
                      </button>

                      {/* Added Medicines List */}
                      {medicines.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prescription Cart</h4>
                          <div className="space-y-2">
                            {medicines.map((m, i) => (
                              <div key={i} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{m.name}</p>
                                  <p className="text-xs text-gray-500">{m.frequency} • {m.duration}</p>
                                </div>
                                <button 
                                  onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center">
                      <p className="text-xs text-gray-400">Medications will be sent directly to the pharmacy.</p>
                      <button 
                        onClick={handleSendToPharmacy}
                        disabled={medicines.length === 0 || isSending}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? "Sending..." : "Send to Pharmacy"}
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#0B1B36] py-3 text-center border-t border-[#1a2c4e] mt-auto">
        <p className="text-[10px] text-gray-500 font-semibold tracking-wider flex items-center justify-center gap-4">
          AuraCare Hospital OS • Agency Sales Pitch System
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          Paperless Hospital Workflow Engine
          <span className="text-primary-light">•</span>
          Supabase Credentials & SQL Setup
        </p>
      </footer>
    </div>
  );
}

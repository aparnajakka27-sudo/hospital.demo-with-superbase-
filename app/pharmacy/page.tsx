"use client";

import { useState, useEffect } from "react";
import { Pill, Search, Filter, CheckCircle2, Clock, Activity, Stethoscope, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [filter, setFilter] = useState("All Prescriptions");
  const [search, setSearch] = useState("");

  const loadPrescriptions = () => {
    const existing = JSON.parse(localStorage.getItem("hospital_prescriptions") || "[]");
    setPrescriptions(existing);
  };

  useEffect(() => {
    loadPrescriptions();

    const handleStorageChange = () => loadPrescriptions();
    
    // Listen for cross-tab updates (storage event) and same-tab updates (custom event)
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("prescription_added", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("prescription_added", handleStorageChange);
    };
  }, []);

  const handleMarkFulfilled = (id: string) => {
    const updated = prescriptions.map(p => 
      p.id === id ? { ...p, status: "Fulfilled" } : p
    );
    setPrescriptions(updated);
    localStorage.setItem("hospital_prescriptions", JSON.stringify(updated));
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    if (filter !== "All Prescriptions" && p.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        p.id?.toLowerCase().includes(s) ||
        p.patientName?.toLowerCase().includes(s) ||
        p.uhid?.toLowerCase().includes(s) ||
        p.doctorName?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const stats = {
    pending: prescriptions.filter(p => p.status === "Pending Dispense").length,
    fulfilled: prescriptions.filter(p => p.status === "Fulfilled").length
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1400px]">
        
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 hover:shadow-md text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold tracking-wider text-xs uppercase mb-2">
              <Pill size={16} />
              HOSPITAL PHARMACY & DISPENSARY PORTAL
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Pharmacy Dispensing Dashboard</h1>
            <p className="text-gray-500 text-sm">Real-time digital prescriptions received directly from doctor consultation desks for immediate medicine fulfillment.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-full font-bold text-sm">
              <Clock size={16} /> {stats.pending} Pending Dispense
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-full font-bold text-sm">
              <CheckCircle2 size={16} /> {stats.fulfilled} Handed to Patient
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-between items-center gap-4 mb-6 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Rx ID, Patient Name, UHID, or Doctor..." 
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 relative">
            <Filter className="text-gray-400" size={18} />
            <span className="text-xs font-semibold text-gray-500">Filter:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border border-gray-200 rounded-md py-1.5 px-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option>All Prescriptions</option>
              <option>Pending Dispense</option>
              <option>Fulfilled</option>
            </select>
          </div>
        </div>

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center py-24">
            <p className="text-gray-400 text-sm font-semibold">No matching prescriptions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.map((rx) => (
              <div key={rx.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className={`p-4 border-b flex justify-between items-center ${rx.status === "Fulfilled" ? "bg-emerald-50/50 border-emerald-100" : "bg-orange-50/50 border-orange-100"}`}>
                  <div>
                    <h3 className="font-bold text-gray-900">{rx.patientName}</h3>
                    <div className="text-xs font-semibold text-gray-500 flex items-center gap-2 mt-1">
                      <span>{rx.uhid}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1 text-gray-600"><Stethoscope size={12} /> {rx.doctorName}</span>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${rx.status === "Fulfilled" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-orange-100 text-orange-700 border-orange-200"}`}>
                    {rx.status}
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medicines</span>
                    <span className="text-xs text-gray-400">{new Date(rx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {rx.medicines?.map((med: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div className="flex gap-2">
                          <Activity size={14} className="text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{med.name}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">{med.frequency}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {rx.status === "Pending Dispense" && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => handleMarkFulfilled(rx.id)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Mark as Fulfilled & Handed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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

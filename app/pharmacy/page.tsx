"use client";

import { useState, useEffect } from "react";
import { Pill, Search, Filter, CheckCircle2, Clock, Activity, Stethoscope, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [filter, setFilter] = useState("All Prescriptions");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();

    const subscription = supabase
      .channel('pharmacy-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Booking Appointment' }, () => {
        fetchPrescriptions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .not('pharmacy_status', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkFulfilled = async (rx: any) => {
    try {
      const { error } = await supabase
        .from('Booking Appointment')
        .update({ pharmacy_status: 'Fulfilled' })
        .eq('Name', rx.Name)
        .eq('Email', rx.Email || "");
        
      if (error) throw error;
      // Optimistic update (realtime will also catch it)
      setPrescriptions(prev => prev.map(p => p.Name === rx.Name ? { ...p, pharmacy_status: 'Fulfilled' } : p));
    } catch (err) {
      console.error("Error marking fulfilled:", err);
      alert("Error updating prescription.");
    }
  };

  const handleWhatsApp = (rx: any) => {
    const phone = rx.Phone || "Unknown Number";
    const name = rx.Name || "Patient";
    alert(`WhatsApp simulated message sent to ${phone}:\n"Hello ${name}, your prescription from Dr. ${rx.Doctor} has been dispensed. Please proceed to the pharmacy counter to collect your medicines. Thank you!"`);
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    if (filter !== "All Prescriptions" && p.pharmacy_status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      // Strict search by token number as requested
      return p.token_number?.toString() === s || p.token_number?.toString().includes(s);
    }
    return true;
  });

  const stats = {
    pending: prescriptions.filter(p => p.pharmacy_status === "Pending Dispense").length,
    fulfilled: prescriptions.filter(p => p.pharmacy_status === "Fulfilled").length
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
              placeholder="Search by Token Number..." 
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-bold text-gray-900"
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
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm font-semibold">Loading prescriptions from Supabase...</p>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-24">
            <Pill size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm font-semibold">No matching prescriptions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.map((rx, idx) => (
              <div key={`${rx.Name}-${idx}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className={`p-4 border-b flex justify-between items-start ${rx.pharmacy_status === "Fulfilled" ? "bg-emerald-50/50 border-emerald-100" : "bg-orange-50/50 border-orange-100"}`}>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {rx.Name || "Unknown Patient"} 
                    </h3>
                    <div className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm inline-block mt-2">
                      Token #{rx.token_number}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-gray-600"><Stethoscope size={12} /> Dr. {rx.Doctor}</span>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${rx.pharmacy_status === "Fulfilled" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-orange-100 text-orange-700 border-orange-200"}`}>
                    {rx.pharmacy_status}
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medicines</span>
                    <span className="text-xs text-gray-400 font-semibold">{new Date(rx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {rx.medicines_list?.map((med: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div className="flex gap-2">
                          <Activity size={14} className="text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{med.name}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">{med.frequency}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 shadow-sm px-2 py-0.5 rounded">{med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {rx.pharmacy_status === "Pending Dispense" ? (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => handleMarkFulfilled(rx)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <CheckCircle2 size={16} /> Mark as Fulfilled & Handed
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => handleWhatsApp(rx)}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} /> Resend WhatsApp Reminder
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0B1B36] py-3 text-center border-t border-[#1a2c4e] mt-auto shrink-0">
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

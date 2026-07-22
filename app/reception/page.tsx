"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, UserMinus, Search, Filter, Phone, Mail, FileText, Activity, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ReceptionDashboard() {
  const [isWalkInFormOpen, setIsWalkInFormOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Form State
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const [triage, setTriage] = useState("Normal");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [paymentStatus, setPaymentStatus] = useState("Collected $50 (Paid)");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('reception-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Booking Appointment' }, () => {
        fetchPatients();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*');

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !mobile || !assignedDoctor || !reason) return;
    
    setIsSubmitting(true);
    
    const phoneNum = parseInt(mobile.replace(/\D/g, ''), 10);
    
    try {
      const { error } = await supabase.from('Booking Appointment').insert([
        {
          Name: patientName,
          Email: email || "",
          Phone: isNaN(phoneNum) ? null : phoneNum,
          Department: "General", // Placeholder, ideally derived from assignedDoctor
          Date: new Date().toISOString().split('T')[0],
          Doctor: assignedDoctor,
          age: parseInt(age, 10) || null,
          gender: gender,
          triage_priority: triage,
          payment_status: paymentStatus,
          reason: reason,
          queue_status: "Waiting",
          booking_type: "Walk-in"
        }
      ]);
      
      if (error) throw error;
      
      // Reset form
      setPatientName("");
      setMobile("");
      setEmail("");
      setAssignedDoctor("");
      setReason("");
      setAge("");
      setIsWalkInFormOpen(false);
      
    } catch (err) {
      console.error("Failed to add walk-in:", err);
      alert("Error adding walk-in patient. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: patients.length,
    waiting: patients.length, // Placeholder logic
    inConsult: 0,
    completed: 0
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = (p.Name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.Phone || "").toString().includes(searchQuery);
    const matchesType = filterType === "All" || p.booking_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header Placeholder (since this is an isolated dashboard page) */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center hidden">
        {/* Placeholder for integration with main layout if needed */}
      </div>

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
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs uppercase mb-2">
              <Users size={16} />
              Hospital Front Desk & Queue Controller
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Reception Intake Dashboard</h1>
            <p className="text-gray-500 text-sm">Real-time patient check-ins, walk-in token generation, emergency triage & WhatsApp token dispatching.</p>
          </div>
          <button 
            onClick={() => setIsWalkInFormOpen(!isWalkInFormOpen)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md active:scale-95"
          >
            {isWalkInFormOpen ? (
              <><UserMinus size={18} /> Close Walk-In Form</>
            ) : (
              <><UserPlus size={18} /> + Walk-In / Urgent Intake</>
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-gray-500 text-xs font-semibold mb-1">Total Booked Today</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-gray-900">{stats.total}</span>
              <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center"><Activity size={12} className="mr-0.5"/> Live</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">Waiting Queue</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-orange-500">{stats.waiting}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-semibold">READY IN OPD WAITING AREA</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">In Doctor Consultation</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-primary">{stats.inConsult}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-semibold">ACTIVE INSIDE OPD ROOMS</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">Completed Today</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-emerald-600">{stats.completed}</span>
            </div>
            <p className="text-[10px] text-emerald-600/70 mt-2 font-bold tracking-wide">E-PRESCRIPTIONS DISPATCHED</p>
          </div>
        </div>

        {/* Walk-in Form Section (Collapsible) */}
        {isWalkInFormOpen && (
          <div className="bg-[#0B1B36] rounded-2xl shadow-xl p-6 md:p-8 mb-6 text-white border border-[#1a2c4e] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <UserPlus size={24} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">New Walk-In Patient Registration</h2>
                <p className="text-gray-400 text-sm">Creates instant UHID & assigns OPD queue token</p>
              </div>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Patient Name *</label>
                  <input type="text" required value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g. David Miller" className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Mobile (WhatsApp) *</label>
                  <input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Email (Optional)</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="david@example.com" className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Assigned Doctor *</label>
                  <select required value={assignedDoctor} onChange={e => setAssignedDoctor(e.target.value)} className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                    <option value="">Select Doctor...</option>
                    <option value="Dr. Smith (Cardiology)">Dr. Smith (Cardiology) - Available</option>
                    <option value="Dr. Jones (Neurology)">Dr. Jones (Neurology) - 2 waiting</option>
                    <option value="Dr. Patel (Orthopaedics)">Dr. Patel (Orthopaedics) - Available</option>
                    <option value="Dr. Kumar (General)">Dr. Kumar (General) - 5 waiting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Triage Priority</label>
                  <select value={triage} onChange={e => setTriage(e.target.value)} className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                    <option value="Normal">Normal Queue</option>
                    <option value="Urgent">Urgent / Priority</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-300 mb-2">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="40" className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-300 mb-2">Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Payment Status</label>
                  <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white">
                    <option value="Collected $50 (Paid)">Collected $50 (Paid)</option>
                    <option value="Pending">Unpaid / Bill Later</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Chief Reason / Symptoms *</label>
                <input type="text" required value={reason} onChange={e => setReason(e.target.value)} placeholder="Severe back pain, sudden allergic skin rash, high temperature..." className="w-full bg-[#061022] border border-[#1a2c4e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white" />
              </div>

              <div className="flex justify-end items-center gap-6 pt-4 border-t border-[#1a2c4e]">
                <button type="button" onClick={() => setIsWalkInFormOpen(false)} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-50">
                  {isSubmitting ? "Processing..." : "Generate Token & Check-In"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patient name, UHID, phone or doctor..." 
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={18} />
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              <select className="border-none bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer">
                <option>All Statuses</option>
                <option>Scheduled</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Token #</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient & UHID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Doctor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Slot / Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Triage</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading queue...
                      </div>
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 text-sm font-medium">No patients in queue today.</td>
                  </tr>
                ) : (
                  patients.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">#{101 + idx}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{p.Name || "Unknown Patient"}</div>
                        <div className="text-xs font-semibold text-primary my-0.5">HZ-2026-100{p.id || idx} <span className="text-gray-400 font-normal ml-1">• {p.age ? `${p.age}y` : "Age N/A"} / {p.gender || "N/A"}</span></div>
                        <div className="text-[10px] text-gray-400">Consultation for {p.Department || "General Medicine"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{p.Doctor || "Dr. Specialist"}</div>
                        <div className="text-xs text-gray-500">{p.Department || "General Medicine"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                          <div className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" />{p.Date || "N/A"}</div>
                          {p.booking_type === 'Online' && (
                            <span className="inline-flex w-max items-center text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              Online Booking
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md border ${
                          p.triage_priority === 'Emergency' ? 'text-red-700 bg-red-50 border-red-100' : 
                          p.triage_priority === 'Urgent' ? 'text-orange-700 bg-orange-50 border-orange-100' :
                          'text-gray-700 bg-gray-50 border-gray-200'
                        }`}>
                          {p.triage_priority || 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md border ${
                          p.queue_status === 'Completed' ? 'text-blue-700 bg-blue-50 border-blue-100' :
                          'text-amber-700 bg-amber-50 border-amber-100'
                        }`}>
                          {p.queue_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md border ${
                          p.payment_status === 'Collected' || p.payment_status === 'Paid' || p.payment_status?.includes('Paid') ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                          p.payment_status === 'Pending' ? 'text-orange-700 bg-orange-50 border-orange-100' :
                          'text-gray-700 bg-gray-50 border-gray-200'
                        }`}>
                          {p.payment_status || 'Not Set'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {!p.age || !p.payment_status ? (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/5 transition-colors text-xs font-bold">
                              Check-In / Update
                            </button>
                          ) : (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors text-xs font-bold">
                              <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]"><Phone size={8} /></span>
                              WhatsApp
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

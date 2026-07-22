"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, UserPlus, UserMinus, Search, Filter, Phone, Activity, ArrowLeft, Calendar, Bell, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ReceptionDashboard() {
  const [isWalkInFormOpen, setIsWalkInFormOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Active"); // 'Active', 'All', 'Completed', 'No-show'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newOnlineCount, setNewOnlineCount] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [editingPatient, setEditingPatient] = useState<any>(null);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Booking Appointment' }, (payload: any) => {
        fetchPatients();
        
        // Notification logic for new online booking
        if (payload.eventType === 'INSERT' && payload.new.booking_type === 'Online') {
          // If it's for today or selected date
          if (payload.new.Date === selectedDate) {
             setNewOnlineCount(prev => prev + 1);
          }
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDate]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .eq('Date', selectedDate); // strictly filter by selected date

      if (error) throw error;
      setPatients(data || []);
      setNewOnlineCount(0); // clear visual cue when fetched manually or date changes
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openWalkInForm = (patientToEdit: any = null) => {
    setFormError(null);
    if (patientToEdit) {
      setEditingPatient(patientToEdit);
      setPatientName(patientToEdit.Name || "");
      setMobile(patientToEdit.Phone ? patientToEdit.Phone.toString() : "");
      setEmail(patientToEdit.Email || "");
      setAssignedDoctor(patientToEdit.Doctor || "");
      setTriage(patientToEdit.triage_priority || "Normal");
      setAge(patientToEdit.age ? patientToEdit.age.toString() : "");
      setGender(patientToEdit.gender || "Male");
      setPaymentStatus(patientToEdit.payment_status || "Collected $50 (Paid)");
      setReason(patientToEdit.reason || "");
      setIsWalkInFormOpen(true);
    } else {
      setEditingPatient(null);
      setPatientName("");
      setMobile("");
      setEmail("");
      setAssignedDoctor("");
      setTriage("Normal");
      setAge("");
      setGender("Male");
      setPaymentStatus("Collected $50 (Paid)");
      setReason("");
      setIsWalkInFormOpen(true);
    }
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !mobile || !assignedDoctor || !reason) return;
    
    // Duplicate Check for new walk-ins only
    const phoneNum = parseInt(mobile.replace(/\D/g, ''), 10);
    
    if (!editingPatient) {
      const duplicate = patients.find(p => p.Phone === phoneNum);
      if (duplicate) {
        const proceed = window.confirm("A patient with this mobile number already has an entry today. Continue anyway?");
        if (!proceed) return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        Name: patientName,
        Email: email || "",
        Phone: isNaN(phoneNum) ? null : phoneNum,
        Department: "General", // Better to derive from doctor but keeping it simple
        Date: selectedDate, // Use selected date, not necessarily today
        Doctor: assignedDoctor,
        age: parseInt(age, 10) || null,
        gender: gender,
        triage_priority: triage,
        payment_status: paymentStatus,
        reason: reason,
        queue_status: "Waiting",
      };
      
      // Auto-generate token if missing (frontend fallback since DB trigger might be missing)
      if (!editingPatient || !editingPatient.token_number) {
        payload.token_number = `HSP-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      let error;
      if (editingPatient) {
        // Update existing record using its original Name and Email as identifier (since it's the primary key)
        const { error: updateError } = await supabase
          .from('Booking Appointment')
          .update(payload)
          .eq('Name', editingPatient.Name)
          .eq('Email', editingPatient.Email || "");
        error = updateError;
      } else {
        // Insert new record (trigger handles token_number)
        const { error: insertError } = await supabase.from('Booking Appointment').insert([
          {
            ...payload,
            booking_type: "Walk-in"
          }
        ]);
        error = insertError;
      }
      
      if (error) throw error;
      
      setIsWalkInFormOpen(false);
      fetchPatients(); // Refresh list
    } catch (err: any) {
      const errorMsg = err?.message || err?.details || JSON.stringify(err);
      console.error("Failed to add/update patient:", JSON.stringify(err, null, 2), err);
      setFormError(`Database Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (patient: any, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('Booking Appointment')
        .update({ queue_status: newStatus })
        .eq('Name', patient.Name)
        .eq('Email', patient.Email || "");
      
      if (error) throw error;
      fetchPatients();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status.");
    }
  };

  // Memoized processing
  const processedData = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    // Sort logic
    const triageValue = (t: string) => {
      if (t === 'Emergency') return 3;
      if (t === 'Urgent') return 2;
      return 1;
    };

    let sortedPatients = [...patients].sort((a, b) => {
      const tA = triageValue(a.triage_priority);
      const tB = triageValue(b.triage_priority);
      if (tA !== tB) return tB - tA;
      // Secondary sort: booking/creation time
      const timeA = new Date(a.created_at || new Date()).getTime();
      const timeB = new Date(b.created_at || new Date()).getTime();
      return timeA - timeB;
    });

    const onlineBookings = sortedPatients.filter(p => p.booking_type === 'Online' && p.queue_status === 'Scheduled');
    
    // Active queue: everything else (walk-ins, checked-in online, waiting, with doctor, etc)
    let activeQueue = sortedPatients.filter(p => p.booking_type !== 'Online' || p.queue_status !== 'Scheduled');

    // Filtering active queue based on status filter
    if (filterStatus === 'Active') {
      activeQueue = activeQueue.filter(p => p.queue_status === 'Waiting' || p.queue_status === 'With Doctor');
    } else if (filterStatus !== 'All') {
      activeQueue = activeQueue.filter(p => p.queue_status === filterStatus);
    }

    // Applying search
    if (searchQuery) {
      activeQueue = activeQueue.filter(p => 
        (p.Name || "").toLowerCase().includes(searchLower) || 
        (p.Phone || "").toString().includes(searchLower) ||
        (p.token_number || "").toString().includes(searchLower)
      );
    }

    // Doctor stats
    const doctorStats: Record<string, { waiting: number, emergency: number }> = {};
    activeQueue.forEach(p => {
      if (p.queue_status === 'Waiting' && p.Doctor) {
        if (!doctorStats[p.Doctor]) doctorStats[p.Doctor] = { waiting: 0, emergency: 0 };
        doctorStats[p.Doctor].waiting += 1;
        if (p.triage_priority === 'Emergency') doctorStats[p.Doctor].emergency += 1;
      }
    });

    return { onlineBookings, activeQueue, doctorStats };
  }, [patients, searchQuery, filterStatus]);

  const { onlineBookings, activeQueue, doctorStats } = processedData;

  const stats = {
    total: patients.length,
    waiting: patients.filter(p => p.queue_status === 'Waiting').length,
    inConsult: patients.filter(p => p.queue_status === 'With Doctor').length,
    completed: patients.filter(p => p.queue_status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1600px]">
        {/* Header & Navigation */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 hover:shadow-md text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <Calendar className="text-gray-400" size={18} />
            <span className="text-sm font-semibold text-gray-600">Date:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm border-none focus:ring-0 font-bold text-primary outline-none"
            />
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs uppercase mb-2">
              <Users size={16} />
              Hospital Front Desk & Queue Controller
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Reception Intake Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage online bookings, walk-ins, and queue priorities seamlessly.</p>
          </div>
          <button 
            onClick={() => {
              if (!isWalkInFormOpen) openWalkInForm(null);
              else setIsWalkInFormOpen(false);
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            {isWalkInFormOpen && !editingPatient ? (
              <><UserMinus size={18} /> Close Walk-In Form</>
            ) : (
              <><UserPlus size={18} /> + Walk-In / Urgent Intake</>
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">In Consultation</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-primary">{stats.inConsult}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">Completed Today</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-emerald-600">{stats.completed}</span>
            </div>
          </div>
        </div>

        {/* Doctor Summary Stats */}
        {Object.keys(doctorStats).length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(doctorStats).map(([doc, stat]) => (
              <div key={doc} className="bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-2 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-800">{doc}</span>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded-full shadow-sm text-gray-600">{stat.waiting} Waiting</span>
                  {stat.emergency > 0 && (
                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">{stat.emergency} Emergency</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Registration Form (Collapsible) */}
        {isWalkInFormOpen && (
          <div className="bg-[#0B1B36] rounded-2xl shadow-xl p-6 md:p-8 mb-6 text-white border border-[#1a2c4e] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  {editingPatient ? <Edit size={24} className="text-blue-400" /> : <UserPlus size={24} className="text-blue-400" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{editingPatient ? 'Check-In / Update Patient' : 'New Walk-In Patient Registration'}</h2>
                  <p className="text-gray-400 text-sm">Update details or create instant UHID & assign OPD queue token</p>
                </div>
              </div>
              <button onClick={() => setIsWalkInFormOpen(false)} className="text-gray-400 hover:text-white p-2">
                <XCircle size={24} />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm font-semibold flex items-center justify-between">
                <div>{formError}</div>
                <button type="button" onClick={() => setFormError(null)} className="text-red-500 hover:text-white">
                  <XCircle size={16} />
                </button>
              </div>
            )}

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
                    <option value="Dr. Smith (Cardiology)">Dr. Smith (Cardiology)</option>
                    <option value="Dr. Jones (Neurology)">Dr. Jones (Neurology)</option>
                    <option value="Dr. Patel (Orthopaedics)">Dr. Patel (Orthopaedics)</option>
                    <option value="Dr. Kumar (General)">Dr. Kumar (General)</option>
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
                  {isSubmitting ? "Processing..." : editingPatient ? "Update Patient Details" : "Generate Token & Check-In"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6 mb-12">
          
          {/* Online Bookings Panel */}
          <div className="w-full xl:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-blue-50/30 flex justify-between items-center relative">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  Online Bookings
                </h2>
                <div className="flex items-center gap-2">
                  {newOnlineCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                      {newOnlineCount}
                    </span>
                  )}
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{onlineBookings.length}</span>
                </div>
              </div>
              
              <div className="p-3 overflow-y-auto max-h-[600px] flex-1">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
                ) : onlineBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center">
                    <Bell size={24} className="mb-2 opacity-30" />
                    No online bookings yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {onlineBookings.map((p, idx) => (
                      <div key={`${p.Name}-${p.Email}-${idx}`} className="border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all bg-white relative group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{p.Name}</h3>
                        </div>
                        <div className="text-xs text-gray-500 flex flex-col gap-1 mb-3">
                          <span className="flex items-center gap-1"><Phone size={12}/> {p.Phone}</span>
                          <span className="flex items-center gap-1 truncate"><Users size={12}/> {p.Doctor}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openWalkInForm(p)} className="flex-1 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-lg py-1.5 text-xs font-bold flex items-center justify-center gap-1">
                            <CheckCircle size={14} /> Check-in
                          </button>
                          <button onClick={() => updateStatus(p, 'No-show')} className="w-8 shrink-0 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg flex items-center justify-center" title="Mark No-show">
                            <UserMinus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Active Queue Table */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search token, name, phone..." 
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <Filter className="text-gray-400" size={16} />
                <span className="text-xs font-semibold text-gray-500">View:</span>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border-none bg-transparent text-sm font-bold text-gray-800 focus:outline-none cursor-pointer py-1"
                >
                  <option value="Active">Active Queue</option>
                  <option value="All">All Patients</option>
                  <option value="Waiting">Waiting</option>
                  <option value="With Doctor">With Doctor</option>
                  <option value="Completed">Completed</option>
                  <option value="No-show">No-show</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap w-24">Token #</th>
                    <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Details</th>
                    <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignment</th>
                    <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Triage</th>
                    <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          Loading queue...
                        </div>
                      </td>
                    </tr>
                  ) : activeQueue.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-500 text-sm font-medium">No patients found for this view.</td>
                    </tr>
                  ) : (
                    activeQueue.map((p, idx) => (
                      <tr key={`${p.Name}-${p.Email}-${idx}`} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors bg-gray-100 px-2 py-1 rounded-md">
                            #{p.token_number || (101 + idx)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            {p.Name || "Unknown Patient"}
                            {p.booking_type === 'Online' && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-700 uppercase">Online</span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-gray-500 my-0.5">
                            {p.Phone} <span className="text-gray-300 font-normal ml-1">• {p.age ? `${p.age}y` : "Age N/A"} / {p.gender ? p.gender.substring(0,1) : "N/A"}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 max-w-[200px] truncate" title={p.reason}>{p.reason || "No symptoms recorded"}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{p.Doctor || "Unassigned"}</div>
                          <div className="text-xs text-gray-500">{p.Date}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md border ${
                            p.triage_priority === 'Emergency' ? 'text-red-700 bg-red-50 border-red-100 shadow-sm' : 
                            p.triage_priority === 'Urgent' ? 'text-orange-700 bg-orange-50 border-orange-100' :
                            'text-gray-700 bg-gray-50 border-gray-200'
                          }`}>
                            {p.triage_priority || 'Normal'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select 
                            value={p.queue_status || 'Waiting'}
                            onChange={(e) => updateStatus(p, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-md border appearance-none outline-none cursor-pointer ${
                              p.queue_status === 'Completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                              p.queue_status === 'With Doctor' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                              p.queue_status === 'No-show' ? 'text-gray-500 bg-gray-100 border-gray-300' :
                              'text-amber-700 bg-amber-50 border-amber-200'
                            }`}
                          >
                            <option value="Waiting">Waiting</option>
                            <option value="With Doctor">With Doctor</option>
                            <option value="Completed">Completed</option>
                            <option value="No-show">No-show</option>
                          </select>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end gap-2">
                            {p.queue_status === 'Completed' && (
                              <div className="flex gap-2">
                                <Link target="_blank" href={`/receipt/${p.Phone}`} className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 flex items-center gap-1 transition-colors">
                                  📄 Receipt
                                </Link>
                                <Link target="_blank" href={`/prescription/${p.Phone}`} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1 transition-colors">
                                  💊 Prescription
                                </Link>
                                <button onClick={() => alert(`Simulated WhatsApp Sent to ${p.Phone}!\n\nTemplate attached PDFs.`)} className="text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded border border-green-200 flex items-center gap-1 transition-colors" title="Resend to WhatsApp">
                                  💬 Resend
                                </button>
                              </div>
                            )}
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openWalkInForm(p)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit Patient">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => { if(window.confirm('Delete this patient record?')) alert('Deletion would be implemented here via Supabase DELETE query.'); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete Entry">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { Stethoscope, ChevronDown, CheckCircle2, User, Activity, FileText, ArrowLeft, Send, Save, History, Phone, AlertCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function DoctorDashboard() {
  const { user, isLoading, logout } = useDoctorAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  
  const [visitHistory, setVisitHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Clinical Vitals & Notes
  const [notes, setNotes] = useState("");
  const [isSavingClinical, setIsSavingClinical] = useState(false);
  const [smsLog, setSmsLog] = useState<string | null>(null);

  // Prescription Form State
  const [medName, setMedName] = useState("");
  const [frequency, setFrequency] = useState("1-0-1 (Morning & Night)");
  const [duration, setDuration] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  const today = new Date().toISOString().split('T')[0];

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
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .eq('Doctor', user.name)
        .eq('Date', today)
        .in('queue_status', ['Waiting', 'With Doctor']);

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.log("Error fetching doctor patients:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchVisitHistory = async (phone: string, currentBookingId: string | undefined) => {
    if (!phone) return;
    setIsHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select(`
          Date, Doctor, diagnosis_notes, weight, "Blood Pressure", temperature, medicines_list
        `)
        .eq('Phone', phone)
        .order('created_at', { ascending: false });

      if (error) {
        console.log("Supabase History Error:", error);
        alert("Error fetching history: " + (error.message || JSON.stringify(error)));
        setVisitHistory([]);
        return;
      }
      
      setVisitHistory(data || []);
    } catch (err: any) {
      console.log("Error fetching history:", err);
      alert("Error fetching history: " + (err.message || JSON.stringify(err)));
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handlePatientSelect = async (p: any) => {
    setSelectedPatient(p);
    setNotes(p.diagnosis_notes || "");
    setMedicines([]);
    setSmsLog(null);
    
    if (p.Phone) {
      fetchVisitHistory(p.Phone, undefined);
    } else {
      setVisitHistory([]);
    }

    // Auto update status to 'With Doctor' if it was 'Waiting'
    if (p.queue_status === 'Waiting') {
      try {
        await supabase
          .from('Booking Appointment')
          .update({ queue_status: 'With Doctor' })
          .eq('Name', p.Name)
          .eq('Email', p.Email || "");
      } catch (err) {
        console.log("Failed to update status to With Doctor:", err);
      }
    }
  };

  const handleSaveClinicalInfo = async () => {
    if (!selectedPatient) return;
    setIsSavingClinical(true);
    try {
      const { error } = await supabase
        .from('Booking Appointment')
        .update({
          diagnosis_notes: notes
        })
        .eq('Name', selectedPatient.Name)
        .eq('Email', selectedPatient.Email || "");
      
      if (error) throw error;
      alert("Clinical notes saved securely!");
    } catch (err) {
      console.log("Error saving clinical info:", err);
      alert("Failed to save notes.");
    } finally {
      setIsSavingClinical(false);
    }
  };

  const handleAddMedicine = () => {
    if (!medName) return;
    setMedicines([...medicines, { name: medName, frequency, duration }]);
    setMedName("");
    setDuration("");
  };

  const handleSendToPharmacy = async () => {
    if (!selectedPatient || medicines.length === 0) return;
    setIsSending(true);
    
    try {
      // 1. Update the booking row directly (No Prescriptions table needed)
      const { error: updateError } = await supabase
        .from('Booking Appointment')
        .update({ 
           queue_status: 'Completed',
           medicines_list: medicines,
           pharmacy_status: 'Pending Dispense'
        })
        .eq('Name', selectedPatient.Name)
        .eq('Email', selectedPatient.Email || "");

      if (updateError) throw updateError;

      // 2. Simulate SMS Notification
      const receiptLink = `${window.location.origin}/receipt/${selectedPatient.Phone}`;
      const prescriptionLink = `${window.location.origin}/prescription/${selectedPatient.Phone}`;
      
      const whatsappMessage = `Hello ${selectedPatient.Name},

Thank you for visiting HOPE SUPER SPECIALITY HOSPITAL.

Your consultation with ${user?.name} has been completed successfully.

Attached are:
📄 [View & Download Hospital Receipt](${receiptLink})
💊 [View & Download Prescription](${prescriptionLink})

Token Number: ${selectedPatient.token_number || 'N/A'}
Consultation Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}

If you have any questions, please contact the hospital.

Wishing you a speedy recovery. 💙`;

      setSmsLog(`WhatsApp Message Sent to ${selectedPatient.Phone || 'N/A'}:\n\n${whatsappMessage}`);
      
      setTimeout(() => {
        setIsSending(false);
        setMedicines([]);
        setSelectedPatient(null);
      }, 5000);

    } catch (err: any) {
      console.log("Error sending prescription:", err);
      alert("Failed to send prescription: " + err.message);
      setIsSending(false);
    }
  };

  // Memoized sorted patients
  const sortedPatients = useMemo(() => {
    const triageValue = (t: string) => {
      if (t === 'Emergency') return 3;
      if (t === 'Urgent') return 2;
      return 1;
    };
    return [...patients].sort((a, b) => {
      const tA = triageValue(a.triage_priority);
      const tB = triageValue(b.triage_priority);
      if (tA !== tB) return tB - tA;
      return new Date(a.created_at || new Date()).getTime() - new Date(b.created_at || new Date()).getTime();
    });
  }, [patients]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-primary font-semibold">Verifying secure session...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1500px]">
        
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
            <p className="text-gray-500 text-sm">Review visit history, record vitals, and dispatch prescriptions to the pharmacy directly via Token Number.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">Active Doctor:</span>
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
          <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 min-h-[500px] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Today's Queue</h3>
                  <p className="text-[11px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">Room {user.room}</p>
                </div>
                <div className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {sortedPatients.length} Waiting
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto bg-gray-50/30">
                {isFetching ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : sortedPatients.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <p className="text-gray-400 text-sm font-medium">No patients waiting in queue.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedPatients.map((p, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handlePatientSelect(p)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPatient?.Name === p.Name 
                            ? "border-emerald-500 bg-emerald-50 shadow-md transform scale-[1.02]" 
                            : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 text-sm">{p.Name}</h4>
                          <span className="text-xs font-black text-gray-800 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">#{p.token_number || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-2">
                          <span className={`inline-flex self-start items-center text-[10px] font-bold px-2 py-0.5 rounded border ${
                            p.triage_priority === 'Emergency' ? 'text-red-700 bg-red-50 border-red-100' : 
                            p.triage_priority === 'Urgent' ? 'text-orange-700 bg-orange-50 border-orange-100' :
                            'text-gray-600 bg-gray-100 border-gray-200'
                          }`}>
                            {p.triage_priority || 'Normal'}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">{p.reason || "No symptoms recorded"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Patient Details */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full min-h-[600px] flex items-center justify-center relative overflow-hidden">
              
              {!selectedPatient ? (
                <div className="text-center max-w-sm flex flex-col items-center p-8">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 text-gray-300 border-2 border-dashed border-gray-200">
                    <Stethoscope size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Consultation</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Select a patient from your queue on the left to review their visit history, record vitals, and issue e-prescriptions.
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col overflow-hidden animate-in fade-in duration-300">
                  {/* Selected Patient Header */}
                  <div className="bg-[#0B1B36] p-6 text-white border-b border-[#1a2c4e] shrink-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-extrabold">{selectedPatient.Name}</h2>
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded">Token #{selectedPatient.token_number || 'N/A'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-400 mt-2">
                          <span className="flex items-center gap-1.5"><User size={14} /> {selectedPatient.age ? `${selectedPatient.age}y` : "Age N/A"} / {selectedPatient.gender || "N/A"}</span>
                          <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedPatient.Phone || "N/A"}</span>
                          {selectedPatient.Email && <span className="flex items-center gap-1.5"><FileText size={14} /> {selectedPatient.Email}</span>}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-inner">
                          <Activity size={14} /> Active Consultation
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Consultation Area */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col xl:flex-row gap-6 bg-slate-50/50">
                    
                    {/* Left Panel: History & Vitals */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">
                      
                      {/* Vitals & Intake info */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle size={16} className="text-orange-500"/>
                          Intake Reason & Vitals
                        </h3>
                        <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg mb-4">
                          <p className="text-sm font-semibold text-gray-800">Chief Complaint:</p>
                          <p className="text-sm text-gray-600 mt-1">{selectedPatient.reason || "None recorded."}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 border border-gray-100 p-2 rounded-lg">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Weight</label>
                            <p className="text-sm font-semibold text-gray-900">{selectedPatient.weight ? `${selectedPatient.weight} kg` : "N/A"}</p>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 p-2 rounded-lg">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Blood Pressure</label>
                            <p className="text-sm font-semibold text-gray-900">{selectedPatient["Blood Pressure"] ? `${selectedPatient["Blood Pressure"]} mmHg` : "N/A"}</p>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 p-2 rounded-lg">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Temperature</label>
                            <p className="text-sm font-semibold text-gray-900">{selectedPatient.temperature ? `${selectedPatient.temperature}` : "N/A"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Diagnosis & Clinical Notes</label>
                          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Enter your findings here..." className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"></textarea>
                        </div>
                        <div className="mt-3 text-right">
                          <button onClick={handleSaveClinicalInfo} disabled={isSavingClinical} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-1.5 rounded-lg text-xs shadow-sm flex items-center justify-center gap-2 ml-auto transition-colors disabled:opacity-50">
                            <Save size={14} /> {isSavingClinical ? "Saving..." : "Save Notes"}
                          </button>
                        </div>
                      </div>

                      {/* Visit History */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-[250px]">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <History size={16} className="text-blue-500"/>
                          Past Visit History
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                          {isHistoryLoading ? (
                            <p className="text-xs text-gray-400">Loading history...</p>
                          ) : visitHistory.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                              <p className="text-xs text-gray-400">No past visits recorded for this patient.</p>
                            </div>
                          ) : (
                            visitHistory.map((hist, idx) => (
                              <div key={idx} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 text-sm">
                                <div className="flex justify-between font-bold text-gray-800 mb-1">
                                  <span>{hist.Date}</span>
                                  <span className="text-xs text-gray-500 font-normal">Dr. {hist.Doctor}</span>
                                </div>
                                {(hist.weight || hist["Blood Pressure"] || hist.temperature) && (
                                  <p className="text-xs text-gray-500 mb-1">Vitals: {[hist.weight && `${hist.weight}`, hist["Blood Pressure"] && `${hist["Blood Pressure"]} mmHg`, hist.temperature].filter(Boolean).join(' • ')}</p>
                                )}
                                {hist.diagnosis_notes && (
                                  <p className="text-xs text-gray-700 mt-1 mb-2">"{hist.diagnosis_notes}"</p>
                                )}
                                {hist.medicines_list && hist.medicines_list.length > 0 && (
                                  <div className="mt-2 bg-white border border-gray-100 rounded p-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Prescribed Medicines</p>
                                    <ul className="list-disc pl-4 text-xs text-gray-600">
                                      {hist.medicines_list.map((m:any, i:number) => (
                                        <li key={i}>{m.name} ({m.frequency})</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right Panel: Prescription Engine */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="bg-white rounded-xl border border-emerald-100 shadow-sm flex flex-col h-full overflow-hidden">
                        
                        {/* Prescription Form */}
                        <div className="p-5 border-b border-emerald-50 bg-emerald-50/30">
                          <h3 className="text-sm font-bold text-emerald-800 mb-4 flex items-center gap-2">
                            <Activity size={16} /> e-Prescription Engine
                          </h3>
                          
                          <div className="space-y-3 mb-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Medicine Name</label>
                              <input type="text" value={medName} onChange={(e) => setMedName(e.target.value)} className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="e.g. Paracetamol 500mg" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Frequency</label>
                                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                                  <option>1-0-1 (Morning & Night)</option>
                                  <option>1-1-1 (Three times a day)</option>
                                  <option>1-0-0 (Morning only)</option>
                                  <option>0-0-1 (Night only)</option>
                                  <option>SOS (As needed)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Duration</label>
                                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="e.g. 5 Days" />
                              </div>
                            </div>
                          </div>
                          
                          <button onClick={handleAddMedicine} className="w-full py-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors shadow-sm">
                            + Add to Prescription
                          </button>
                        </div>

                        {/* Added Medicines List */}
                        <div className="flex-1 p-5 overflow-y-auto bg-white">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Prescription Cart ({medicines.length})</h4>
                          {medicines.length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-xs text-gray-400">No medicines added yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {medicines.map((m, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg">
                                  <div>
                                    <p className="font-bold text-sm text-gray-900">{m.name}</p>
                                    <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{m.frequency} • {m.duration}</p>
                                  </div>
                                  <button onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded p-1">
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Simulated SMS Log */}
                        {smsLog && (
                          <div className="mx-5 mb-4 p-3 bg-[#0B1B36] rounded-lg border border-[#1a2c4e] animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 text-emerald-400 mb-1">
                              <MessageSquare size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Dispatched</span>
                            </div>
                            <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{smsLog}</p>
                          </div>
                        )}

                        {/* Footer Actions */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <button 
                            onClick={handleSendToPharmacy}
                            disabled={medicines.length === 0 || isSending}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                          >
                            {isSending ? (
                              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                            ) : (
                              <><Send size={16} /> Complete & Send to Pharmacy</>
                            )}
                          </button>
                          <p className="text-[10px] text-center text-gray-400 font-semibold mt-3">
                            This action completes the consultation and removes the patient from your queue.
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#0B1B36] py-3 text-center border-t border-[#1a2c4e] mt-auto shrink-0 z-10">
        <p className="text-[10px] text-gray-500 font-semibold tracking-wider flex items-center justify-center gap-4">
          AuraCare Hospital OS • Clinical Engine
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          Paperless Hospital Workflow
        </p>
      </footer>
    </div>
  );
}

"use client"
import React, { useState, useEffect } from 'react'
import { Search, Filter, Eye, FileText } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function PatientsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [allVisits, setAllVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterGender, setFilterGender] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [historyPatient, setHistoryPatient] = useState<any>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Deduplicate patients by Name and Phone if you only want unique patient profiles,
      // but to show all visits, we can just list them or group them. 
      // Let's just list all unique patients based on their latest visit.
      
      const uniquePatientsMap = new Map();
      (data || []).forEach(apt => {
        const key = `${apt.Name}-${apt.Phone}`;
        if (!uniquePatientsMap.has(key)) {
          uniquePatientsMap.set(key, apt);
        }
      });
      
      setAllVisits(data || []);
      setPatients(Array.from(uniquePatientsMap.values()));
    } catch (error) {
      console.log("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.Phone?.toString().includes(searchTerm) ||
                          p.token_number?.toString().includes(searchTerm);
                          
    const pGender = p.gender || "N/A";
    const matchesGender = filterGender === 'All' || pGender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Registry</h1>
          <p className="text-sm text-slate-500">Live database of all patients registered by Reception.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Phone, or Token..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500 text-slate-700 font-medium"
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Token / ID</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Age/Gender</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Loading live patient data...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => (
                  <tr key={patient.id || `pat-${idx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      TKN-{patient.token_number || patient.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {patient.Name}
                      <div className="text-xs text-slate-500 font-normal mt-0.5">{patient.Phone || "No Phone"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {patient.age ? `${patient.age} Yrs` : "N/A"} / {patient.gender || "N/A"}
                    </td>
                    <td className="px-6 py-4">{patient.Date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${patient.queue_status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                          patient.queue_status === 'In Consultation' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {patient.queue_status || 'Registered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedPatient(patient)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => setHistoryPatient(patient)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                        title="View Medical Records"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedPatient(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                  {(selectedPatient.Name || 'P').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedPatient.Name}</h2>
                  <p className="text-sm font-medium text-slate-500">Token ID: TKN-{selectedPatient.token_number || selectedPatient.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-700 p-2 rounded-md hover:bg-slate-200 transition-colors">
                <span className="sr-only">Close</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-white space-y-8">
              {/* Personal Details */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Age / Gender</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.age || 'N/A'} Yrs / {selectedPatient.gender || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.Phone || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 md:col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-900 truncate">{selectedPatient.Email || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 md:col-span-2">
                    <p className="text-xs text-slate-500 mb-1">City / Location</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.city || 'N/A'}</p>
                  </div>
                </div>
              </section>

              {/* Visit Details */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Visit Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 mb-1">Date</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.Date}</p>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 mb-1">Department</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.Department || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 md:col-span-2">
                    <p className="text-xs text-blue-600 mb-1">Doctor</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.Doctor || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Visit Type</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.booking_type || 'Walk-In'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Triage Priority</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.triage_priority || 'Standard'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 md:col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Reason for Visit</p>
                    <p className="font-semibold text-slate-900">{selectedPatient.reason || 'N/A'}</p>
                  </div>
                </div>
              </section>

              {/* Status Section */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Tracking Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Queue</p>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-200 text-slate-700">{selectedPatient.queue_status || 'Registered'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pharmacy</p>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-200 text-slate-700">{selectedPatient.pharmacy_status || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Billing</p>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-200 text-slate-700">{selectedPatient.payment_status || 'Unpaid'}</span>
                  </div>
                </div>
              </section>

              {/* Vitals & Medical */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Medical History & Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <p className="text-xs text-rose-600 mb-1">Blood Pressure</p>
                    <p className="font-bold text-slate-900">{selectedPatient['Blood Pressure'] || selectedPatient.vitals_bp || 'N/A'}</p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <p className="text-xs text-rose-600 mb-1">Temperature</p>
                    <p className="font-bold text-slate-900">{selectedPatient.temperature || 'N/A'}</p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <p className="text-xs text-rose-600 mb-1">Weight</p>
                    <p className="font-bold text-slate-900">{selectedPatient.weight || selectedPatient.vitals_weight || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Doctor's Diagnosis / Notes</p>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedPatient.diagnosis_notes || 'No diagnosis notes provided yet.'}</p>
                  </div>
                  
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Prescribed Medicines</p>
                    {selectedPatient.medicines_list ? (
                      <p className="text-sm text-slate-800 whitespace-pre-wrap font-medium">{selectedPatient.medicines_list}</p>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No medicines prescribed.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 text-right">
              <button 
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical History Modal */}
      {historyPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setHistoryPatient(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Medical Records History</h2>
                <p className="text-sm font-medium text-slate-500">
                  Showing all recorded visits for <span className="font-bold text-emerald-700">{historyPatient.Name}</span>
                </p>
              </div>
              <button onClick={() => setHistoryPatient(null)} className="text-slate-400 hover:text-slate-700 p-2 rounded-md hover:bg-slate-200 transition-colors">
                <span className="sr-only">Close</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50 space-y-6">
              {allVisits
                .filter(v => v.Name === historyPatient.Name && v.Phone === historyPatient.Phone)
                .map((visit, idx) => (
                  <div key={visit.id || idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 text-white px-5 py-3 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{visit.Date}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">{visit.Department}</span>
                      </div>
                      <span className="text-sm font-medium">Dr. {visit.Doctor || 'Unassigned'}</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vitals & Symptoms</h4>
                        <ul className="space-y-1 text-sm text-slate-700">
                          <li><span className="font-semibold">Reason:</span> {visit.reason || 'N/A'}</li>
                          <li><span className="font-semibold">BP:</span> {visit['Blood Pressure'] || visit.vitals_bp || 'N/A'}</li>
                          <li><span className="font-semibold">Weight:</span> {visit.weight || visit.vitals_weight || 'N/A'}</li>
                          <li><span className="font-semibold">Temp:</span> {visit.temperature || 'N/A'}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Diagnosis & Treatment</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-slate-800 font-medium whitespace-pre-wrap">{visit.diagnosis_notes || 'No notes available.'}</p>
                          </div>
                          {visit.medicines_list && (
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                              <p className="text-xs font-bold text-emerald-700 mb-1">Prescription:</p>
                              <p className="text-sm text-emerald-900 font-medium whitespace-pre-wrap">{visit.medicines_list}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 text-right">
              <button 
                onClick={() => setHistoryPatient(null)}
                className="px-5 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close Records
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

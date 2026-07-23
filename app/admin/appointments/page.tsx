"use client"
import React, { useState, useEffect } from 'react'
import { CalendarDays, Filter, Search, Plus, Eye, X, Activity, Pill, User } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function AppointmentsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.log("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.Doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.token_number?.toString().includes(searchTerm);
                          
    const status = apt.queue_status || 'Waiting';
    const matchesStatus = filterStatus === 'All' || status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments Master</h1>
          <p className="text-sm text-slate-500">Live view of all hospital appointments.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Patient Name, Doctor, or Token..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500 transition-colors" 
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500 text-slate-700 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Waiting">Waiting</option>
          <option value="In Consultation">In Consultation</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Token ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor & Dept</th>
                <th className="px-6 py-4">Schedule Date</th>
                <th className="px-6 py-4">Booking Type</th>
                <th className="px-6 py-4">Queue Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Loading live appointments data...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt, idx) => (
                  <tr key={apt.id || `apt-${idx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">TKN-{apt.token_number || apt.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {apt.Name}
                      <div className="text-xs text-slate-500 font-normal mt-0.5">{apt.Phone || "No Phone"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {apt.Doctor || "Unassigned"} 
                      <span className="text-xs text-slate-500 block mt-0.5">{apt.Department || "General"}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{apt.Date}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {apt.booking_type || "Walk-in"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${apt.queue_status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                          apt.queue_status === 'In Consultation' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {apt.queue_status || 'Waiting'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedApt(apt)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedApt(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                  {selectedApt.Name ? selectedApt.Name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedApt.Name || 'Unknown Patient'}</h2>
                  <p className="text-sm font-medium text-slate-500">Token: TKN-{selectedApt.token_number || selectedApt.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedApt(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Patient Info */}
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 mb-3 uppercase tracking-wider">
                  <User size={16} /> Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Phone Number</p>
                    <p className="font-semibold text-slate-900">{selectedApt.Phone || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Booking Type</p>
                    <p className="font-semibold text-slate-900">{selectedApt.booking_type || 'Walk-in'}</p>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 mb-3 uppercase tracking-wider">
                  <Activity size={16} /> Consultation Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Assigned Doctor</p>
                    <p className="font-semibold text-slate-900">Dr. {selectedApt.Doctor || 'Unassigned'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Department</p>
                    <p className="font-semibold text-slate-900">{selectedApt.Department || 'General'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Queue Status</p>
                    <p className="font-semibold text-blue-600">{selectedApt.queue_status || 'Waiting'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Payment Status</p>
                    <p className={`font-semibold ${selectedApt.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedApt.payment_status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pharmacy & Medication */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 mb-3 uppercase tracking-wider">
                  <Pill size={16} /> Medication & Pharmacy
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-slate-700">Pharmacy Status</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold 
                      ${selectedApt.pharmacy_status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-800' : 
                        selectedApt.pharmacy_status === 'Pending Dispense' ? 'bg-amber-100 text-amber-800' : 
                        'bg-slate-200 text-slate-600'}`}>
                      {selectedApt.pharmacy_status || 'No Prescription Sent'}
                    </span>
                  </div>
                  {selectedApt.prescription_details && (
                    <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm text-slate-700 whitespace-pre-wrap font-mono">
                      {selectedApt.prescription_details}
                    </div>
                  )}
                </div>
              </div>

            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
              <button 
                onClick={() => setSelectedApt(null)}
                className="px-5 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

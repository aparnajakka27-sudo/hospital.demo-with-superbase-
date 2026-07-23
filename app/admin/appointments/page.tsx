"use client"
import React, { useState, useEffect } from 'react'
import { CalendarDays, Filter, Search, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AppointmentsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    apt.Doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.token_number?.toString().includes(searchTerm)
  );

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
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors">
          <Filter size={16} /> Filters
        </button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Loading live appointments data...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

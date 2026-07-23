"use client"
import React, { useState, useEffect } from 'react'
import { Search, Filter, Eye, FileText } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function PatientsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterGender, setFilterGender] = useState('All');

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
      
      setPatients(Array.from(uniquePatientsMap.values()));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.Phone?.includes(searchTerm) ||
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
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                        <Eye size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Medical Records">
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
    </div>
  )
}

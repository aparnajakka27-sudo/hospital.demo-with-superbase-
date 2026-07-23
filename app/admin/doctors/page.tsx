"use client"
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Filter,
  X
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function DoctorsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patientCounts, setPatientCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  
  // New Doctor Form State
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialization: '',
    userId: '',
    password: '',
    room: '',
    experience: '',
    salary: '',
    available_days: 'Mon-Fri'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Doctors
      const { data: docs, error: docError } = await supabase
        .from('Doctors')
        .select('*');
        
      if (docError) throw docError;
      setDoctors(docs || []);

      const { data: depts } = await supabase.from('departments').select('name');
      if (depts) setDepartments(depts);

      // 2. Fetch Appointments to count patients per doctor
      const { data: appts, error: apptError } = await supabase
        .from('Booking Appointment')
        .select('Doctor');
        
      if (!apptError && appts) {
        const counts: Record<string, number> = {};
        appts.forEach(a => {
          if (a.Doctor) {
            counts[a.Doctor] = (counts[a.Doctor] || 0) + 1;
          }
        });
        setPatientCounts(counts);
      }
    } catch (error) {
      console.log("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      // Insert into Doctors table
      const { error } = await supabase.from('Doctors').insert([
        {
          "Doctor Name": newDoc.name,
          "Specialization": newDoc.specialization,
          "User Id": newDoc.userId,
          "Password": newDoc.password,
          "Room": newDoc.room
        }
      ]);

      if (error) throw error;

      // Success
      setIsModalOpen(false);
      setNewDoc({ name: '', specialization: '', userId: '', password: '', room: '', experience: '', salary: '', available_days: 'Mon-Fri' });
      fetchData(); // Refresh list
    } catch (err: any) {
      setFormError(err.message || 'Failed to add doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDoctor = async (id: any) => {
    if (!confirm('Are you sure you want to remove this doctor?')) return;
    try {
      const { error } = await supabase.from('Doctors').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Error deleting doctor: " + err.message);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const name = doc['Doctor Name'] || doc.name || '';
    const spec = doc.Specialization || doc.specialty || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           spec.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Management</h1>
          <p className="text-sm text-slate-500">Manage hospital doctors, their profiles, and logins.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0a4d40] hover:bg-[#073a30] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add New Doctor
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or specialization..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Total Patients</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading live doctors data...</td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No doctors found.</td>
                </tr>
              ) : (
                filteredDoctors.map((doc, index) => {
                  const name = doc['Doctor Name'] || doc.name || 'Unknown';
                  const spec = doc.Specialization || doc.specialty || 'General';
                  const initials = name.split(' ').map((n: string) => n[0]).join('').replace('D', '').replace('.', '').substring(0, 2);
                  const patientCount = patientCounts[name] || 0;

                  return (
                    <tr key={doc.id || index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{name}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {spec}
                      </td>
                      <td className="px-6 py-4">
                        {patientCount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedDoctor(doc)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-900">Add New Doctor</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {formError}
                </div>
              )}
              
              <form id="add-doctor-form" onSubmit={handleAddDoctor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name (e.g. Dr. John Doe)</label>
                  <input 
                    required 
                    type="text" 
                    value={newDoc.name}
                    onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department / Specialization</label>
                  <input 
                    required 
                    type="text"
                    list="departments-list"
                    placeholder="Select or type department"
                    value={newDoc.specialization}
                    onChange={e => setNewDoc({...newDoc, specialization: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                  />
                  <datalist id="departments-list">
                    {departments.map((d, i) => (
                      <option key={i} value={d.name} />
                    ))}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                    <input 
                      type="text" 
                      value={newDoc.experience}
                      onChange={e => setNewDoc({...newDoc, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salary (₹)</label>
                    <input 
                      type="text" 
                      value={newDoc.salary}
                      onChange={e => setNewDoc({...newDoc, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Room</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. OPD-105"
                      value={newDoc.room}
                      onChange={e => setNewDoc({...newDoc, room: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Available Days</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mon-Fri"
                      value={newDoc.available_days}
                      onChange={e => setNewDoc({...newDoc, available_days: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-2">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Login Credentials</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                      <input 
                        required 
                        type="text" 
                        value={newDoc.userId}
                        onChange={e => setNewDoc({...newDoc, userId: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <input 
                          required 
                          type={showPassword ? "text" : "password"} 
                          value={newDoc.password}
                          onChange={e => setNewDoc({...newDoc, password: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="add-doctor-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#0a4d40] text-white rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : 'Save Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                  {(selectedDoctor['Doctor Name'] || selectedDoctor.name || 'U').split(' ').map((n: string) => n[0]).join('').replace('D', '').replace('.', '').substring(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedDoctor['Doctor Name'] || selectedDoctor.name}</h2>
                  <p className="text-sm font-medium text-emerald-600">{selectedDoctor.Specialization || selectedDoctor.specialty}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Room / Cabin</p>
                  <p className="text-slate-900 font-bold">{selectedDoctor.Room || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-emerald-600 font-bold">{selectedDoctor.Status || 'Active'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">User ID (Login)</p>
                  <p className="text-slate-900 font-mono font-medium">{selectedDoctor['User Id'] || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Patients</p>
                  <p className="text-slate-900 font-bold">{patientCounts[selectedDoctor['Doctor Name'] || selectedDoctor.name] || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-slate-900 font-bold">{selectedDoctor.Experience || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Salary</p>
                  <p className="text-slate-900 font-bold">{selectedDoctor.Salary ? `₹${selectedDoctor.Salary}` : 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Availability</p>
                  <p className="text-slate-900 font-bold">{selectedDoctor.Available_Days || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
              <button 
                onClick={() => setSelectedDoctor(null)}
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

"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Eye, X } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: '', shift: '', phone: '', salary: '', experience: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) console.log("Supabase fetch error:", error.message || error);
      setStaff(data || []);
    } catch (err: any) {
      console.log("Exception in fetchStaff:", err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('staff').insert([{ ...newStaff, status: 'Active' }]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewStaff({ name: '', role: '', department: '', shift: '', phone: '', salary: '', experience: '' });
      fetchStaff();
    } catch (err: any) {
      alert("Error adding staff: " + err.message);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await supabase.from('staff').delete().eq('id', id);
      fetchStaff();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Directory</h1>
          <p className="text-sm text-slate-500">Live database of hospital staff and employees.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30]">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">Loading live staff data...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">No staff added yet.</td></tr>
            ) : (
              staff.map((s, index) => (
                <tr key={s.id || index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-6 py-4">{s.role}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedStaff(s)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => deleteStaff(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Staff">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Staff</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select required value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]">
                  <option value="" disabled>Select Role</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Head Nurse">Head Nurse</option>
                  <option value="Technician">Technician</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Janitor">Janitor</option>
                  <option value="Security">Security</option>
                  <option value="Admin">Admin</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select required value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]">
                  <option value="" disabled>Select Department</option>
                  <option value="General Ward">General Ward</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency (ER)">Emergency (ER)</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Billing">Billing</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Radiology">Radiology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <select required value={newStaff.shift} onChange={e => setNewStaff({...newStaff, shift: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]">
                  <option value="" disabled>Select Shift</option>
                  <option value="Morning">Morning (08:00 - 16:00)</option>
                  <option value="Evening">Evening (16:00 - 00:00)</option>
                  <option value="Night">Night (00:00 - 08:00)</option>
                  <option value="Flexible">Flexible / On Call</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                  <input type="text" value={newStaff.experience} onChange={e => setNewStaff({...newStaff, experience: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salary (₹)</label>
                  <input type="text" value={newStaff.salary} onChange={e => setNewStaff({...newStaff, salary: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0a4d40] text-white rounded-lg font-medium hover:bg-[#073a30]">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedStaff(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                  {(selectedStaff.name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedStaff.name}</h2>
                  <p className="text-sm font-medium text-blue-600">{selectedStaff.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.department || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Shift</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.shift || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-emerald-600 font-bold">{selectedStaff.status || 'Active'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date Joined</p>
                  <p className="text-slate-900 font-bold">
                    {selectedStaff.created_at ? new Date(selectedStaff.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.experience || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Salary</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.salary ? `₹${selectedStaff.salary}` : 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
              <button 
                onClick={() => setSelectedStaff(null)}
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

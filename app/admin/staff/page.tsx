"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Eye, X, EyeOff } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [newStaff, setNewStaff] = useState({ 
    name: '', 
    role: '', 
    department: '', 
    shift: '', 
    experience: '',
    salary: '',
    userId: '',
    password: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('Staff').select('*');
      if (error) throw error;
      setStaff(data || []);
    } catch (err: any) {
      console.log("Exception in fetchStaff:", err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        "Name": newStaff.name,
        "Role": newStaff.role,
        "Department": newStaff.department,
        "Shift": newStaff.shift,
        "Experience": newStaff.experience,
        "Salary": newStaff.salary ? parseFloat(newStaff.salary) : null,
        "User Id": newStaff.userId,
        "Password": newStaff.password,
        "Status": 'Active'
      };

      const { error } = await supabase.from('Staff').insert([payload]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setNewStaff({ name: '', role: '', department: '', shift: '', experience: '', salary: '', userId: '', password: '' });
      fetchStaff();
    } catch (err: any) {
      alert("Error adding staff: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const { error } = await supabase.from('Staff').delete().eq('id', id);
      if (error) throw error;
      fetchStaff();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-sm text-slate-500">Live database of hospital staff and non-medical employees.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30] shadow-sm transition-colors">
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading live staff data...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No staff added yet.</td></tr>
            ) : (
              staff.map((s, index) => (
                <tr key={s.id || index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{s.Name}</td>
                  <td className="px-6 py-4 font-medium text-blue-700">{s.Role}</td>
                  <td className="px-6 py-4">{s.Shift}</td>
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

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">Add Staff Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-1 pr-2">
              <form id="add-staff-form" onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Staff Role</label>
                  <select required value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900 bg-white">
                    <option value="" disabled>Select Role</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Head Nurse">Head Nurse</option>
                    <option value="Technician">Technician</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Janitor">Janitor</option>
                    <option value="Security">Security</option>
                    <option value="Admin Staff">Admin Staff</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Area / Department (Optional)</label>
                  <input type="text" placeholder="e.g. ICU, Front Desk, General Ward" value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Shift</label>
                  <select required value={newStaff.shift} onChange={e => setNewStaff({...newStaff, shift: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900 bg-white">
                    <option value="" disabled>Select Shift</option>
                    <option value="Morning">Morning (08:00 - 16:00)</option>
                    <option value="Evening">Evening (16:00 - 00:00)</option>
                    <option value="Night">Night (00:00 - 08:00)</option>
                    <option value="Flexible">Flexible / On Call</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Experience (Years)</label>
                    <input type="text" value={newStaff.experience} onChange={e => setNewStaff({...newStaff, experience: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Salary (₹)</label>
                    <input type="number" value={newStaff.salary} onChange={e => setNewStaff({...newStaff, salary: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Portal Access (For Receptionists, Pharmacists)</h3>
                  <p className="text-xs text-slate-500 mb-4">Leave blank if this staff member does not need to log in.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">User ID</label>
                      <input type="text" placeholder="e.g. rec_01" value={newStaff.userId} onChange={e => setNewStaff({...newStaff, userId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={newStaff.password} 
                          onChange={e => setNewStaff({...newStaff, password: e.target.value})} 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40] text-slate-900 pr-10" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold transition-colors">Cancel</button>
              <button type="submit" form="add-staff-form" disabled={isSubmitting} className="px-5 py-2 bg-[#0a4d40] text-white rounded-lg font-bold hover:bg-[#073a30] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</> : 'Save Staff'}
              </button>
            </div>
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
                  {(selectedStaff.Name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedStaff.Name}</h2>
                  <p className="text-sm font-bold text-blue-600">{selectedStaff.Role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Area</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.Department || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-emerald-600 font-bold">{selectedStaff.Status || 'Active'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Shift</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.Shift || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.Experience || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Salary</p>
                  <p className="text-slate-900 font-bold">{selectedStaff.Salary ? `₹${selectedStaff.Salary}` : 'N/A'}</p>
                </div>
                
                {/* Credentials Section */}
                <div className="col-span-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Portal Credentials (Admin View)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">User ID</p>
                      <p className="text-slate-900 font-mono font-medium">{selectedStaff['User Id'] || 'No Access'}</p>
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Password</p>
                      <p className="text-slate-900 font-mono font-medium">{selectedStaff.Password || 'No Access'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

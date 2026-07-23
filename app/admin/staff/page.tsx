"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: '', shift: '', phone: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) console.error(error);
      setStaff(data || []);
    } catch (error) {
      console.error(error);
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
      setNewStaff({ name: '', role: '', department: '', shift: '', phone: '' });
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
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">Loading live staff data...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">No staff added yet.</td></tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-6 py-4">{s.role}</td>
                  <td className="px-6 py-4">{s.department}</td>
                  <td className="px-6 py-4">{s.shift}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteStaff(s.id)} className="text-slate-400 hover:text-red-600 p-1.5"><Trash2 size={18} /></button>
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
            <h2 className="text-lg font-bold mb-4">Add Staff</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role (e.g. Nurse)</label>
                <input required type="text" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input required type="text" value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <input required type="text" value={newStaff.shift} onChange={e => setNewStaff({...newStaff, shift: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0a4d40] text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

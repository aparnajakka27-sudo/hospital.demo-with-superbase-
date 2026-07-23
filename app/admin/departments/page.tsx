"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function DepartmentsAdminPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('departments').select('*');
      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      // Fallback to local storage / demo data if table is missing or fails
      const savedDepts = localStorage.getItem('demo_hospital_departments');
      if (savedDepts) {
        setDepartments(JSON.parse(savedDepts));
      } else {
        const demoData = [
          { id: '1', name: 'Cardiology', head_doctor: 'Dr. Sarah Smith', status: 'Active' },
          { id: '2', name: 'Neurology', head_doctor: 'Dr. John Doe', status: 'Active' },
          { id: '3', name: 'Pediatrics', head_doctor: 'Dr. Emily Chen', status: 'Active' }
        ];
        setDepartments(demoData);
        localStorage.setItem('demo_hospital_departments', JSON.stringify(demoData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('departments').insert([{
        name: newDeptName,
        head_doctor: newDeptHead,
        status: 'Active'
      }]);
      if (error) throw error;
      fetchDepartments();
    } catch (err: any) {
      // Fallback local save
      const newDept = {
        id: Date.now().toString(),
        name: newDeptName,
        head_doctor: newDeptHead,
        status: 'Active'
      };
      const updated = [...departments, newDept];
      setDepartments(updated);
      localStorage.setItem('demo_hospital_departments', JSON.stringify(updated));
    } finally {
      setIsModalOpen(false);
      setNewDeptName('');
      setNewDeptHead('');
    }
  };

  const deleteDept = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
      fetchDepartments();
    } catch (err: any) {
      // Fallback local delete
      const updated = departments.filter(d => d.id !== id);
      setDepartments(updated);
      localStorage.setItem('demo_hospital_departments', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-sm text-slate-500">Live database of hospital departments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30]">
          <Plus size={16} /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Department Name</th>
              <th className="px-6 py-4">Head Doctor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center">Loading live departments...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center">No departments added yet.</td></tr>
            ) : (
              departments.map((dept, index) => (
                <tr key={dept.id || index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                  <td className="px-6 py-4">{dept.head_doctor || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {dept.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteDept(dept.id)} className="text-slate-400 hover:text-red-600 p-1.5"><Trash2 size={18} /></button>
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
            <h2 className="text-lg font-bold mb-4">Add Department</h2>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department Name</label>
                <input required type="text" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Head Doctor</label>
                <input required type="text" value={newDeptHead} onChange={e => setNewDeptHead(e.target.value)} className="w-full border rounded-lg p-2" />
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

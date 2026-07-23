"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Users, Award } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function DepartmentsAdminPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch departments
      const { data: depts, error: deptError } = await supabase.from('Departments').select('Names');
      if (deptError) throw deptError;
      
      // Fetch doctors
      const { data: docs, error: docError } = await supabase.from('Doctors').select('*');
      if (docError) throw docError;
      
      setDepartments(depts || []);
      setDoctors(docs || []);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('Departments').insert([{
        Names: newDeptName
      }]);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Failed to add department");
    } finally {
      setIsModalOpen(false);
      setNewDeptName('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-sm text-slate-500">View departments, Head of Departments, and assigned doctors.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors shadow-sm">
          <Plus size={16} /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500">Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">No departments found.</div>
        ) : (
          departments.map((dept, index) => {
            const deptName = dept.Names;
            // Get all doctors for this department
            const deptDocs = doctors.filter(d => (d.Deparment || d.Specialization) === deptName);
            // Find the Head Doctor
            const headDoc = deptDocs.find(d => d.Is_Head);
            // Regular doctors
            const regularDocs = deptDocs.filter(d => !d.Is_Head);

            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <h2 className="text-lg font-bold text-slate-900">{deptName}</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    {deptDocs.length} Doctor{deptDocs.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="p-5 flex-1 flex flex-col gap-6">
                  {/* Head Doctor Section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Award size={14} className="text-amber-500" />
                      Head of Department
                    </h3>
                    {headDoc ? (
                      <div className="flex items-center gap-3 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {(headDoc.Name || headDoc['Doctor Name'] || 'H').split(' ').map((n: string) => n[0]).join('').replace('D', '').replace('.', '').substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{headDoc.Name || headDoc['Doctor Name']}</p>
                          <p className="text-xs font-medium text-amber-700">Main HOD</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic px-2">No Head of Department assigned yet.</p>
                    )}
                  </div>

                  {/* Other Doctors Section */}
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users size={14} />
                      Department Doctors
                    </h3>
                    {regularDocs.length > 0 ? (
                      <div className="space-y-2 overflow-y-auto max-h-[200px] pr-2">
                        {regularDocs.map((doc, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {(doc.Name || doc['Doctor Name'] || 'D').split(' ').map((n: string) => n[0]).join('').replace('D', '').replace('.', '').substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{doc.Name || doc['Doctor Name']}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic px-2">No other doctors assigned.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6 overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Add New Department</h2>
            <form onSubmit={handleAddDept} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department Name</label>
                <input 
                  required 
                  type="text" 
                  value={newDeptName} 
                  onChange={e => setNewDeptName(e.target.value)} 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="e.g. Pediatrics"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#0a4d40] text-white rounded-lg text-sm font-bold hover:bg-[#073a30] transition-colors shadow-sm">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

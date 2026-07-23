"use client"
import React, { useState, useEffect } from 'react'
import { BedDouble, Plus, Edit2, AlertCircle, Trash2, X, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function BedsAdminPage() {
  const [wards, setWards] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isWardModalOpen, setIsWardModalOpen] = useState(false);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);
  const [isManageBedModalOpen, setIsManageBedModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [newWard, setNewWard] = useState({ name: '', description: '' });
  const [newBed, setNewBed] = useState({ ward_name: '', bed_number: '' });
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [bedUpdate, setBedUpdate] = useState({ status: '', patient_name: '', admission_date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [wardsRes, bedsRes] = await Promise.all([
        supabase.from('Wards').select('*').order('created_at', { ascending: true }),
        supabase.from('Beds').select('*').order('bed_number', { ascending: true })
      ]);
      setWards(wardsRes.data || []);
      setBeds(bedsRes.data || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('Wards').insert([newWard]);
      setNewWard({ name: '', description: '' });
      setIsWardModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBed = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('Beds').insert([{ 
        ward_name: newBed.ward_name, 
        bed_number: newBed.bed_number,
        status: 'Available'
      }]);
      setNewBed({ ward_name: '', bed_number: '' });
      setIsBedModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBed = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('Beds').update({
        status: bedUpdate.status,
        patient_name: bedUpdate.status === 'Occupied' ? bedUpdate.patient_name : null,
        admission_date: bedUpdate.status === 'Occupied' ? bedUpdate.admission_date : null,
      }).eq('id', selectedBed.id);
      
      setIsManageBedModalOpen(false);
      setSelectedBed(null);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteWard = async (id: string, name: string) => {
    if (!confirm(`Delete ward ${name}? This will also remove its beds.`)) return;
    try {
      await supabase.from('Beds').delete().eq('ward_name', name);
      await supabase.from('Wards').delete().eq('id', id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBed = async (id: string) => {
    if (!confirm(`Remove this bed entirely?`)) return;
    try {
      await supabase.from('Beds').delete().eq('id', id);
      setIsManageBedModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Available') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'Occupied') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (status === 'Maintenance') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getStatusDot = (status: string) => {
    if (status === 'Available') return 'bg-emerald-500';
    if (status === 'Occupied') return 'bg-rose-500';
    if (status === 'Maintenance') return 'bg-amber-500';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Beds & Wards Tracking</h1>
          <p className="text-sm text-slate-500">Live monitoring of bed occupancy and maintenance across the hospital.</p>
        </div>
        <button 
          onClick={() => setIsWardModalOpen(true)}
          className="flex items-center gap-2 bg-[#0a4d40] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#073a30] transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Ward
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500">Loading hospital layout...</div>
      ) : wards.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
          <BedDouble className="mx-auto text-slate-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-slate-700">No Wards Created</h3>
          <p className="text-slate-500 mb-4">Add your first ward to start tracking beds.</p>
          <button onClick={() => setIsWardModalOpen(true)} className="bg-[#0a4d40] text-white px-4 py-2 rounded-lg font-medium text-sm">Add Ward</button>
        </div>
      ) : (
        <div className="space-y-8">
          {wards.map(ward => {
            const wardBeds = beds.filter(b => b.ward_name === ward.name);
            const occupiedCount = wardBeds.filter(b => b.status === 'Occupied').length;
            const availableCount = wardBeds.filter(b => b.status === 'Available').length;
            const maintenanceCount = wardBeds.filter(b => b.status === 'Maintenance').length;

            return (
              <div key={ward.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Ward Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-slate-900">{ward.name}</h2>
                      <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        Total Capacity: {wardBeds.length}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{ward.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> <span className="text-slate-600">{availableCount} Available</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> <span className="text-slate-600">{occupiedCount} Occupied</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> <span className="text-slate-600">{maintenanceCount} Maint.</span></div>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setNewBed({ ward_name: ward.name, bed_number: '' }); setIsBedModalOpen(true); }}
                        className="text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Bed
                      </button>
                      <button 
                        onClick={() => deleteWard(ward.id, ward.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Ward"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bed Grid */}
                <div className="p-6">
                  {wardBeds.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-500">No beds added to this ward yet.</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {wardBeds.map(bed => (
                        <button 
                          key={bed.id}
                          onClick={() => {
                            setSelectedBed(bed);
                            setBedUpdate({
                              status: bed.status,
                              patient_name: bed.patient_name || '',
                              admission_date: bed.admission_date || ''
                            });
                            setIsManageBedModalOpen(true);
                          }}
                          className={`
                            relative text-left p-3 rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-md group
                            ${getStatusColor(bed.status)}
                          `}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-black text-lg tracking-tight">{bed.bed_number}</span>
                            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${getStatusDot(bed.status)}`}></div>
                          </div>
                          
                          <div className="min-h-[40px]">
                            {bed.status === 'Occupied' ? (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">Patient</p>
                                <p className="text-sm font-bold leading-tight truncate">{bed.patient_name}</p>
                              </div>
                            ) : bed.status === 'Maintenance' ? (
                              <div className="flex items-center gap-1.5 text-amber-900 opacity-80 mt-2">
                                <AlertCircle size={14} />
                                <span className="text-xs font-bold">Cleaning...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-900 opacity-80 mt-2">
                                <CheckCircle2 size={14} />
                                <span className="text-xs font-bold">Ready</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 size={14} className="opacity-50" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Ward Modal */}
      {isWardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsWardModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
            <h2 className="text-xl font-bold mb-4">Create New Ward</h2>
            <form onSubmit={handleAddWard} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ward Name</label>
                <input required type="text" placeholder="e.g. ICU, General Ward A" value={newWard.name} onChange={e => setNewWard({...newWard, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                <input type="text" placeholder="e.g. 2nd Floor, South Wing" value={newWard.description} onChange={e => setNewWard({...newWard, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]" />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsWardModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-700 font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#0a4d40] text-white rounded-lg font-bold hover:bg-[#073a30]">Create Ward</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bed Modal */}
      {isBedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsBedModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
            <h2 className="text-xl font-bold mb-1">Add Bed</h2>
            <p className="text-sm text-slate-500 mb-4">Adding to <span className="font-bold text-slate-800">{newBed.ward_name}</span></p>
            <form onSubmit={handleAddBed} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bed Number / Identifier</label>
                <input required type="text" placeholder="e.g. A-01, ICU-12" value={newBed.bed_number} onChange={e => setNewBed({...newBed, bed_number: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4d40]" />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsBedModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-700 font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#0a4d40] text-white rounded-lg font-bold hover:bg-[#073a30]">Add Bed</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Bed Modal */}
      {isManageBedModalOpen && selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsManageBedModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Manage Bed {selectedBed.bed_number}</h2>
                <p className="text-sm text-slate-500 font-medium">{selectedBed.ward_name}</p>
              </div>
              <button onClick={() => setIsManageBedModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded"><X size={20}/></button>
            </div>

            <form onSubmit={handleUpdateBed} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setBedUpdate({...bedUpdate, status: 'Available'})} className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${bedUpdate.status === 'Available' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-emerald-200'}`}>Available</button>
                  <button type="button" onClick={() => setBedUpdate({...bedUpdate, status: 'Occupied'})} className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${bedUpdate.status === 'Occupied' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200 text-slate-500 hover:border-rose-200'}`}>Occupied</button>
                  <button type="button" onClick={() => setBedUpdate({...bedUpdate, status: 'Maintenance'})} className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${bedUpdate.status === 'Maintenance' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-200 text-slate-500 hover:border-amber-200'}`}>Cleaning</button>
                </div>
              </div>

              {bedUpdate.status === 'Occupied' && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assign Patient</label>
                    <input required type="text" placeholder="Patient Name" value={bedUpdate.patient_name} onChange={e => setBedUpdate({...bedUpdate, patient_name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Admission Date</label>
                    <input required type="date" value={bedUpdate.admission_date} onChange={e => setBedUpdate({...bedUpdate, admission_date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white" />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => deleteBed(selectedBed.id)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 p-2 rounded hover:bg-red-50 transition-colors">
                  <Trash2 size={16} /> Remove Bed
                </button>
                <div className="flex gap-2">
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

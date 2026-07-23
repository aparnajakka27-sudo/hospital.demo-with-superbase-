"use client"
import React, { useState, useEffect } from 'react'
import { Plus, BedDouble, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function BedsAdminPage() {
  const [beds, setBeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBed, setNewBed] = useState({ ward_name: '', bed_number: '', type: '' });

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('beds').select('*');
      if (error) console.error(error);
      setBeds(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('beds').insert([{ ...newBed, status: 'Available' }]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewBed({ ward_name: '', bed_number: '', type: '' });
      fetchBeds();
    } catch (err: any) {
      alert("Error adding bed: " + err.message);
    }
  };

  const deleteBed = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await supabase.from('beds').delete().eq('id', id);
      fetchBeds();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Beds & Wards</h1>
          <p className="text-sm text-slate-500">Live database of hospital beds.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30]">
          <Plus size={16} /> Add Bed
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-4 text-center text-slate-500 py-12">Loading live beds data...</div>
          ) : beds.length === 0 ? (
            <div className="col-span-4 text-center text-slate-500 py-12">No beds found. Add a bed to start.</div>
          ) : (
            beds.map(bed => (
              <div key={bed.id} className="border border-slate-200 rounded-lg p-4 flex flex-col relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${bed.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <BedDouble size={24} />
                  </div>
                  <button onClick={() => deleteBed(bed.id)} className="text-slate-400 hover:text-red-600 hidden group-hover:block">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900">{bed.bed_number}</h3>
                <p className="text-xs text-slate-500 mb-2">{bed.ward_name} • {bed.type}</p>
                <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold mt-auto self-start ${
                  bed.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bed.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-5">
            <h2 className="text-lg font-bold mb-4">Add Bed</h2>
            <form onSubmit={handleAddBed} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ward Name</label>
                <input required type="text" value={newBed.ward_name} onChange={e => setNewBed({...newBed, ward_name: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bed Number</label>
                <input required type="text" value={newBed.bed_number} onChange={e => setNewBed({...newBed, bed_number: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type (e.g. ICU, General)</label>
                <input required type="text" value={newBed.type} onChange={e => setNewBed({...newBed, type: e.target.value})} className="w-full border rounded-lg p-2" />
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

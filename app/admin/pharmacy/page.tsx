"use client"
import React, { useState, useEffect } from 'react'
import { Pill, AlertTriangle, PackagePlus, ArrowRightLeft, X, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function PharmacyAdminPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ sales: 0, lowStock: 0, total: 0 });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    stock_quantity: '',
    unit_price: '',
    reorder_level: '10'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Inventory
      const { data: invData, error: invError } = await supabase
        .from('pharmacy_inventory')
        .select('*')
        .order('name');
        
      if (invError) {
        console.error("Inventory fetch error (Make sure pharmacy_inventory table exists):", invError);
      }
      
      const medicines = invData || [];
      setInventory(medicines);
      
      const lowStockCount = medicines.filter(m => m.stock_quantity <= (m.reorder_level || 10)).length;
      const totalMeds = medicines.length;

      // 2. Fetch Today's Sales from Booking Appointment
      const today = new Date().toISOString().split('T')[0];
      const { data: appts, error: apptError } = await supabase
        .from('Booking Appointment')
        .select('pharmacy_status')
        .eq('Date', today);
        
      if (apptError) throw apptError;
      
      const fulfilled = (appts || []).filter(a => a.pharmacy_status === 'Fulfilled').length;
      
      setStats({
        sales: fulfilled * 45, // Generic assumption for demo
        lowStock: lowStockCount,
        total: totalMeds
      });

    } catch (error) {
      console.error("Error fetching pharmacy data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const { error } = await supabase.from('pharmacy_inventory').insert([
        {
          name: newItem.name,
          category: newItem.category || 'General',
          stock_quantity: parseInt(newItem.stock_quantity) || 0,
          unit_price: parseFloat(newItem.unit_price) || 0,
          reorder_level: parseInt(newItem.reorder_level) || 10
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewItem({ name: '', category: '', stock_quantity: '', unit_price: '', reorder_level: '10' });
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this medicine?')) return;
    try {
      const { error } = await supabase.from('pharmacy_inventory').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pharmacy & Inventory</h1>
          <p className="text-sm text-slate-500">Live stock management connected to Supabase.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors"
        >
          <PackagePlus size={16} /> Add Stock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ArrowRightLeft size={24} /></div>
          <div>
            <p className="text-sm text-slate-500">Today's Est. Sales</p>
            <p className="text-xl font-bold text-slate-900">${stats.sales.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-slate-500">Low Stock Alerts</p>
            <p className="text-xl font-bold text-slate-900">{stats.lowStock} Items</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Pill size={24} /></div>
          <div>
            <p className="text-sm text-slate-500">Total Medicines</p>
            <p className="text-xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Qty</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading live inventory from Supabase...</td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No medicines found in the inventory.</td>
                </tr>
              ) : (
                inventory.map((med) => {
                  const isLow = med.stock_quantity <= (med.reorder_level || 10);
                  const isOut = med.stock_quantity === 0;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{med.name}</td>
                      <td className="px-6 py-4 text-slate-500">{med.category || 'General'}</td>
                      <td className="px-6 py-4 font-mono font-medium">{med.stock_quantity}</td>
                      <td className="px-6 py-4">${Number(med.unit_price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${isOut ? 'bg-red-100 text-red-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteItem(med.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-900">Add New Medicine</h2>
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
              
              <form id="add-stock-form" onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    placeholder="e.g. Paracetamol 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input 
                    type="text" 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    placeholder="e.g. Painkillers"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                    <input 
                      required 
                      type="number" 
                      min="0"
                      value={newItem.stock_quantity}
                      onChange={e => setNewItem({...newItem, stock_quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={newItem.unit_price}
                      onChange={e => setNewItem({...newItem, unit_price: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900"
                    />
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
                form="add-stock-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#0a4d40] text-white rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Add Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

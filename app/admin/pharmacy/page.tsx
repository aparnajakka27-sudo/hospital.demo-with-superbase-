"use client"
import React from 'react'
import { Pill, AlertTriangle, PackagePlus, ArrowRightLeft } from 'lucide-react'

const MOCK_INV = [
  { id: 1, name: 'Paracetamol 500mg', stock: 1200, price: '$0.50', status: 'In Stock' },
  { id: 2, name: 'Amoxicillin 250mg', stock: 45, price: '$1.20', status: 'Low Stock' },
  { id: 3, name: 'Ibuprofen 400mg', stock: 850, price: '$0.75', status: 'In Stock' },
]

export default function PharmacyAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pharmacy & Inventory</h1>
          <p className="text-sm text-slate-500">Manage medicines, stock levels, and sales.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <PackagePlus size={16} /> Add Stock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ArrowRightLeft size={24} /></div>
          <div><p className="text-sm text-slate-500">Today's Sales</p><p className="text-xl font-bold text-slate-900">$1,450.00</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
          <div><p className="text-sm text-slate-500">Low Stock Alerts</p><p className="text-xl font-bold text-slate-900">12 Items</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Pill size={24} /></div>
          <div><p className="text-sm text-slate-500">Total Medicines</p><p className="text-xl font-bold text-slate-900">845</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Medicine Name</th>
              <th className="px-6 py-4">Stock Qty</th>
              <th className="px-6 py-4">Unit Price</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_INV.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{med.name}</td>
                <td className="px-6 py-4">{med.stock}</td>
                <td className="px-6 py-4">{med.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${med.status === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>{med.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

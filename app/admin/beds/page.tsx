"use client"
import React from 'react'
import { BedDouble, Plus } from 'lucide-react'

export default function BedsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Beds & Wards</h1>
          <p className="text-sm text-slate-500">Real-time tracking of bed occupancy across all wards.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Ward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">General Ward A</h3>
          <p className="text-sm text-slate-500 mb-4">Capacity: 40 Beds</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mb-2"><div className="bg-emerald-500 h-2 rounded-full w-[60%]"></div></div>
          <p className="text-xs text-right text-emerald-600 font-bold">24 Occupied</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">ICU</h3>
          <p className="text-sm text-slate-500 mb-4">Capacity: 20 Beds</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mb-2"><div className="bg-red-500 h-2 rounded-full w-[90%]"></div></div>
          <p className="text-xs text-right text-red-600 font-bold">18 Occupied</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Private Suites</h3>
          <p className="text-sm text-slate-500 mb-4">Capacity: 15 Beds</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mb-2"><div className="bg-amber-500 h-2 rounded-full w-[40%]"></div></div>
          <p className="text-xs text-right text-amber-600 font-bold">6 Occupied</p>
        </div>
      </div>
    </div>
  )
}

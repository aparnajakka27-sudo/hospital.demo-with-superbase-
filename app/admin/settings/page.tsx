"use client"
import React from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'

export default function SettingsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-sm text-slate-500">Configure global hospital parameters.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Hospital Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
            <input type="text" defaultValue="HORIZON Super Speciality Hospital" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input type="email" defaultValue="admin@horizon.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Currency Symbol</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option>USD ($)</option>
              <option>INR (₹)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

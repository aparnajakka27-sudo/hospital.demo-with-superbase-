"use client"
import React, { useState } from 'react'
import { Settings as SettingsIcon, Save, CheckCircle2, Loader2, Phone } from 'lucide-react'

export default function SettingsAdminPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    hospitalName: "HORIZON Super Speciality Hospital",
    primaryContact: "+91 98765 43210",
    emergencyContact: "+91 99887 76655",
    ambulanceContact: "108 / +91 90000 11111",
    contactEmail: "admin@horizon.com",
    currency: "INR (₹)"
  });

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-sm text-slate-500">Configure global hospital parameters.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-in fade-in">
              <CheckCircle2 size={16} /> Saved Successfully
            </span>
          )}
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#0a4d40] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors disabled:opacity-70 min-w-[140px] justify-center shadow-sm"
          >
            {isSaving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <SettingsIcon className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-slate-900">General Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
              <input 
                type="text" 
                value={settings.hospitalName} 
                onChange={(e) => handleChange('hospitalName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
              <input 
                type="email" 
                value={settings.contactEmail} 
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency Symbol</label>
              <select 
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Phone className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-slate-900">Contact Numbers</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact Number</label>
              <input 
                type="text" 
                value={settings.primaryContact} 
                onChange={(e) => handleChange('primaryContact', e.target.value)}
                placeholder="+91..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Help Desk</label>
              <input 
                type="text" 
                value={settings.emergencyContact} 
                onChange={(e) => handleChange('emergencyContact', e.target.value)}
                placeholder="+91..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ambulance Service</label>
              <input 
                type="text" 
                value={settings.ambulanceContact} 
                onChange={(e) => handleChange('ambulanceContact', e.target.value)}
                placeholder="108 or direct number"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm border-red-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

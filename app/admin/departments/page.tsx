"use client"
import React, { useState } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Activity,
  Heart,
  Brain,
  Bone
} from 'lucide-react'

// Seed Data
const MOCK_DEPARTMENTS = [
  { id: 1, name: 'Cardiology', head: 'Dr. Sarah Smith', doctors: 8, patients: 3200, revenue: '$145,000', icon: Heart },
  { id: 2, name: 'Neurology', head: 'Dr. James Wilson', doctors: 5, patients: 1850, revenue: '$98,000', icon: Brain },
  { id: 3, name: 'Orthopaedics', head: 'Dr. Michael Brown', doctors: 6, patients: 2400, revenue: '$112,000', icon: Bone },
  { id: 4, name: 'General Medicine', head: 'Dr. Robert Taylor', doctors: 12, patients: 5600, revenue: '$180,000', icon: Activity },
]

export default function DepartmentsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDepts = MOCK_DEPARTMENTS.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-sm text-slate-500">Manage hospital specialities and view performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] hover:bg-[#073a30] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search departments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => {
          const Icon = dept.icon;
          return (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-sm text-slate-500">Head: {dept.head}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{dept.doctors}</p>
                  <p className="text-xs text-slate-500 font-medium">Doctors</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-2xl font-bold text-slate-800">{dept.patients}</p>
                  <p className="text-xs text-slate-500 font-medium">Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600 mt-1">{dept.revenue}</p>
                  <p className="text-xs text-slate-500 font-medium">Revenue</p>
                </div>
              </div>
            </div>
          )
        })}

        {filteredDepts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            No departments found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}

"use client"
import React, { useState } from 'react'
import { Search, Filter, Eye, Edit, FileText } from 'lucide-react'

const MOCK_PATIENTS = [
  { id: 1, uhid: 'UHID-1001', name: 'John Doe', age: 45, gender: 'Male', phone: '+1 234-567-8900', lastVisit: '2023-10-24', status: 'Registered' },
  { id: 2, uhid: 'UHID-1002', name: 'Jane Smith', age: 32, gender: 'Female', phone: '+1 234-567-8901', lastVisit: '2023-10-23', status: 'Registered' },
  { id: 3, uhid: 'UHID-1003', name: 'Robert Johnson', age: 58, gender: 'Male', phone: '+1 234-567-8902', lastVisit: '2023-10-20', status: 'Admitted' },
]

export default function PatientsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Registry</h1>
          <p className="text-sm text-slate-500">Central database of all registered hospital patients.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by UHID, Name, or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
          <Filter size={16} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">UHID</th>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Age/Gender</th>
              <th className="px-6 py-4">Last Visit</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PATIENTS.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-slate-700">{patient.uhid}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{patient.name}<div className="text-xs text-slate-500 font-normal">{patient.phone}</div></td>
                <td className="px-6 py-4">{patient.age} Yrs / {patient.gender}</td>
                <td className="px-6 py-4">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === 'Admitted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>{patient.status}</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600"><Eye size={18} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-emerald-600"><FileText size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

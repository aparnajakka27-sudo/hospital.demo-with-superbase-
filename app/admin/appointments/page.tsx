"use client"
import React from 'react'
import { CalendarDays, Filter, Search, Plus } from 'lucide-react'

const MOCK_APPT = [
  { id: 'APT-001', patient: 'John Doe', doctor: 'Dr. Sarah Smith', dept: 'Cardiology', time: 'Today, 10:30 AM', status: 'Scheduled' },
  { id: 'APT-002', patient: 'Jane Smith', doctor: 'Dr. James Wilson', dept: 'Neurology', time: 'Today, 11:00 AM', status: 'Completed' },
  { id: 'APT-003', patient: 'Robert Johnson', doctor: 'Dr. Michael Brown', dept: 'Orthopaedics', time: 'Tomorrow, 09:15 AM', status: 'Scheduled' },
]

export default function AppointmentsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments Master</h1>
          <p className="text-sm text-slate-500">View and manage all hospital appointments.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30]">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search appointments..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Appt ID</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Doctor & Dept</th>
              <th className="px-6 py-4">Schedule</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_APPT.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono">{apt.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{apt.patient}</td>
                <td className="px-6 py-4">{apt.doctor} <span className="text-xs text-slate-500 block">{apt.dept}</span></td>
                <td className="px-6 py-4">{apt.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{apt.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

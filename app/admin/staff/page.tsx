"use client"
import React from 'react'
import { Users, Plus } from 'lucide-react'

export default function StaffAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-sm text-slate-500">Manage non-clinical hospital staff (Nurses, Admin, Receptionists).</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-semibold text-slate-900">Alice Walker</td>
              <td className="px-6 py-4">Head Nurse</td>
              <td className="px-6 py-4">Morning (8AM - 4PM)</td>
              <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">Active</span></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-semibold text-slate-900">Mark Taylor</td>
              <td className="px-6 py-4">Receptionist</td>
              <td className="px-6 py-4">Evening (4PM - 12AM)</td>
              <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

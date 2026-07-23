"use client"
import React from 'react'
import { BarChart3, Download } from 'lucide-react'

export default function ReportsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">Generate and download custom hospital performance reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Monthly Revenue Report</h3>
          <p className="text-sm text-slate-500 mb-6">Detailed breakdown of income streams for the current month.</p>
          <button className="flex justify-center items-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            <Download size={18} /> Export as PDF
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Patient Demographics</h3>
          <p className="text-sm text-slate-500 mb-6">Statistics on patient age, gender, and regional distribution.</p>
          <button className="flex justify-center items-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            <Download size={18} /> Export as CSV
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"
import React from 'react'
import { FileText, Download, CreditCard } from 'lucide-react'

const MOCK_BILLS = [
  { id: 'INV-2023-001', patient: 'John Doe', amount: '$150.00', date: 'Oct 24, 2023', status: 'Paid', method: 'Credit Card' },
  { id: 'INV-2023-002', patient: 'Jane Smith', amount: '$450.00', date: 'Oct 24, 2023', status: 'Pending', method: '-' },
  { id: 'INV-2023-003', patient: 'Robert Johnson', amount: '$85.00', date: 'Oct 23, 2023', status: 'Paid', method: 'Cash' },
]

export default function BillingAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-sm text-slate-500">Track all hospital revenue and patient bills.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <FileText size={16} /> Generate Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_BILLS.map((bill) => (
              <tr key={bill.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-900">{bill.id}</td>
                <td className="px-6 py-4 font-medium">{bill.patient}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{bill.amount}</td>
                <td className="px-6 py-4">{bill.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{bill.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600"><Download size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

"use client"
import React, { useState, useEffect } from 'react'
import { FileText, Download, TrendingUp, Users, Pill } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ReportsAdminPage() {
  const [stats, setStats] = useState({
    appointments: 0,
    pharmacySales: 0,
    patients: 0
  });

  useEffect(() => {
    async function fetchReports() {
      // Fetch some generic KPIs from the live DB for the reports dashboard
      const { data: appts } = await supabase.from('Booking Appointment').select('*');
      const totalAppts = appts?.length || 0;
      const fulfilledAppts = (appts || []).filter(a => a.pharmacy_status === 'Fulfilled').length;
      
      const { data: pts } = await supabase.from('Patients').select('id');
      const totalPts = pts?.length || 0;
      
      setStats({
        appointments: totalAppts,
        pharmacySales: fulfilledAppts,
        patients: totalPts
      });
    }
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Reports</h1>
          <p className="text-sm text-slate-500">Live analytical reports from your Supabase database.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30]">
          <Download size={16} /> Download All Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit mb-4"><TrendingUp size={24} /></div>
          <h3 className="text-xl font-bold text-slate-900">{stats.appointments}</h3>
          <p className="text-sm text-slate-500">Total Appointments</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-4"><Pill size={24} /></div>
          <h3 className="text-xl font-bold text-slate-900">{stats.pharmacySales}</h3>
          <p className="text-sm text-slate-500">Pharmacy Prescriptions Fulfilled</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg w-fit mb-4"><Users size={24} /></div>
          <h3 className="text-xl font-bold text-slate-900">{stats.patients}</h3>
          <p className="text-sm text-slate-500">Registered Patients</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Reports</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Your live data is constantly being processed. Full PDF and CSV analytical reports are generated at the end of each month.
        </p>
      </div>
    </div>
  )
}

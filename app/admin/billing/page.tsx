"use client"
import React, { useState, useEffect } from 'react'
import { Search, Download, Filter, FileText, CheckCircle2, Clock } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function BillingAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0
  });

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setIsLoading(true);
    try {
      // Using Booking Appointment as the source of truth for payments as instructed
      const { data, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const appointments = data || [];
      setBills(appointments);
      
      // Calculate stats based on generic $150 consultation fee + $45 pharmacy fee if fulfilled
      let revenue = 0;
      let pendingAmt = 0;
      let paidCount = 0;
      let pendingCount = 0;
      
      appointments.forEach(apt => {
        const baseFee = 150;
        const pharmacyFee = apt.pharmacy_status === 'Fulfilled' ? 45 : 0;
        const total = baseFee + pharmacyFee;
        
        if (apt.payment_status === 'Paid') {
          revenue += total;
          paidCount++;
        } else {
          pendingAmt += total;
          pendingCount++;
        }
      });
      
      setStats({
        totalRevenue: revenue,
        pendingAmount: pendingAmt,
        paidInvoices: paidCount,
        pendingInvoices: pendingCount
      });
      
    } catch (error) {
      console.log("Error fetching billing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredBills.length === 0) return;
    
    const headers = ['Invoice/Token', 'Patient Name', 'Date', 'Amount (INR)', 'Status'];
    const rows = filteredBills.map(bill => {
      const isPaid = bill.payment_status === 'Paid';
      const amount = 150 + (bill.pharmacy_status === 'Fulfilled' ? 45 : 0);
      return [
        `INV-TKN-${bill.token_number || bill.id}`,
        `"${bill.Name || ''}"`,
        bill.Date || '',
        amount.toFixed(2),
        isPaid ? 'Paid' : 'Pending'
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `billing_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bill.token_number?.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Paid' && bill.payment_status === 'Paid') ||
                         (filterStatus === 'Pending' && bill.payment_status !== 'Paid');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Payments</h1>
          <p className="text-sm text-slate-500">Live transaction history pulled from Appointments.</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Total Collected Revenue</p>
          <h3 className="text-2xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-2">{stats.paidInvoices} paid invoices</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Pending Payments</p>
          <h3 className="text-2xl font-bold text-amber-500">₹{stats.pendingAmount.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-2">{stats.pendingInvoices} pending invoices</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Patient Name or Token..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500" 
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-emerald-500 text-slate-700 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid Only</option>
          <option value="Pending">Pending Only</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Invoice / Token</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading live billing data...</td>
                </tr>
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No transactions found.</td>
                </tr>
              ) : (
                filteredBills.map((bill, index) => {
                  const isPaid = bill.payment_status === 'Paid';
                  const amount = 150 + (bill.pharmacy_status === 'Fulfilled' ? 45 : 0);
                  
                  return (
                    <tr key={bill.id || `bill-${index}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-700">INV-TKN-{bill.token_number || bill.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{bill.Name}</td>
                      <td className="px-6 py-4">{bill.Date}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">₹{amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                          ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Invoice">
                          <FileText size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

"use client"
import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Stethoscope, 
  TrendingUp, 
  CalendarDays,
  Pill,
  BedDouble,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { supabase } from '../../lib/supabase'

const COLORS = ['#0a4d40', '#0ea5e9', '#f59e0b', '#10b981', '#6366f1', '#ef4444'];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('Today');
  const [isLoading, setIsLoading] = useState(true);

  // Live Data States
  const [kpi, setKpi] = useState({
    revenue: 0,
    patients: 0,
    appointments: 0,
    doctors: 0,
    revChange: 0,
    aptChange: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pharmacyStats, setPharmacyStats] = useState({ sales: 0, fulfilledCount: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Doctors Count
      const { count: doctorsCount } = await supabase
        .from('Doctors')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch all appointments (we will aggregate in memory for simplicity)
      const { data: appointments, error } = await supabase
        .from('Booking Appointment')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      const appts = appointments || [];

      // Dates logic
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const todayAppts = appts.filter(a => a.Date === today);
      const yesterdayAppts = appts.filter(a => a.Date === yesterday);
      
      // Assume flat consultation fee of $150 for 'Paid' status 
      // and flat $45 for pharmacy 'Fulfilled' status
      const calcRevenue = (arr: any[]) => arr.filter(a => a.payment_status === 'Paid').length * 150;
      
      const todayRev = calcRevenue(todayAppts);
      const yesterdayRev = calcRevenue(yesterdayAppts);
      const revChange = yesterdayRev === 0 ? 100 : ((todayRev - yesterdayRev) / yesterdayRev) * 100;
      
      const todayAptsCount = todayAppts.length;
      const yesterdayAptsCount = yesterdayAppts.length;
      const aptChange = yesterdayAptsCount === 0 ? 100 : ((todayAptsCount - yesterdayAptsCount) / yesterdayAptsCount) * 100;

      // Unique patients total (by Name)
      const uniquePatients = new Set(appts.map(a => a.Name)).size;

      setKpi({
        revenue: todayRev,
        patients: uniquePatients,
        appointments: todayAptsCount,
        doctors: doctorsCount || 0,
        revChange,
        aptChange
      });

      // Pharmacy Stats (Today)
      const fulfilledToday = todayAppts.filter(a => a.pharmacy_status === 'Fulfilled').length;
      setPharmacyStats({
        sales: fulfilledToday * 45,
        fulfilledCount: fulfilledToday
      });

      // Recent Activity (Top 4)
      const recent = appts.slice(0, 4).map((a, idx) => {
        let text = `New appointment booked for ${a.Name} in ${a.Department}`;
        let type = 'appointment';
        if (a.payment_status === 'Paid' && idx % 2 === 0) {
          text = `Payment received from ${a.Name}`;
          type = 'payment';
        }
        if (a.pharmacy_status === 'Fulfilled' && idx % 3 === 0) {
          text = `Prescription fulfilled for ${a.Name}`;
          type = 'pharmacy';
        }
        return {
          id: a.Name + idx,
          type,
          text,
          time: new Date(a.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      setRecentActivity(recent);

      // Department Distribution (All time)
      const deptCounts: Record<string, number> = {};
      appts.forEach(a => {
        const d = a.Department || 'General';
        deptCounts[d] = (deptCounts[d] || 0) + 1;
      });
      setDepartmentData(Object.keys(deptCounts).map(k => ({ name: k, value: deptCounts[k] })));

      // Status Distribution (Today's Queue)
      const statusCounts: Record<string, number> = {};
      todayAppts.forEach(a => {
        const s = a.queue_status || 'Scheduled';
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      });
      setStatusData(Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] })));

      // Revenue Trend (Last 7 days)
      const trendMap: Record<string, number> = {};
      for(let i=6; i>=0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
        trendMap[d] = 0;
      }
      appts.forEach(a => {
        if (trendMap[a.Date] !== undefined && a.payment_status === 'Paid') {
          trendMap[a.Date] += 150;
        }
      });
      setRevenueData(Object.keys(trendMap).map(k => ({ 
        name: k.split('-').slice(1).join('/'), // MM/DD
        revenue: trendMap[k] 
      })));

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading Live Data from Supabase...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Live data pulled from Supabase (Booking Appointment & Doctors tables)</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">${kpi.revenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {kpi.revChange >= 0 ? (
               <><ArrowUpRight size={16} className="text-emerald-500 mr-1" /><span className="text-emerald-500 font-medium">+{kpi.revChange.toFixed(1)}%</span></>
            ) : (
               <><ArrowDownRight size={16} className="text-red-500 mr-1" /><span className="text-red-500 font-medium">{kpi.revChange.toFixed(1)}%</span></>
            )}
            <span className="text-slate-400 ml-2">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Unique Patients</p>
              <h3 className="text-2xl font-bold text-slate-900">{kpi.patients.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600 font-medium">All time registry</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-slate-900">{kpi.appointments}</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <CalendarDays size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
             {kpi.aptChange >= 0 ? (
               <><ArrowUpRight size={16} className="text-emerald-500 mr-1" /><span className="text-emerald-500 font-medium">+{kpi.aptChange.toFixed(1)}%</span></>
            ) : (
               <><ArrowDownRight size={16} className="text-red-500 mr-1" /><span className="text-red-500 font-medium">{kpi.aptChange.toFixed(1)}%</span></>
            )}
            <span className="text-slate-400 ml-2">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Doctors</p>
              <h3 className="text-2xl font-bold text-slate-900">{kpi.doctors}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Stethoscope size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600 font-medium">Live from DB</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue Trend (Last 7 Days)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a4d40" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0a4d40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0a4d40" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-6">By Department</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, 'Appointments']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-3 gap-x-2">
            {departmentData.slice(0, 4).map((dept, idx) => (
              <div key={dept.name} className="flex items-center justify-between text-xs w-full">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: COLORS[idx] }}></span>
                  <span className="text-slate-600 truncate max-w-[90px]">{dept.name}</span>
                </div>
                <span className="font-semibold">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Today's Status</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => {
                    // Match colors specifically for status
                    let color = '#64748b'; // default gray
                    if(entry.name === 'Waiting') color = '#f59e0b'; // amber
                    if(entry.name === 'With Doctor') color = '#0ea5e9'; // blue
                    if(entry.name === 'Completed') color = '#10b981'; // green
                    if(entry.name === 'No-show') color = '#ef4444'; // red
                    if(entry.name === 'Scheduled') color = '#6366f1'; // indigo
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, 'Patients']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-3 gap-x-2">
            {statusData.map((stat, idx) => {
              let color = '#64748b';
              if(stat.name === 'Waiting') color = '#f59e0b';
              if(stat.name === 'With Doctor') color = '#0ea5e9';
              if(stat.name === 'Completed') color = '#10b981';
              if(stat.name === 'No-show') color = '#ef4444';
              if(stat.name === 'Scheduled') color = '#6366f1';
              return (
                <div key={stat.name} className="flex items-center justify-between text-xs w-full">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: color }}></span>
                    <span className="text-slate-600 truncate max-w-[90px]">{stat.name}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pharmacy Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Pill size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Pharmacy Stats (Today)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Prescription Revenue</span>
              <span className="text-sm font-bold text-slate-900">${pharmacyStats.sales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Fulfilled Count</span>
              <span className="text-sm font-medium text-slate-900">{pharmacyStats.fulfilledCount}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Activity size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Live Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity found.</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-0.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      activity.type === 'appointment' ? 'bg-blue-500' : 
                      activity.type === 'pharmacy' ? 'bg-red-500' : 
                      activity.type === 'payment' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">{activity.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

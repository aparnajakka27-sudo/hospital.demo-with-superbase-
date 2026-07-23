"use client"
import React, { useState } from 'react'
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock Seed Data for the Dashboard
const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const departmentData = [
  { name: 'Cardiology', value: 400 },
  { name: 'Neurology', value: 300 },
  { name: 'Orthopaedics', value: 300 },
  { name: 'General Medicine', value: 200 },
  { name: 'Pediatrics', value: 278 },
  { name: 'Emergency', value: 189 },
];

const COLORS = ['#0a4d40', '#0ea5e9', '#f59e0b', '#10b981', '#6366f1', '#ef4444'];

const recentActivity = [
  { id: 1, type: 'appointment', text: 'New appointment booked for Cardiology', time: '10 mins ago' },
  { id: 2, type: 'pharmacy', text: 'Low stock alert: Paracetamol (500mg)', time: '1 hour ago' },
  { id: 3, type: 'patient', text: 'New patient registered: John Doe', time: '2 hours ago' },
  { id: 4, type: 'payment', text: 'Large payment received: $1,200', time: '3 hours ago' },
];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('Today');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Welcome to the HORIZON Admin Portal. Here's what's happening today.</p>
        </div>
        
        {/* Time Range Toggle */}
        <div className="bg-white rounded-lg p-1 border border-slate-200 inline-flex shadow-sm">
          {['Today', 'This Week', 'This Month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">$24,500</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight size={16} className="text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">+12.5%</span>
            <span className="text-slate-400 ml-2">vs last {timeRange.toLowerCase().replace('this ', '')}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Patients</p>
              <h3 className="text-2xl font-bold text-slate-900">1,248</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight size={16} className="text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">+4.2%</span>
            <span className="text-slate-400 ml-2">new registrations</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Appointments</p>
              <h3 className="text-2xl font-bold text-slate-900">86</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <CalendarDays size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownRight size={16} className="text-red-500 mr-1" />
            <span className="text-red-500 font-medium">-2.1%</span>
            <span className="text-slate-400 ml-2">vs yesterday</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Doctors</p>
              <h3 className="text-2xl font-bold text-slate-900">32</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Stethoscope size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600 font-medium">8 departments</span>
            <span className="text-slate-400 ml-2">fully staffed</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue Trend</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">Last 7 Days</span>
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
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0a4d40" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by Department</h3>
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
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-2">
            {departmentData.slice(0, 4).map((dept, idx) => (
              <div key={dept.name} className="flex items-center text-xs">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }}></span>
                <span className="text-slate-600 truncate">{dept.name}</span>
              </div>
            ))}
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
            <h3 className="text-lg font-bold text-slate-800">Pharmacy Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Today's Sales</span>
              <span className="text-sm font-bold text-slate-900">$1,450</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Top Selling</span>
              <span className="text-sm font-medium text-slate-900">Paracetamol</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-500 font-medium">Low Stock Alerts</span>
              <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">3 Items</span>
            </div>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <BedDouble size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Bed Occupancy</h3>
          </div>
          
          <div className="mt-2 relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-emerald-600">
                  78% Occupied
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-slate-600">
                  156 / 200 Beds
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
              <div style={{ width: "78%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">ICU</p>
              <p className="text-lg font-bold text-slate-800">18<span className="text-sm text-slate-400 font-normal">/20</span></p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">General</p>
              <p className="text-lg font-bold text-slate-800">84<span className="text-sm text-slate-400 font-normal">/120</span></p>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Activity size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
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
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

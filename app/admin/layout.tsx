"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Stethoscope, 
  Pill, 
  CalendarDays, 
  CreditCard, 
  BedDouble, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
  { name: 'Departments', href: '/admin/departments', icon: Activity },
  { name: 'Staff', href: '/admin/staff', icon: Users },
  { name: 'Patients', href: '/admin/patients', icon: Users },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarDays },
  { name: 'Pharmacy', href: '/admin/pharmacy', icon: Pill },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard },
  { name: 'Beds & Wards', href: '/admin/beds', icon: BedDouble },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('Admin User');

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/admin/login') return;
      
      const hasSession = localStorage.getItem("admin_session");
      if (!hasSession) {
        router.push('/admin/login');
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setAdminEmail(data.user.email);
      } else {
        localStorage.removeItem("admin_session");
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin_session");
    router.push('/');
  };

  // If we are on the login page, don't show the sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#052620] text-white transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 bg-[#031814] border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-400">
            <Activity className="text-emerald-400" size={24} />
            HORIZON <span className="text-white text-sm font-normal ml-1 border border-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Admin</span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patients, doctors, bills..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 w-64 lg:w-96 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  {adminEmail ? adminEmail.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{adminEmail}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Logged In</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>
              
              {profileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{adminEmail}</p>
                    </div>
                    <button 
                      onClick={() => { setProfileOpen(false); /* future profile logic */ }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

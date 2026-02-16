import React from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'; // <--- 1. Import Outlet
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, History, LogOut, ClipboardCheck, BarChart3, Calendar, Users } from 'lucide-react';

const DashboardLayout = () => { // <--- 2. Remove { children } prop
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const menuItems = user?.role === 'manager' 
    ? [
        { name: 'Dashboard', icon: BarChart3, path: '/manager' },
        { name: 'All Records', icon: ClipboardCheck, path: '/manager/records' },
        { name: 'Team Calendar', icon: Calendar, path: '/manager/calendar'},
        { name: 'Today\'s Presence', path: '/manager/today', icon: Users }
      ]
    : [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/employee' },
        { name: 'My History', icon: History, path: '/employee/history' },
        { name: 'Profile', icon: ClipboardCheck, path: '/employee/profile' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8" />
            AttendX
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {

            const isActive = location.pathname === item.path;

           return <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center ${isActive ? 'text-indigo-500' : ''} gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Overview</h2>
            <p className="text-slate-500 text-sm">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-md uppercase font-semibold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500 uppercase">{user?.role} • {user?.department}</p>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* 3. The Outlet Renders the Page Here */}
        <div className="p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default DashboardLayout;
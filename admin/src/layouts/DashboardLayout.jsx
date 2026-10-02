import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { 
  LayoutDashboard, Calendar, Library, HelpCircle, 
  Settings, ClipboardList, LogOut, ShieldAlert, Award, FileText
} from 'lucide-react';
import { adminApi } from '../utils/api';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminApi.post('/auth/logout.php');
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      navigate('/login');
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Bookings', path: '/bookings', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Services', path: '/services', icon: <Award className="w-5 h-5" /> },
    { label: 'Concerns', path: '/concerns', icon: <ShieldAlert className="w-5 h-5" /> },
    { label: 'Blogs', path: '/blogs', icon: <FileText className="w-5 h-5" /> },
    { label: 'Testimonials', path: '/testimonials', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'FAQs', path: '/faqs', icon: <HelpCircle className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'Audit Logs', path: '/activity-logs', icon: <ClipboardList className="w-5 h-5" /> }
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-950 text-gray-300 flex flex-col justify-between border-r border-gray-800 shrink-0">
        <div>
          <div className="p-4 border-b border-gray-800 flex flex-col items-center">
            <img src={logoImg} alt="Suyog Saanidhya" className="h-24 object-contain" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Management Desk</span>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-darkCyan text-white'
                    : 'hover:bg-gray-900 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-darkCyan flex items-center justify-center font-bold text-white text-xs">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user.username}</h4>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 border border-red-900 hover:bg-red-950 text-red-400 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-4 h-4" /> Exit Portal
          </button>
        </div>

      </aside>

      {/* Main Body */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm">
          <h1 className="font-serif text-xl font-bold text-gray-800">
            {navItems.find(item => isActive(item.path))?.label || 'Administration'}
          </h1>
          <span className="font-sans text-xs text-gray-500">
            System time: {new Date().toLocaleDateString()}
          </span>
        </header>

        {/* Panel content outlet */}
        <main className="p-8 flex-grow">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

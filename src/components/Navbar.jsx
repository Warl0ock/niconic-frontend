import React from 'react';
import logo from '../assets/logo.png'; // Import logo baru
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.includes('admin-niconic');

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    window.location.reload(); // Refresh untuk kembali ke login screen
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-mint rounded-xl flex items-center justify-center font-black text-slate-900 shadow-lg shadow-brand-mint/20 group-hover:scale-110 transition-transform">
               <img 
                  src={logo} 
                  alt="Niconic Logo" 
                  className="h-10 w-auto group-hover:scale-105 transition-transform" 
                />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-white leading-none">
              niconic<span className="text-brand-mint">.dev</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-[0.2em] uppercase mt-1">
              {isAdminPage ? 'Admin Panel' : 'Iconic Solutions'}
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-6">
          {isAdminPage ? (
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
            >
              Sign Out
            </button>
          ) : (
            <>
              <a href="https://niconic.dev" className="text-sm text-slate-400 hover:text-brand-mint transition-colors">
                Main Site
              </a>
              <Link to="/" className="px-5 py-2 bg-brand-mint text-slate-900 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-brand-mint/30 transition-all">
                Portfolio
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

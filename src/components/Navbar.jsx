import React from 'react';
import logo from '../assets/logo.png'; // Pastikan file ada di src/assets/
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.includes('admin-niconic');

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin-niconic'); // Redirect manual agar lebih bersih
    window.location.reload(); 
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-4 group">
          {/* Logo Container - Dibuat fleksibel tanpa pembatas kaku agar logo printing Anda terlihat jelas */}
          <div className="transition-transform duration-300 group-hover:scale-110">
            <img 
              src={logo} 
              alt="Niconic Logo" 
              className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]" 
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-white leading-none">
              niconic<span className="text-brand-mint">.dev</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-[0.2em] uppercase mt-1.5 font-medium">
              {isAdminPage ? 'Management Panel' : 'Iconic Solutions'}
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-8">
          {!isAdminPage && (
            <a href="https://niconic.dev" className="text-sm font-medium text-slate-400 hover:text-brand-mint transition-colors">
              Main Site
            </a>
          )}
          <Link 
            to={isAdminPage ? "#" : "/"} 
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              isAdminPage 
              ? 'text-red-400 hover:text-red-300' 
              : 'bg-brand-mint text-slate-900 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]'
            }`}
            onClick={isAdminPage ? handleLogout : undefined}
          >
            {isAdminPage ? 'Sign Out' : 'Portfolio'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.includes('admin-niconic');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-mint rounded-lg flex items-center justify-center font-black text-slate-900 group-hover:rotate-12 transition-transform">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tighter leading-none">niconic.dev</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-bold">Iconic Solutions</span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-8">
          {!isAdminPage && (
            <>
              <a href="https://niconic.dev" className="text-xs font-black text-slate-400 hover:text-brand-mint uppercase tracking-widest transition-colors">
                Main Site
              </a>
              <Link to="/" className="px-5 py-2 bg-brand-mint text-slate-900 text-xs font-black rounded-full uppercase tracking-widest hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all">
                Portfolio
              </Link>
            </>
          )}
          {isAdminPage && (
            <Link to="/" className="text-xs font-black text-red-400 uppercase tracking-widest">Logout</Link>
          )}
        </div>

        {/* HAMBURGER BUTTON - Visible only on Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
        >
          <div className="w-6 h-0.5 bg-brand-mint mb-1.5 transition-all"></div>
          <div className="w-6 h-0.5 bg-brand-mint mb-1.5"></div>
          <div className="w-4 h-0.5 bg-brand-mint ml-auto"></div>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-slate-800 border-b border-slate-700 ${isOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-6">
          <a 
            href="https://niconic.dev" 
            className="text-sm font-bold text-slate-300 hover:text-brand-mint uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            Main Site
          </a>
          <Link 
            to="/" 
            className="text-sm font-bold text-brand-mint uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            Portfolio
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

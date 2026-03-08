import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <span className="text-2xl font-black text-white tracking-tighter">
                niconic<span className="text-brand-mint">.dev</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
              General Manager & Fullstack Developer
            </p>
            <div className="flex gap-4">
              {/* WhatsApp Business Link */}
              <a 
                href="https://wa.me/628123456789?text=Halo%20Nico,%20saya%20tertarik%20dengan%20jasa%20digital%20printing/web%20Anda." 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-mint hover:text-slate-900 transition-all"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              {/* Upwork Link */}
              <a 
                href="https://www.upwork.com/freelancers/~yourprofile" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-mint hover:text-slate-900 transition-all"
              >
                <i className="fas fa-briefcase"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Navigation</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-brand-mint transition-colors">Portfolio</Link></li>
              <li><a href="https://niconic.dev" className="hover:text-brand-mint transition-colors">Main Site</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex flex-col">
                <span className="text-[10px] text-slate-600 uppercase">Email</span>
                <span className="text-slate-200">hello@niconic.dev</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] text-slate-600 uppercase">Location</span>
                <span className="text-slate-200">Jakarta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} niconic.dev — Built with React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

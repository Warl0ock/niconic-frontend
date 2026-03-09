// src/components/Demo.jsx
import React from 'react';

const Demo = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-brand-mint font-black tracking-[0.3em] text-xs mb-4 uppercase">Operational Excellence</h2>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-12 uppercase tracking-tighter">
          CORE <span className="text-brand-mint italic">SYSTEM</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Utama: System BSM Core (Rebranded) */}
          <div className="bg-slate-800/30 border border-slate-700/50 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-brand-mint transition-all">
            <div className="w-20 h-20 bg-brand-mint rounded-3xl flex items-center justify-center text-3xl text-slate-900 mb-8 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Iconic ERP Suite</h3>
            <p className="text-slate-400 leading-relaxed mb-10">
              Sistem manajemen terintegrasi yang mencakup modul Payroll, Delivery Orders, dan Budgeting 
              yang dioptimasi untuk efisiensi operasional tingkat tinggi.
            </p>
            <a 
              href="/demo/core-system" 
              className="inline-block px-10 py-4 bg-brand-mint text-slate-900 font-black rounded-2xl uppercase text-xs tracking-widest hover:scale-105 transition-all"
            >
              Uji Coba Sistem
            </a>
          </div>
          
          {/* Card Placeholder untuk Sistem Lainnya */}
          <div className="bg-slate-800/10 border border-dashed border-slate-700 p-10 rounded-[3rem] flex flex-col justify-center items-center text-center">
            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">More Demos Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;

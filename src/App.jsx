import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import Admin from './Admin'; // <--- TAMBAHKAN IMPORT INI
import Navbar from './components/Navbar'; // Import komponen baru

// Komponen Home (Tetap seperti kode Anda)
function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-mint selection:text-slate-900 pb-20">
      {/* ... (Konten Hero & Portfolio Section Anda tetap sama) ... */}
      <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-mint to-brand-navy">
              niconic.dev
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed">
            Crafting <span className="text-brand-mint font-semibold">Iconic</span> Digital Solutions.
          </p>
        </div>
      </section>

      <section id="portfolio" className="max-w-6xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="text-center text-brand-mint py-20 animate-pulse">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
            {projects.map((project) => (
              <Link 
                to={`/project/${project.id}`}
                key={project.id} 
                className={`group relative rounded-2xl p-6 flex flex-col justify-end overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-mint/20 border border-slate-700/50 hover:border-brand-mint/50 cursor-pointer ${project.spanClasses}`}
              >
                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                <div className="relative z-10">
                  <span className="text-brand-mint text-xs font-mono mb-2 block uppercase">{project.category}</span>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Komponen Utama App
function App() {
  return (
    <Router basename="/portfolio">
      <Navbar /> {/* Letakkan di sini agar muncul di tiap halaman */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/admin-niconic" element={<Admin />} /> 
      </Routes>
    </Router>
  );
}

export default App;

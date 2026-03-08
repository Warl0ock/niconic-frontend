import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';

// Pindahkan konten Home ke dalam komponen tersendiri agar lebih rapi
function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sesuaikan IP ini
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-mint selection:text-slate-900 pb-20">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-mint to-brand-navy">
              niconic.dev
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed">
            Crafting <span className="text-brand-mint font-semibold">Iconic</span> Digital Solutions. <br/>
            Bridging solid server architecture with dynamic interfaces.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#portfolio" className="px-8 py-3 rounded-full bg-brand-mint text-slate-900 font-semibold hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(108,235,210,0.3)]">
              Explore My Work
            </a>
            <button className="px-8 py-3 rounded-full border border-brand-navy text-brand-mint hover:bg-brand-navy/30 transition-colors">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 mt-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Selected Works</h2>
            <p className="text-slate-400">A showcase of systems, code, and engineering.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-brand-mint py-20 animate-pulse">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
            {projects.map((project) => (
              // Perubahan Krusial: div diganti menjadi Link dari react-router-dom
              <Link 
                to={`/project/${project.id}`}
                key={project.id} 
                className={`group relative rounded-2xl p-6 flex flex-col justify-end overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-mint/20 border border-slate-700/50 hover:border-brand-mint/50 cursor-pointer ${project.spanClasses}`}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-brand-mint text-xs font-mono mb-2 block tracking-wider uppercase drop-shadow-md">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-md bg-slate-800/80 border border-slate-600 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Komponen Utama App yang membungkus Routing
function App() {
  return (
// Ubah dari <Router> menjadi:
<Router basename="/portfolio">
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/project/:id" element={<ProjectDetail />} />
    <Route path="/admin-niconic" element={<Admin />} /> {/* Rute Admin baru */}
  </Routes>
</Router>
  );
}

export default App;

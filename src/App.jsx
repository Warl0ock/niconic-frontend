import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import Admin from './Admin'; 
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; // Import filenya

// Komponen Home yang merender Bento Grid secara Dinamis
function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pastikan API Anda mengirimkan field 'size' (small, medium, large)
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  // Fungsi Helper untuk menentukan class Tailwind berdasarkan ukuran
  const getGridClasses = (size) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2 h-full'; // Menonjol (Featured)
      case 'medium':
        return 'md:col-span-2 md:row-span-1 h-full'; // Lebar (Trending)
      case 'small':
        return 'md:col-span-1 md:row-span-1 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'; // Arsip (Lama)
      default:
        return 'md:col-span-1 md:row-span-1';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-mint selection:text-slate-900 pb-20">
      
      {/* Hero Section */}
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

      {/* Portfolio Section dengan Bento Grid Dinamis */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="text-center text-brand-mint py-20 animate-pulse font-mono">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {projects.map((project) => (
              <Link 
                to={`/project/${project.id}`}
                key={project.id} 
                className={`group relative rounded-3xl p-8 flex flex-col justify-end overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-slate-700/50 hover:border-brand-mint/50 cursor-pointer shadow-2xl ${getGridClasses(project.size || project.spanClasses)}`}
              >
                {/* Background Image */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110" 
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                
                {/* Content Info (Disembunyikan sedikit jika 'small' agar clean) */}
                <div className={`relative z-10 transition-all duration-300 ${project.size === 'small' ? 'scale-90 origin-bottom-left group-hover:scale-100' : ''}`}>
                  <span className="text-brand-mint text-[10px] font-mono mb-2 block uppercase tracking-[0.3em]">
                    {project.category}
                  </span>
                  <h3 className={`${project.size === 'large' ? 'text-3xl' : 'text-xl'} font-bold mb-1 text-white leading-tight`}>
                    {project.title}
                  </h3>
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/admin-niconic" element={<Admin />} /> 
          </Routes>
        </main>
        <Footer /> {/* Letakkan di sini agar selalu di bawah */}
      </div>
    </Router>
  );
}

export default App;

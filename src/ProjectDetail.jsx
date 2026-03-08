import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProjectDetail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ingat: Sesuaikan IP ini dengan IP Backend Anda
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-mint text-xl">Loading Case Study...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">Project Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 pt-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Tombol Kembali */}
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-brand-mint mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Portfolio
        </Link>

        {/* Header Proyek */}
        <span className="text-brand-mint font-mono tracking-wider uppercase text-sm mb-4 block">
          {project.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
        
        <div className="flex gap-2 mb-10">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-sm border border-slate-700 text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        {/* Gambar Cover Besar */}
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-[400px] object-cover rounded-2xl mb-12 border border-slate-700/50 shadow-2xl"
        />

        {/* Konten Studi Kasus (Dummy teks untuk saat ini) */}
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
          <p className="mb-6">
           {project.description || "Deskripsi belum diisi."
          </p>
          <h2 className="text-2xl font-bold text-white mb-4">The Challenge</h2>
          <p>
            {project.challenge || "Tantangan belum diisi."}
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProjectDetail;

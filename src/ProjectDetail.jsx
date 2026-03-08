import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        // Mengambil detail proyek dari API backend Anda
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Gagal mengambil detail proyek:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-brand-mint animate-pulse font-mono tracking-widest uppercase">Initializing Detail...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl mb-4 font-bold">Proyek tidak ditemukan</h2>
        <Link to="/" className="px-6 py-2 bg-brand-mint text-slate-900 rounded-full font-bold">Kembali ke Portfolio</Link>
      </div>
    );
  }

  // FIX: Data gallery sekarang sudah dalam bentuk Array dari backend
  // Kita gunakan optional chaining (?.) untuk keamanan tambahan.
  const galleryImages = Array.isArray(project.gallery) ? project.gallery : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-20">
      {/* NAVIGATION - Diarahkan ke root portfolio */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-mint transition-colors font-bold tracking-tighter">
          <span>←</span> BACK TO PROJECTS
        </Link>
        <div className="text-[10px] tracking-[0.3em] text-slate-500 uppercase font-black">{project.category}</div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        <header className="mb-12">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {/* FIX: Map Tags dengan pengecekan array */}
            {Array.isArray(project.tags) && project.tags.map((tag, index) => (
              <span key={index} className="px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-[10px] font-bold text-brand-mint uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* GALLERY SECTION - Responsif dan Halus */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] bg-slate-800 border border-slate-700/50 mb-16 group">
          {galleryImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={galleryImages.length > 1}
              className="aspect-video w-full"
            >
              {galleryImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`${project.title} gallery ${index + 1}`} className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="aspect-video w-full">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}
        </section>

        {/* CONTENT GRID */}
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-16">
            <section>
              <h2 className="text-xs font-black text-brand-mint uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                <span className="h-[1px] w-8 bg-brand-mint"></span> Project Overview
              </h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line text-xl font-medium">
                {project.description || "Project documentation under review."}
              </div>
            </section>
            
            <section>
              <h2 className="text-xs font-black text-brand-mint uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                <span className="h-[1px] w-8 bg-brand-mint"></span> The Challenge & Strategy
              </h2>
              <div className="text-slate-400 leading-relaxed whitespace-pre-line text-lg italic border-l-4 border-brand-mint/20 pl-8 py-2">
                {project.challenge || "Standard operational excellence applied."}
              </div>
            </section>
          </div>

          {/* SIDEBAR INFO */}
          <aside className="md:col-span-1 space-y-10 bg-slate-800/20 p-10 rounded-[2rem] border border-slate-800/50 h-fit backdrop-blur-sm">
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Service</h3>
              <p className="text-white font-bold text-lg">{project.category}</p>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Release Year</h3>
              <p className="text-white font-bold text-lg">2026</p>
            </div>
            {/* Tombol interaktif untuk portofolio periklanan Anda */}
            <button 
              onClick={() => window.open('https://niconic.dev', '_blank')}
              className="w-full py-4 bg-brand-mint text-slate-900 font-black rounded-2xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 text-xs tracking-widest uppercase"
            >
              Inquiry Project
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;

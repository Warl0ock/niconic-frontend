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
    // Scroll ke atas setiap kali membuka halaman detail
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-brand-mint animate-pulse font-mono tracking-widest">LOADING PROJECT...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl mb-4">Proyek tidak ditemukan</h2>
        <Link to="/portfolio" className="text-brand-mint hover:underline">Kembali ke Portfolio</Link>
      </div>
    );
  }

  // Parse gallery images (JSON dari database)
  const galleryImages = project.gallery ? JSON.parse(project.gallery) : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-20">
      {/* Navigation Header */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/portfolio" className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-mint transition-colors">
          <span>←</span> BACK TO PROJECTS
        </Link>
        <div className="text-xs tracking-widest text-slate-500 uppercase">{project.category}</div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        {/* Project Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-brand-mint">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* MODERN SLIDESHOW SECTION */}
        <section className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-800 border border-slate-700 mb-16 group">
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
                  <img 
                    src={img} 
                    alt={`${project.title} slide ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            /* Fallback jika gallery kosong, tampilkan thumbnail utama */
            <div className="aspect-video w-full">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}
        </section>

        {/* CONTENT SECTION (Overview & Challenge) */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            {/* Dynamic Project Overview */}
            <section>
              <h2 className="text-xl font-bold text-brand-mint uppercase tracking-widest mb-4">Project Overview</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                {project.description || "No description provided for this project."}
              </div>
            </section>

            {/* Dynamic Challenge */}
            <section>
              <h2 className="text-xl font-bold text-brand-mint uppercase tracking-widest mb-4">The Challenge</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line text-lg italic border-l-2 border-slate-700 pl-6">
                {project.challenge || "No challenge details recorded."}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <aside className="md:col-span-1 space-y-8 bg-slate-800/30 p-8 rounded-2xl border border-slate-800 h-fit">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</h3>
              <p className="text-white font-medium">{project.category}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Client / Brand</h3>
              <p className="text-white font-medium">Internal Project</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Timeline</h3>
              <p className="text-white font-medium">2026</p>
            </div>
            <button className="w-full py-3 bg-brand-mint text-slate-900 font-bold rounded-xl hover:scale-[1.02] transition-transform">
              VISIT LIVE SITE
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;

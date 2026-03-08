import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [thumbFile, setThumbFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // UPDATE: Menambahkan property 'size' ke dalam state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    size: 'medium', // Default ukuran standar
    spanClasses: 'md:col-span-1 md:row-span-1',
    description: '',
    challenge: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data proyek");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token === 'niconic-auth-token-2026') {
      setIsLoggedIn(true);
      fetchProjects();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput }),
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      fetchProjects();
    } else {
      alert(data.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus proyek ini?')) {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Terhapus!');
        fetchProjects();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbFile) return alert("Mohon pilih gambar thumbnail utama.");
    
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('thumbnail', thumbFile);
      
      if (galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          uploadData.append('gallery', galleryFiles[i]);
        }
      }

      const uploadRes = await fetch('/api/upload', { 
        method: 'POST', 
        body: uploadData 
      });
      const uploadResult = await uploadRes.json();

      // Payload final yang menyertakan 'size' untuk Bento Grid
      const finalPayload = {
        ...formData,
        image: uploadResult.thumbnailUrl,
        gallery: uploadResult.galleryUrls || [],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (res.ok) {
        alert('🚀 Proyek Berhasil Disimpan!');
        setFormData({ 
          title: '', category: '', tags: '', 
          size: 'medium', // Reset ke medium
          spanClasses: 'md:col-span-1 md:row-span-1', 
          description: '', challenge: '' 
        });
        setThumbFile(null);
        setGalleryFiles([]);
        fetchProjects();
      }
    } catch (err) { 
      alert('Gagal mengunggah data!'); 
    } finally { 
      setIsUploading(false); 
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-80 shadow-2xl">
          <h2 className="text-xl font-bold text-brand-mint mb-4 text-center">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-2 bg-slate-900 rounded border border-slate-700 text-white mb-4 outline-none focus:border-brand-mint" 
            value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)} 
          />
          <button type="submit" className="w-full bg-brand-mint text-slate-900 font-bold py-2 rounded hover:bg-emerald-300 transition-colors">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-900 text-white rounded-xl mt-10 shadow-2xl border border-slate-800">
      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* KOLOM KIRI: FORM INPUT */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-brand-mint border-b border-slate-700 pb-2">Tambah Proyek Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Judul Proyek" className="p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint" 
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <input type="text" placeholder="Kategori" className="p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint" 
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
            </div>

            <input type="text" placeholder="Tags (Contoh: Advertising, Printing, React)" className="w-full p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint" 
              value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
                <label className="text-[10px] text-brand-mint uppercase font-bold block mb-1">Thumbnail (Bento)</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files[0])} className="text-[10px] text-slate-400 w-full" />
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
                <label className="text-[10px] text-brand-mint uppercase font-bold block mb-1">Gallery (Slideshow)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="text-[10px] text-slate-400 w-full" />
              </div>
            </div>

            {/* UPDATE: Dropdown Ukuran Bento Grid */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 ml-1">Ukuran Strategis (Bento Logic)</label>
              <select 
                className="w-full p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint cursor-pointer" 
                value={formData.size} 
                onChange={(e) => setFormData({...formData, size: e.target.value})}
              >
                <option value="small">Small (Arsip / Pudar)</option>
                <option value="medium">Medium (Ukuran Standar)</option>
                <option value="large">Large (Proyek Unggulan / GROW)</option>
              </select>
              <p className="text-[9px] text-slate-500 italic ml-1">*Pilih 'Small' untuk proyek lama agar otomatis tampil grayscale.</p>
            </div>

            <textarea placeholder="Project Overview..." className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-28 outline-none focus:border-brand-mint"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            
            <textarea placeholder="The Challenge & Solution..." className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-28 outline-none focus:border-brand-mint"
              value={formData.challenge} onChange={(e) => setFormData({...formData, challenge: e.target.value})} />

            <button disabled={isUploading} className={`w-full p-3 rounded-lg font-bold transition-all shadow-lg ${isUploading ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-brand-mint text-slate-900 hover:scale-[1.01] active:scale-95 shadow-brand-mint/10'}`}>
              {isUploading ? 'Sedang Memproses...' : '🚀 Publikasikan Proyek'}
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR PROYEK */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-400 border-b border-slate-700 pb-2 mb-4">Daftar Portofolio</h2>
          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-2 custom-scrollbar">
            {projects.length > 0 ? projects.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                    {p.image && <img src={p.image} className="w-full h-full object-cover" alt="thumb" />}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-slate-200 truncate">{p.title}</p>
                    <div className="flex gap-2 items-center">
                       <span className="text-[9px] text-brand-mint uppercase tracking-wider font-bold">{p.category}</span>
                       <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase ${p.size === 'small' ? 'border-slate-500 text-slate-500' : 'border-brand-mint text-brand-mint'}`}>
                         {p.size || 'medium'}
                       </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-white hover:bg-red-600 transition-all text-[10px] font-bold px-3 py-2 bg-red-900/10 rounded-lg border border-red-900/30">
                  Hapus
                </button>
              </div>
            )) : <p className="text-center text-slate-500 py-10">Belum ada proyek yang ditambahkan.</p>}
          </div>
          
          <button 
            onClick={() => {sessionStorage.removeItem('adminToken'); window.location.reload();}} 
            className="mt-6 text-xs text-slate-600 hover:text-red-400 transition-colors text-center uppercase tracking-[0.2em]"
          >
            Logout Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

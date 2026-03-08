import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [thumbFile, setThumbFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // UPDATE: Pastikan image & gallery masuk ke state awal agar tidak hilang pas edit
  const [formData, setFormData] = useState({
    title: '', category: '', tags: '',
    size: 'medium', 
    image: '', // Menyimpan URL gambar lama
    gallery: [], // Menyimpan Array gallery lama
    description: '', challenge: ''
  });

  // Fungsi Reset Form
  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ 
        title: '', category: '', tags: '', size: 'medium', 
        image: '', gallery: [], description: '', challenge: '' 
    });
    setThumbFile(null);
    setGalleryFiles([]);
  };

  // FIX: Fungsi startEdit sekarang membawa data gambar lama
  const startEdit = (project) => {
    setIsEditing(true);
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      category: project.category || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
      size: project.size || 'medium',
      image: project.image || '', // PENTING: Mengunci URL foto bento lama
      gallery: project.gallery || [], // PENTING: Mengunci array foto detail lama
      description: project.description || '',
      challenge: project.challenge || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Gagal ambil data"); }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token === 'niconic-auth-token-2026') { setIsLoggedIn(true); fetchProjects(); }
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
    } else { alert(data.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus proyek ini?')) {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) { fetchProjects(); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // DEFAULT: Gunakan gambar yang sudah ada di state (gambar lama)
      let thumbnailUrl = formData.image; 
      let galleryUrls = formData.gallery;

      // JIKA ada file baru yang diinput, baru lakukan upload ke server
      if (thumbFile || galleryFiles.length > 0) {
        const uploadData = new FormData();
        if (thumbFile) uploadData.append('thumbnail', thumbFile);
        if (galleryFiles.length > 0) {
          for (let i = 0; i < galleryFiles.length; i++) uploadData.append('gallery', galleryFiles[i]);
        }
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const uploadResult = await uploadRes.json();
        
        // Update URL jika upload berhasil
        if (thumbFile) thumbnailUrl = uploadResult.thumbnailUrl;
        if (galleryFiles.length > 0) galleryUrls = uploadResult.galleryUrls;
      }

      const finalPayload = {
        ...formData,
        image: thumbnailUrl,
        gallery: galleryUrls || [],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const url = isEditing ? `/api/projects/${editingId}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (res.ok) {
        alert(isEditing ? '✅ Berhasil Update!' : '🚀 Berhasil Upload!');
        resetForm();
        fetchProjects();
      }
    } catch (err) { alert('Gagal memproses data!'); }
    finally { setIsUploading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-80 shadow-2xl">
          <h2 className="text-xl font-bold text-brand-mint mb-4 text-center">Admin Access</h2>
          <input type="password" placeholder="Password" className="w-full p-2 bg-slate-900 rounded border border-slate-700 text-white mb-4 outline-none focus:border-brand-mint" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-brand-mint text-slate-900 font-bold py-2 rounded hover:brightness-110 transition-all">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-900 text-white rounded-xl mt-10 shadow-2xl border border-slate-800 mb-20">
      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* KOLOM KIRI: FORM (EDIT/ADD) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <h2 className="text-2xl font-bold text-brand-mint">
              {isEditing ? '✏️ Mode Edit' : '✨ Proyek Baru'}
            </h2>
            {isEditing && (
              <button onClick={resetForm} className="text-[10px] bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-500 transition-colors">Batal Edit / Reset</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Judul Proyek" className="p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <input type="text" placeholder="Kategori" className="p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 ml-1 uppercase font-bold tracking-widest">Ukuran Bento Grid</label>
              <select className="w-full p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-brand-mint cursor-pointer" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})}>
                <option value="small">Small (Arsip / Grayscale)</option>
                <option value="medium">Medium (Standar)</option>
                <option value="large">Large (Featured / Utama)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
                <label className="text-[10px] text-brand-mint uppercase font-bold block mb-1">Update Thumbnail</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files[0])} className="text-[10px] text-slate-400 w-full" />
                {isEditing && !thumbFile && <p className="text-[9px] text-slate-500 mt-1">*Kosongkan jika tetap pakai foto lama</p>}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
                <label className="text-[10px] text-brand-mint uppercase font-bold block mb-1">Update Gallery</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="text-[10px] text-slate-400 w-full" />
                {isEditing && galleryFiles.length === 0 && <p className="text-[9px] text-slate-500 mt-1">*Kosongkan jika tetap pakai gallery lama</p>}
              </div>
            </div>

            <textarea placeholder="Description..." className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-24 outline-none focus:border-brand-mint" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />

            <button disabled={isUploading} className={`w-full p-3 rounded-xl font-bold transition-all shadow-lg ${isUploading ? 'bg-slate-600' : isEditing ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-brand-mint text-slate-900 hover:bg-emerald-300'}`}>
              {isUploading ? 'Menyimpan...' : isEditing ? '💾 Simpan Perubahan' : '🚀 Publikasikan Proyek'}
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR PROYEK */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-400 border-b border-slate-700 pb-2 mb-4">Daftar Karya</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {projects.map((p) => (
              <div key={p.id} className={`flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer ${editingId === p.id ? 'bg-brand-mint/10 border-brand-mint shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'}`} onClick={() => startEdit(p)}>
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                    {p.image && <img src={p.image} className="w-full h-full object-cover" alt="thumb" />}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-slate-200 truncate">{p.title}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase font-black ${p.size === 'small' ? 'border-slate-600 text-slate-600' : 'border-brand-mint text-brand-mint'}`}>{p.size || 'medium'}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="text-red-400 hover:text-white hover:bg-red-600 transition-all text-[9px] font-bold px-3 py-1.5 bg-red-900/10 rounded-lg border border-red-900/30">Hapus</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

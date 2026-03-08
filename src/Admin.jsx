import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [projects, setProjects] = useState([]); // State untuk daftar proyek
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', tags: '', image: '', spanClasses: 'md:col-span-1 md:row-span-1', description: '', challenge: ''1'
  });

  // Fungsi untuk mengambil data proyek
  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
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
        fetchProjects(); // Refresh daftar
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = formData.image;
      if (file) {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const uploadResult = await uploadRes.json();
        finalImageUrl = uploadResult.imageUrl;
      }

      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...formData, 
            image: finalImageUrl, 
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [] 
        }),
      });
      alert('🚀 Berhasil!');
      setFormData({ title: '', category: '', tags: '', image: '', spanClasses: 'md:col-span-1 md:row-span-1' });
      setFile(null);
      fetchProjects();
    } catch (err) { alert('Gagal!'); }
    finally { setIsUploading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-80">
          <h2 className="text-xl font-bold text-brand-mint mb-4 text-center">Admin Login</h2>
          <input type="password" placeholder="Password" className="w-full p-2 bg-slate-900 rounded border border-slate-700 text-white mb-4 outline-none" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-brand-mint text-slate-900 font-bold py-2 rounded">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-900 text-white rounded-xl mt-10 shadow-2xl border border-slate-800">
      <div className="grid md:grid-cols-2 gap-8">
        {/* KOLOM KIRI: FORM INPUT */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-mint mb-4">Tambah Proyek</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
             <input type="text" placeholder="Judul Proyek" className="w-full p-2 bg-slate-800 rounded border border-slate-700" 
               value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
             <input type="text" placeholder="Kategori" className="w-full p-2 bg-slate-800 rounded border border-slate-700" 
               value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
             <input type="text" placeholder="Tags (koma)" className="w-full p-2 bg-slate-800 rounded border border-slate-700" 
               value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
             <div className="p-4 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
               <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-slate-400" />
             </div>
            <textarea placeholder="Project Overview" className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-24"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <textarea placeholder="The Challenge" className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-24"
              value={formData.challenge} onChange={(e) => setFormData({...formData, challenge: e.target.value})} />
             <button disabled={isUploading} className="w-full p-3 rounded-lg font-bold bg-brand-mint text-slate-900">
               {isUploading ? 'Menyimpan...' : '🚀 Simpan'}
             </button>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR PROYEK (HAPUS) */}
        <div>
          <h2 className="text-2xl font-bold text-slate-400 mb-4">Kelola Proyek</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {projects.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-3 bg-slate-800 rounded border border-slate-700">
                <div className="truncate mr-4">
                  <p className="font-bold text-sm">{p.title}</p>
                  <p className="text-[10px] text-slate-500">{p.category}</p>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-xs font-bold p-2 bg-red-900/20 rounded">
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => {sessionStorage.removeItem('adminToken'); setIsLoggedIn(false);}} className="mt-8 text-xs text-slate-500 hover:underline">Logout</button>
    </div>
  );
};

export default Admin;

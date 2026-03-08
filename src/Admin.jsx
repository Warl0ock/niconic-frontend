import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', tags: '', image: '', spanClasses: 'md:col-span-1 md:row-span-1'
  });

  // Cek status login saat halaman dibuka
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token === 'niconic-auth-token-2026') setIsLoggedIn(true);
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
    } else {
      alert(data.message);
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
    // Perbaikan: pastikan tags adalah string sebelum di-split, jika kosong kirim array kosong
    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [] 
  }),
});
      alert('🚀 Proyek Berhasil!');
      setFormData({ title: '', category: '', tags: '', image: '', spanClasses: 'md:col-span-1 md:row-span-1' });
      setFile(null);
    } catch (err) { alert('Gagal!'); }
    finally { setIsUploading(false); }
  };

  // Tampilan Form Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-80">
          <h2 className="text-xl font-bold text-brand-mint mb-4 text-center">Admin Login</h2>
          <input type="password" placeholder="Masukkan Password" 
            className="w-full p-2 bg-slate-900 rounded border border-slate-700 text-white mb-4 outline-none focus:border-brand-mint"
            value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-brand-mint text-slate-900 font-bold py-2 rounded hover:bg-emerald-300 transition">Enter</button>
        </form>
      </div>
    );
  }

  // Tampilan Dashboard Admin (Tetap seperti sebelumnya)
  return (
    <div className="p-8 max-w-lg mx-auto bg-slate-900 text-white rounded-xl mt-10 shadow-2xl border border-slate-800">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-mint">Admin Dashboard</h2>
          <button onClick={() => {sessionStorage.removeItem('adminToken'); setIsLoggedIn(false);}} className="text-xs text-red-400 hover:underline">Logout</button>
       </div>
       {/* ... Form input yang sama seperti sebelumnya ... */}
       <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Judul Proyek" className="w-full p-2 bg-slate-800 rounded border border-slate-700" 
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <input type="text" placeholder="Kategori" className="w-full p-2 bg-slate-800 rounded border border-slate-700" 
            value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          <div className="p-4 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-slate-400" />
          </div>
          <button disabled={isUploading} className="w-full p-3 rounded-lg font-bold bg-brand-mint text-slate-900">
            {isUploading ? 'Uploading...' : '🚀 Simpan Proyek'}
          </button>
       </form>
    </div>
  );
};

export default Admin;

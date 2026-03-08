import React, { useState } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    image: '', // Tetap ada untuk opsi URL manual
    spanClasses: 'md:col-span-1 md:row-span-1'
  });

  const [file, setFile] = useState(null); // State untuk menampung file gambar
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = formData.image;

      // 1. Proses Upload Gambar jika ada file yang dipilih
      if (file) {
        const uploadData = new FormData();
        uploadData.append('image', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (!uploadRes.ok) throw new Error('Gagal mengunggah gambar');
        
        const uploadResult = await uploadRes.json();
        finalImageUrl = uploadResult.imageUrl; // Dapatkan URL dari backend
      }

      // 2. Simpan Data Proyek ke Database
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: finalImageUrl,
          tags: formData.tags.split(',').map(tag => tag.trim())
        }),
      });

      if (response.ok) {
        alert('🚀 Proyek berhasil ditambahkan!');
        // Reset Form
        setFormData({ title: '', category: '', tags: '', image: '', spanClasses: 'md:col-span-1 md:row-span-1' });
        setFile(null);
        // Reset input file secara manual
        document.getElementById('fileInput').value = '';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Terjadi kesalahan: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-slate-900 text-white rounded-xl mt-10 shadow-2xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-brand-mint">Admin Panel Portofolio</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Text Dasar */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 ml-1">Judul Proyek</label>
          <input type="text" placeholder="Contoh: Modifikasi Corolla KE30" className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:border-brand-mint outline-none" 
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-slate-400 ml-1">Kategori</label>
          <input type="text" placeholder="Contoh: Automotive / Advertising" className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:border-brand-mint outline-none" 
            value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 ml-1">Tags (pisahkan dengan koma)</label>
          <input type="text" placeholder="PHP, MySQL, Engine Swap" className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:border-brand-mint outline-none" 
            value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
        </div>

        {/* INPUT UPLOAD GAMBAR */}
        <div className="space-y-1 p-4 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
          <label className="text-sm font-semibold text-brand-mint block mb-2">Upload Gambar Proyek</label>
          <input 
            id="fileInput"
            type="file" 
            accept="image/*"
            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-mint file:text-slate-900 hover:file:bg-emerald-300"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="text-[10px] text-slate-500 mt-2">*Atau masukkan URL jika tidak ingin upload</p>
          <input type="text" placeholder="https://..." className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-xs mt-1" 
            value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
        </div>

        {/* Pemilihan Ukuran Grid */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 ml-1">Ukuran Tampilan (Bento Grid)</label>
          <select className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:border-brand-mint outline-none" 
            value={formData.spanClasses} onChange={(e) => setFormData({...formData, spanClasses: e.target.value})}>
            <option value="md:col-span-1 md:row-span-1">Kecil (1x1)</option>
            <option value="md:col-span-2 md:row-span-1">Lebar (2x1)</option>
            <option value="md:col-span-1 md:row-span-2">Tinggi (1x2)</option>
            <option value="md:col-span-2 md:row-span-2">Besar (2x2)</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={isUploading}
          className={`w-full p-3 rounded-lg font-bold transition-all ${isUploading ? 'bg-slate-600 cursor-not-allowed' : 'bg-brand-mint text-slate-900 hover:bg-emerald-300 shadow-lg shadow-brand-mint/20'}`}
        >
          {isUploading ? 'Sedang Memproses...' : '🚀 Simpan Proyek Ke Portofolio'}
        </button>
      </form>
    </div>
  );
};

export default Admin;

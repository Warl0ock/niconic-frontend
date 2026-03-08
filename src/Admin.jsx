import React, { useState } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    image: '',
    spanClasses: 'md:col-span-1 md:row-span-1'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()) // Mengubah string ke array
        }),
      });

      if (response.ok) {
        alert('Proyek berhasil ditambahkan!');
        setFormData({ title: '', category: '', tags: '', image: '', spanClasses: 'md:col-span-1 md:row-span-1' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menambah proyek');
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-slate-900 text-white rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Tambah Proyek Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Judul Proyek" className="w-full p-2 bg-slate-800 rounded" 
          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        
        <input type="text" placeholder="Kategori (misal: Digital Printing)" className="w-full p-2 bg-slate-800 rounded" 
          value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
        
        <input type="text" placeholder="Tags (pisahkan dengan koma)" className="w-full p-2 bg-slate-800 rounded" 
          value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
        
        <input type="text" placeholder="URL Gambar" className="w-full p-2 bg-slate-800 rounded" 
          value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />

        <select className="w-full p-2 bg-slate-800 rounded text-gray-400" 
          value={formData.spanClasses} onChange={(e) => setFormData({...formData, spanClasses: e.target.value})}>
          <option value="md:col-span-1 md:row-span-1">Kecil (1x1)</option>
          <option value="md:col-span-2 md:row-span-1">Lebar (2x1)</option>
          <option value="md:col-span-1 md:row-span-2">Tinggi (1x2)</option>
          <option value="md:col-span-2 md:row-span-2">Besar (2x2)</option>
        </select>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold transition">
          Simpan Proyek
        </button>
      </form>
    </div>
  );
};

export default Admin;

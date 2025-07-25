import React, { useState } from 'react';
import { useAuth } from '../Pages/AuthContext';

const ReportLostItem = () => {
  const { user } = useAuth(); // get logged in user info
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date_lost: '',
    category: '',
    lost_by: '',
    contact_info: '',
    image_url: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, image_url: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      body.append(key, val);
    });
    body.append('user_id', user?.id); // attach user_id to backend

    const res = await fetch('http://localhost:5000/api/items/lost_items', {
      method: 'POST',
      body,
    });

    if (res.ok) {
      alert('✅ Lost item reported!');
      setFormData({
        name: '',
        description: '',
        location: '',
        date_lost: '',
        category: '',
        lost_by: '',
        contact_info: '',
        image_url: null,
      });
    } else {
      alert('❌ Error reporting item');
    }
  };
  console.log('Authenticated user:', user);
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 border mt-6"
    >
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">📣 Report Lost Item</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required className="input-style" />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input-style" />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location Lost" required className="input-style" />
        <input type="date" name="date_lost" value={formData.date_lost} onChange={handleChange} required className="input-style" />
        <input name="lost_by" value={formData.lost_by} onChange={handleChange} placeholder="Your Full Name" required className="input-style" />
        <input name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="Contact Info" required className="input-style" />
      </div>

      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Item Description" required className="input-style h-28 resize-none" />

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">📷 Upload Item Photo</label>
        <input type="file" name="image_url" accept="image/*" onChange={handleChange} className="file-input file-input-bordered file-input-sm w-full" />
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200">
        Submit Lost Report
      </button>
    </form>
  );
};

export default ReportLostItem;

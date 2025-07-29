import React, { useState } from 'react';
import { useAuth } from '../Pages/AuthContext';

const ReportFoundItem = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date_found: '',
    category: '',
    found_by: '',
    contact_info: '',
    image_url: null,
  });
  const [success, setSuccess] = useState('');

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
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    form.append('user_id', user?.id); // ✅ Add logged-in user ID

    try {
      const res = await fetch('https://server-production-82bb.up.railway.app/api/items/found_items', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setSuccess('✅ Found item reported successfully!');
        setFormData({
          name: '',
          description: '',
          location: '',
          date_found: '',
          category: '',
          found_by: '',
          contact_info: '',
          image_url: null,
        });
      } else {
        const errorText = await res.text();
        console.error('❌ Submit failed:', errorText);
        setSuccess('❌ Failed to submit found item.');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setSuccess('❌ Network or server error occurred.');
    }

    setTimeout(() => setSuccess(''), 5000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 mt-6 bg-white rounded-2xl shadow-lg space-y-6 border"
    >
      <h2 className="text-3xl font-bold text-green-700 text-center">✅ Report Found Item</h2>

      {success && (
        <p className="text-center text-sm font-medium text-green-600 animate-pulse">{success}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required className="input-style" />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input-style" />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location Found" required className="input-style" />
        <input type="date" name="date_found" value={formData.date_found} onChange={handleChange} required className="input-style" />
        <input name="found_by" value={formData.found_by} onChange={handleChange} placeholder="Your Full Name" required className="input-style" />
        <input name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="Contact Info" required className="input-style" />
      </div>

      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Item Description" required className="input-style h-28 resize-none" />

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">📷 Upload Item Photo</label>
        <input type="file" name="image_url" accept="image/*" capture="environment" onChange={handleChange} className="file-input file-input-bordered file-input-sm w-full" />
      </div>

      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition duration-200">
        Submit Found Report
      </button>
    </form>
  );
};

export default ReportFoundItem;

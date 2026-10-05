'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Edit, Trash, Plus, Check, X } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(0.00);
  const [salePrice, setSalePrice] = useState('');
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [apiMsg, setApiMsg] = useState('');

  const fetchServices = () => {
    setLoading(true);
    adminApi.get('/admin/services.php')
      .then(res => {
        setServices(res.services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEditClick = (service) => {
    adminApi.get(`/admin/services.php?id=${service.id}`)
      .then(res => {
        if (res && res.service) {
          const s = res.service;
          setEditingService(s);
          setTitle(s.title);
          setSlug(s.slug);
          setShortDesc(s.short_description);
          setFullDesc(s.full_description);
          setDuration(s.duration);
          setPrice(s.price);
          setSalePrice(s.sale_price || '');
          setStatus(s.status);
          setDisplayOrder(s.display_order);
          setImageFile(null);
          setApiMsg('');
        }
      });
  };

  const handleCreateNewClick = () => {
    setEditingService({ id: 0 }); // Represents new
    setTitle('');
    setSlug('');
    setShortDesc('');
    setFullDesc('');
    setDuration(60);
    setPrice(0.00);
    setSalePrice('');
    setStatus('draft');
    setDisplayOrder(0);
    setImageFile(null);
    setApiMsg('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiMsg('Saving program details...');

    // Since we need to support image uploads, we use FormData
    const formData = new FormData();
    if (editingService.id > 0) {
      formData.append('id', editingService.id);
    }
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('short_description', shortDesc);
    formData.append('full_description', fullDesc);
    formData.append('duration', duration);
    formData.append('price', price);
    if (salePrice !== '') formData.append('sale_price', salePrice);
    formData.append('status', status);
    formData.append('display_order', displayOrder);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await adminApi.post('/admin/services.php', formData);
      if (response && response.success) {
        setApiMsg('Program saved successfully!');
        setEditingService(null);
        fetchServices();
      } else {
        throw new Error(response.error || "Failed to save.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service program?")) return;
    
    try {
      const res = await adminApi.post('/admin/services.php?action=delete', { id, action: 'delete' });
      if (res && res.success) {
        fetchServices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Service Programs Management</h2>
        <button 
          onClick={handleCreateNewClick}
          className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      {editingService ? (
        /* Create/Edit Form */
        <div className="bg-white border border-gray-200 p-8 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <h3 className="font-serif text-lg font-bold text-gray-800">
              {editingService.id > 0 ? `Modify Offering: ${title}` : "Create Consultation offering"}
            </h3>
            <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {apiMsg && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 text-xs">
              {apiMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Program Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                placeholder="Burnout Recovery Session"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">URL Slug *</label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                placeholder="burnout-recovery"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider">Short Description (Cards excerpt) *</label>
              <input 
                type="text" 
                value={shortDesc} 
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                placeholder="Ex. 60-minute diagnostic session to outline stress matrices..."
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider">Full HTML Description *</label>
              <textarea 
                value={fullDesc} 
                onChange={(e) => setFullDesc(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs h-36 focus:border-darkCyan focus:outline-none"
                placeholder="HTML content mapping out list milestones..."
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Duration (Minutes) *</label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Price (INR) *</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Sale Price (INR, Optional)</label>
              <input 
                type="number" 
                value={salePrice} 
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Display Order Weight</label>
              <input 
                type="number" 
                value={displayOrder} 
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Publish Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Thumbnail Image File</label>
              <input 
                type="file" 
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-350 bg-gray-50 rounded p-2 text-xs focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 pt-4 flex gap-4">
              <button type="submit" className="btn-primary px-8 py-3 text-xs">Save Offering</button>
              <button type="button" onClick={() => setEditingService(null)} className="btn-secondary px-8 py-3 text-xs">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        /* Services Listing Grid */
        <div className="bg-white border border-gray-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-6">Loading programs...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <th className="p-3">Title</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Order</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-700">{s.title}</td>
                      <td className="p-3 text-gray-500">{s.slug}</td>
                      <td className="p-3 text-gray-600">{s.duration} Mins</td>
                      <td className="p-3 text-gray-800 font-bold">
                        {s.sale_price ? (
                          <>
                            <span className="line-through text-[10px] text-gray-400 mr-1.5">INR {s.price}</span>
                            INR {s.sale_price}
                          </>
                        ) : (
                          `INR ${s.price}`
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                          s.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-150 text-gray-600'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{s.display_order}</td>
                      <td className="p-3 text-right flex justify-end gap-3.5">
                        <button onClick={() => handleEditClick(s)} className="text-darkCyan hover:text-brightTurquoise">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700">
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-3 text-center text-gray-500">No programs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

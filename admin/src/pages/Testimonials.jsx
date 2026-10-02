import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Plus, Trash, Edit, Star } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [initials, setInitials] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(0);
  const [status, setStatus] = useState('draft');
  const [apiMsg, setApiMsg] = useState('');

  const fetchTestimonials = () => {
    setLoading(true);
    adminApi.get('/admin/testimonials.php')
      .then(res => {
        setTestimonials(res.testimonials || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEditClick = (t) => {
    setEditing(t);
    setName(t.client_name);
    setInitials(t.client_initials);
    setRating(t.rating);
    setCategory(t.service_category || '');
    setText(t.testimonial_text);
    setDisplayOrder(t.display_order);
    setIsFeatured(t.is_featured);
    setStatus(t.status);
    setApiMsg('');
  };

  const handleCreateNewClick = () => {
    setEditing({ id: 0 });
    setName('');
    setInitials('');
    setRating(5);
    setCategory('');
    setText('');
    setDisplayOrder(0);
    setIsFeatured(0);
    setStatus('draft');
    setApiMsg('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiMsg('Saving testimonial...');

    const payload = {
      id: editing.id,
      client_name: name,
      client_initials: initials,
      rating,
      service_category: category,
      testimonial_text: text,
      display_order: displayOrder,
      is_featured: isFeatured,
      status
    };

    try {
      const response = await adminApi.post('/admin/testimonials.php', payload);
      if (response && response.success) {
        setApiMsg('Testimonial saved successfully!');
        setEditing(null);
        fetchTestimonials();
      } else {
        throw new Error(response.error || "Failed to save.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial record?")) return;
    try {
      const res = await adminApi.post('/admin/testimonials.php?action=delete', { id, action: 'delete' });
      if (res && res.success) {
        fetchTestimonials();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Client Testimonials</h2>
        <button 
          onClick={handleCreateNewClick}
          className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {editing ? (
        <div className="bg-white border border-gray-200 p-8 shadow-md space-y-6">
          <h3 className="font-serif text-lg font-bold text-gray-800">
            {editing.id > 0 ? "Edit Testimonial Details" : "Create Testimonial Log"}
          </h3>

          {apiMsg && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 text-xs">
              {apiMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Client Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Client Initials *</label>
                <input 
                  type="text" 
                  value={initials} 
                  onChange={(e) => setInitials(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none text-center font-bold"
                  placeholder="MV"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Rating (1-5 Stars)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5"
                  value={rating} 
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Service Program Category</label>
                <input 
                  type="text" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                  placeholder="Executive Strategy"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Testimonial Text *</label>
              <textarea 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs h-24 focus:border-darkCyan focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="font-bold uppercase tracking-wider">Is Featured</label>
                <select 
                  value={isFeatured} 
                  onChange={(e) => setIsFeatured(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none bg-white"
                >
                  <option value="0">Standard</option>
                  <option value="1">Featured Highlight</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" className="btn-primary px-8 py-3 text-xs">Save Testimonial</button>
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-8 py-3 text-xs">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-6">Loading testimonials...</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Client</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Stars</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonials.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-700">{t.client_name}</td>
                    <td className="p-3 text-gray-500">{t.service_category}</td>
                    <td className="p-3">
                      <div className="flex text-amber-500">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                        t.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-150 text-gray-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <button onClick={() => handleEditClick(t)} className="text-darkCyan hover:text-brightTurquoise">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

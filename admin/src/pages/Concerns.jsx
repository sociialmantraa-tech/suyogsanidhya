import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Plus, Trash, Edit, Check } from 'lucide-react';

export default function Concerns() {
  const [concerns, setConcerns] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingConcern, setEditingConcern] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [apiMsg, setApiMsg] = useState('');

  const fetchConcerns = () => {
    setLoading(true);
    adminApi.get('/admin/concerns.php')
      .then(res => {
        setConcerns(res.concerns || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConcerns();
    adminApi.get('/admin/services.php')
      .then(res => setServices(res.services || []))
      .catch(err => console.error(err));
  }, []);

  const handleEditClick = (concern) => {
    adminApi.get(`/admin/concerns.php?id=${concern.id}`)
      .then(res => {
        if (res && res.concern) {
          const c = res.concern;
          setEditingConcern(c);
          setTitle(c.title);
          setSlug(c.slug);
          setDescription(c.description);
          setStatus(c.status);
          setDisplayOrder(c.display_order);
          setSelectedServiceIds(c.service_ids.map(id => parseInt(id)) || []);
          setApiMsg('');
        }
      });
  };

  const handleCreateNewClick = () => {
    setEditingConcern({ id: 0 });
    setTitle('');
    setSlug('');
    setDescription('');
    setStatus('draft');
    setDisplayOrder(0);
    setSelectedServiceIds([]);
    setApiMsg('');
  };

  const handleServiceCheckboxToggle = (id) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter(sid => sid !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiMsg('Saving concern details...');

    const payload = {
      id: editingConcern.id,
      title,
      slug,
      description,
      status,
      display_order: displayOrder,
      service_ids: selectedServiceIds
    };

    try {
      const response = await adminApi.post('/admin/concerns.php', payload);
      if (response && response.success) {
        setApiMsg('Concern saved successfully!');
        setEditingConcern(null);
        fetchConcerns();
      } else {
        throw new Error(response.error || "Failed to save.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this concern?")) return;
    try {
      const res = await adminApi.post('/admin/concerns.php?action=delete', { id, action: 'delete' });
      if (res && res.success) {
        fetchConcerns();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Concerns Mapping Dashboard</h2>
        <button 
          onClick={handleCreateNewClick}
          className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Concern
        </button>
      </div>

      {editingConcern ? (
        <div className="bg-white border border-gray-200 p-8 shadow-md space-y-6">
          <h3 className="font-serif text-lg font-bold text-gray-800">
            {editingConcern.id > 0 ? "Edit Concern Details" : "Create New Concern Card"}
          </h3>

          {apiMsg && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 text-xs">
              {apiMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Concern Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Slug *</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Description *</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs h-20 resize-none focus:border-darkCyan focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider">Display order weight</label>
                <input 
                  type="number" 
                  value={displayOrder} 
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                />
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

            {/* Mapped Service checklist */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="font-bold uppercase tracking-wider block text-gray-500">Link Related Programs</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-36 overflow-y-auto bg-gray-50 p-3 border border-gray-200">
                {services.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1">
                    <input 
                      type="checkbox" 
                      checked={selectedServiceIds.includes(s.id)}
                      onChange={() => handleServiceCheckboxToggle(s.id)}
                      className="rounded accent-darkCyan focus:ring-darkCyan"
                    />
                    <span>{s.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" className="btn-primary px-8 py-3 text-xs">Save Concern</button>
              <button type="button" onClick={() => setEditingConcern(null)} className="btn-secondary px-8 py-3 text-xs">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-6">Loading concerns...</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Title</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {concerns.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-700">{c.title}</td>
                    <td className="p-3 text-gray-500">{c.slug}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                        c.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-150 text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <button onClick={() => handleEditClick(c)} className="text-darkCyan hover:text-brightTurquoise">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">
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

'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Plus, Trash, Edit } from 'lucide-react';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Form Fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState('draft');
  const [apiMsg, setApiMsg] = useState('');

  const fetchFaqs = () => {
    setLoading(true);
    adminApi.get('/admin/faqs.php')
      .then(res => {
        setFaqs(res.faqs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleEditClick = (f) => {
    setEditing(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setDisplayOrder(f.display_order);
    setStatus(f.status);
    setApiMsg('');
  };

  const handleCreateNewClick = () => {
    setEditing({ id: 0 });
    setQuestion('');
    setAnswer('');
    setDisplayOrder(0);
    setStatus('draft');
    setApiMsg('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiMsg('Saving FAQ...');

    const payload = {
      id: editing.id,
      question,
      answer,
      display_order: displayOrder,
      status
    };

    try {
      const response = await adminApi.post('/admin/faqs.php', payload);
      if (response && response.success) {
        setApiMsg('FAQ saved successfully!');
        setEditing(null);
        fetchFaqs();
      } else {
        throw new Error(response.error || "Failed to save.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ record?")) return;
    try {
      const res = await adminApi.post('/admin/faqs.php?action=delete', { id, action: 'delete' });
      if (res && res.success) {
        fetchFaqs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">FAQ Articles Management</h2>
        <button 
          onClick={handleCreateNewClick}
          className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {editing ? (
        <div className="bg-white border border-gray-200 p-8 shadow-md space-y-6">
          <h3 className="font-serif text-lg font-bold text-gray-800">
            {editing.id > 0 ? "Edit FAQ details" : "Create FAQ card"}
          </h3>

          {apiMsg && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 text-xs">
              {apiMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-gray-600">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Question *</label>
              <input 
                type="text" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Answer *</label>
              <textarea 
                value={answer} 
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs h-24 focus:border-darkCyan focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <button type="submit" className="btn-primary px-8 py-3 text-xs">Save FAQ</button>
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-8 py-3 text-xs">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-6">Loading FAQs...</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Question</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {faqs.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-700">{f.question}</td>
                    <td className="p-3 text-gray-500">{f.display_order}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                        f.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-150 text-gray-600'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <button onClick={() => handleEditClick(f)} className="text-darkCyan hover:text-brightTurquoise">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700">
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

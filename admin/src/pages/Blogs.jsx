'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Edit, Trash, Plus, Check, X } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [status, setStatus] = useState('draft');
  const [isFeatured, setIsFeatured] = useState(0);
  const [author, setAuthor] = useState('Abhay Harpale');
  const [imageFile, setImageFile] = useState(null);
  
  const [apiMsg, setApiMsg] = useState('');

  const fetchBlogs = () => {
    setLoading(true);
    adminApi.get('/admin/blogs.php')
      .then(res => {
        setBlogs(res.blogs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
    
    // Load categories list for selector
    adminApi.get('/blogs/list.php')
      .then(res => {
        if (res && res.categories) {
          setCategories(res.categories);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleEditClick = (blog) => {
    adminApi.get(`/admin/blogs.php?id=${blog.id}`)
      .then(res => {
        if (res && res.blog) {
          const b = res.blog;
          setEditingBlog(b);
          setTitle(b.title);
          setSlug(b.slug);
          setExcerpt(b.excerpt);
          setContent(b.content);
          setCategoryId(b.category_id);
          setStatus(b.status);
          setIsFeatured(b.is_featured);
          setAuthor(b.author);
          setImageFile(null);
          setApiMsg('');
        }
      });
  };

  const handleCreateNewClick = () => {
    setEditingBlog({ id: 0 });
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategoryId(categories[0]?.id || 1);
    setStatus('draft');
    setIsFeatured(0);
    setAuthor('Abhay Harpale');
    setImageFile(null);
    setApiMsg('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiMsg('Saving article details...');

    const formData = new FormData();
    if (editingBlog.id > 0) {
      formData.append('id', editingBlog.id);
    }
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('status', status);
    formData.append('is_featured', isFeatured);
    formData.append('author', author);

    if (imageFile) {
      formData.append('featured_image', imageFile);
    }

    try {
      const response = await adminApi.post('/admin/blogs.php', formData);
      if (response && response.success) {
        setApiMsg('Article saved successfully!');
        setEditingBlog(null);
        fetchBlogs();
      } else {
        throw new Error(response.error || "Failed to save.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog article?")) return;
    try {
      const res = await adminApi.post('/admin/blogs.php?action=delete', { id, action: 'delete' });
      if (res && res.success) {
        fetchBlogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Publications CMS Module</h2>
        <button 
          onClick={handleCreateNewClick}
          className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {editingBlog ? (
        <div className="bg-white border border-gray-200 p-8 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <h3 className="font-serif text-lg font-bold text-gray-800">
              {editingBlog.id > 0 ? "Edit Article Details" : "Write New Publication"}
            </h3>
            <button onClick={() => setEditingBlog(null)} className="text-gray-400 hover:text-gray-600">
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
              <label className="font-bold uppercase tracking-wider">Title *</label>
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
              <label className="font-bold uppercase tracking-wider">URL Slug *</label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider">Excerpt (Summary) *</label>
              <input 
                type="text" 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
                placeholder="Ex. A short one-line summary displayed on grid lists."
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider">Content Markup (HTML/Text) *</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs h-48 focus:border-darkCyan focus:outline-none"
                placeholder="Full article content..."
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Category Category *</label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Author Name</label>
              <input 
                type="text" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Featured Cover Image</label>
              <input 
                type="file" 
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-350 bg-gray-50 rounded p-2 text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Featured Article Weight</label>
              <select 
                value={isFeatured} 
                onChange={(e) => setIsFeatured(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none bg-white"
              >
                <option value="0">Standard Post</option>
                <option value="1">Featured Highlight</option>
              </select>
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
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-4 flex gap-4">
              <button type="submit" className="btn-primary px-8 py-3 text-xs">Save Article</button>
              <button type="button" onClick={() => setEditingBlog(null)} className="btn-secondary px-8 py-3 text-xs">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-6">Loading publications list...</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-700">{b.title}</td>
                    <td className="p-3 text-gray-500">{b.category_name}</td>
                    <td className="p-3 text-gray-600">{b.author}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                        b.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-150 text-gray-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <button onClick={() => handleEditClick(b)} className="text-darkCyan hover:text-brightTurquoise">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700">
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

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const Blog = () => {
  // API base URL
  const API_BASE_URL = "http://localhost:5000/api/blogs";
  
  // State Management
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    status: 'draft'
  });
  
  // Files State
  const [files, setFiles] = useState({
    thumbnail: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null
  });

  // File preview state (optional - for showing selected file names)
  const [filePreviews, setFilePreviews] = useState({
    thumbnail: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null
  });

  // Fetch blogs from backend on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search and status
  useEffect(() => {
    let result = blogs;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(blog => blog.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.subTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBlogs(result);
  }, [blogs, statusFilter, searchTerm]);

  // Fetch blogs from backend API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      
      if (response.data.success) {
        setBlogs(response.data.blogs);
      } else {
        console.error("Failed to fetch blogs:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to load blogs. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subTitle', formData.subTitle);
      formDataToSend.append('paragraph1', formData.paragraph1);
      formDataToSend.append('paragraph2', formData.paragraph2);
      formDataToSend.append('paragraph3', formData.paragraph3);
      formDataToSend.append('status', formData.status);
      
      // Add thumbnail if exists
      if (files.thumbnail) {
        formDataToSend.append('thumbnail', files.thumbnail);
      }
      
      // Add images (only if they exist)
      const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5'];
      imageFields.forEach(field => {
        if (files[field]) {
          formDataToSend.append('images', files[field]);
        }
      });
      
      let response;
      
      if (editingBlog) {
        // Update existing blog
        response = await axios.put(`${API_BASE_URL}/${editingBlog.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new blog
        response = await axios.post(API_BASE_URL, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      if (response.data.success) {
        alert(editingBlog ? "✅ Blog updated successfully!" : "✅ Blog created successfully!");
        fetchBlogs(); // Refresh blog list
        handleCloseForm();
      } else {
        alert(response.data.error || "Operation failed!");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.error || error.response.data.message}`);
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Edit blog - populate form with existing data
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      subTitle: blog.subTitle || '',
      paragraph1: blog.paragraph1 || '',
      paragraph2: blog.paragraph2 || '',
      paragraph3: blog.paragraph3 || '',
      status: blog.status || 'draft'
    });
    
    // Reset files when editing (user needs to re-upload if they want to change)
    setFiles({
      thumbnail: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null
    });
    
    setFilePreviews({
      thumbnail: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null
    });
    
    setShowForm(true);
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        
        if (response.data.success) {
          alert("✅ Blog deleted successfully!");
          fetchBlogs(); // Refresh blog list
        } else {
          alert("Failed to delete blog!");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Error deleting blog. Please try again.");
      }
    }
  };

  // Handle file input change
  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [field]: file
      }));
      
      // Set file preview name
      setFilePreviews(prev => ({
        ...prev,
        [field]: file.name
      }));
    }
  };

  // Close form and reset
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      subTitle: '',
      paragraph1: '',
      paragraph2: '',
      paragraph3: '',
      status: 'draft'
    });
    setFiles({
      thumbnail: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null
    });
    setFilePreviews({
      thumbnail: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null
    });
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear form
  const handleClearForm = () => {
    setFormData({
      title: '',
      subTitle: '',
      paragraph1: '',
      paragraph2: '',
      paragraph3: '',
      status: 'draft'
    });
    setFiles({
      thumbnail: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null
    });
    setFilePreviews({
      thumbnail: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null
    });
  };

  return (
    <div className="p-16 font-sans bg-[#FDF2F2] min-h-screen">
      
      {/* Header Container */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {/* Title with underline */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          BLOG POSTS
        </h2>
        
        {/* Controls Row - Status, Search, Add New */}
        <div className="flex items-center gap-4">
          {/* Status Dropdown */}
          <select 
            className="px-4 py-2 border-2 border-[#7F0404] rounded-md text-sm bg-white focus:outline-none focus:border-pink-400 min-w-[120px]"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={loading}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>

          {/* Search Bar */}
          <input 
            className="flex-1 px-4 py-2 border-2 border-[#7F0404] rounded-md text-sm focus:outline-none focus:border-pink-400"
            type="text" 
            placeholder="Search by title, subtitle or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />

          {/* Add New Button */}
          <button 
            onClick={() => setShowForm(true)}
            disabled={loading}
            className="bg-[#7F0404] hover:bg-[#6a0303] text-white px-6 py-2 rounded-md font-semibold transition-colors whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'ADD NEW'}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white border-b-2 border-[#7F0404]">
              <th className="px-6 py-4 text-left font-bold text-[#7F0404] text-base">ID</th>
              <th className="px-6 py-4 text-left font-bold text-[#7F0404] text-base">Title</th>
              <th className="px-6 py-4 text-left font-bold text-[#7F0404] text-base">Sub Title</th>
              <th className="px-6 py-4 text-left font-bold text-[#7F0404] text-base">Status</th>
              <th className="px-6 py-4 text-left font-bold text-[#7F0404] text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading blogs...</span>
                  </div>
                </td>
              </tr>
            ) : filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                    #{blog.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{blog.title}</td>
                  <td className="px-6 py-4 text-gray-600">{blog.subTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      blog.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                      blog.status === 'upcoming' ? 'bg-green-100 text-green-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleEdit(blog)} 
                      className="px-3 py-1.5 mr-2 text-black rounded text-xs transition-colors inline-flex items-center gap-1 hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit2 size={20}/> 
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)} 
                      className="px-3 py-1.5 text-black rounded text-xs transition-colors inline-flex items-center gap-1 hover:bg-gray-100"
                      title="Delete"
                    >
                      <Trash2 size={20}/> 
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                  {searchTerm || statusFilter !== 'all' ? 
                    "No blogs found with the current filters." : 
                    "No blogs found. Click 'ADD NEW' to create your first blog."
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
            
            {/* RED HEADER */}
            <div className="bg-[#7F0404] text-white p-4 flex justify-between items-center">
              <h3 className="m-0 text-lg font-bold tracking-wide">
                {editingBlog ? 'EDIT BLOG' : 'ADD NEW BLOG'}
              </h3>
              <button 
                onClick={handleCloseForm}
                className="text-white hover:text-gray-200 disabled:opacity-50"
                disabled={formLoading}
              >
                <X size={24}/>
              </button>
            </div>

            {/* WHITE CONTENT AREA */}
            <div className="p-6 bg-white max-h-[calc(90vh-60px)] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                {/* Title - Full Width */}
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Title *"
                    className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#7F0404]"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    disabled={formLoading}
                  />
                </div>

                {/* Sub Title - Full Width */}
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Sub Title *"
                    className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#7F0404]"
                    value={formData.subTitle}
                    onChange={(e) => handleInputChange('subTitle', e.target.value)}
                    required
                    disabled={formLoading}
                  />
                </div>

                {/* Paragraph 1 - Full Width */}
                <div className="mb-4">
                  <textarea
                    placeholder="Paragraph 1 *"
                    rows="4"
                    className="w-full p-2.5 border border-gray-300 rounded text-sm resize-y focus:outline-none focus:ring-1 focus:ring-[#7F0404]"
                    value={formData.paragraph1}
                    onChange={(e) => handleInputChange('paragraph1', e.target.value)}
                    required
                    disabled={formLoading}
                  />
                </div>

                {/* Paragraph 2 - Full Width */}
                <div className="mb-4">
                  <textarea
                    placeholder="Paragraph 2"
                    rows="3"
                    className="w-full p-2.5 border border-gray-300 rounded text-sm resize-y focus:outline-none focus:ring-1 focus:ring-[#7F0404]"
                    value={formData.paragraph2}
                    onChange={(e) => handleInputChange('paragraph2', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                {/* Paragraph 3 - Full Width */}
                <div className="mb-6">
                  <textarea
                    placeholder="Paragraph 3"
                    rows="3"
                    className="w-full p-2.5 border border-gray-300 rounded text-sm resize-y focus:outline-none focus:ring-1 focus:ring-[#7F0404]"
                    value={formData.paragraph3}
                    onChange={(e) => handleInputChange('paragraph3', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                {/* Thumbnail - Full Width */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Thumbnail {editingBlog && <span className="text-gray-500 text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    onChange={(e) => handleFileChange('thumbnail', e)}
                    disabled={formLoading}
                  />
                  {filePreviews.thumbnail && (
                    <p className="mt-1 text-xs text-green-600">
                      Selected: {filePreviews.thumbnail}
                    </p>
                  )}
                </div>

                {/* Images 1-5 and Status - 3 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Image 1 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Image 1 {editingBlog && <span className="text-gray-500 text-xs">(Optional)</span>}
                    </label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100"
                      onChange={(e) => handleFileChange('image1', e)}
                      disabled={formLoading}
                    />
                    {filePreviews.image1 && (
                      <p className="mt-1 text-xs text-green-600">
                        {filePreviews.image1}
                      </p>
                    )}
                  </div>
                  
                  {/* Image 2 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Image 2 {editingBlog && <span className="text-gray-500 text-xs">(Optional)</span>}
                    </label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100"
                      onChange={(e) => handleFileChange('image2', e)}
                      disabled={formLoading}
                    />
                    {filePreviews.image2 && (
                      <p className="mt-1 text-xs text-green-600">
                        {filePreviews.image2}
                      </p>
                    )}
                  </div>
                  
                  {/* Image 3 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Image 3 {editingBlog && <span className="text-gray-500 text-xs">(Optional)</span>}
                    </label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100"
                      onChange={(e) => handleFileChange('image3', e)}
                      disabled={formLoading}
                    />
                    {filePreviews.image3 && (
                      <p className="mt-1 text-xs text-green-600">
                        {filePreviews.image3}
                      </p>
                    )}
                  </div>
                  
                  {/* Image 4 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Image 4 {editingBlog && <span className="text-gray-500 text-xs">(Optional)</span>}
                    </label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100"
                      onChange={(e) => handleFileChange('image4', e)}
                      disabled={formLoading}
                    />
                    {filePreviews.image4 && (
                      <p className="mt-1 text-xs text-green-600">
                        {filePreviews.image4}
                      </p>
                    )}
                  </div>
                  
                  {/* Image 5 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Image 5 {editingBlog && <span className="text-gray-500 text-xs">(Optional)</span>}
                    </label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded text-sm bg-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100"
                      onChange={(e) => handleFileChange('image5', e)}
                      disabled={formLoading}
                    />
                    {filePreviews.image5 && (
                      <p className="mt-1 text-xs text-green-600">
                        {filePreviews.image5}
                      </p>
                    )}
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
                    <select
                      className="w-full p-2.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7F0404]"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={formLoading}
                    >
                      <option value="draft">Draft</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Buttons - Right Aligned */}
                <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-200">
                  <button 
                    type="button"
                    onClick={handleClearForm}
                    disabled={formLoading}
                    className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Clear
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2.5 bg-[#7F0404] hover:bg-[#6a0303] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors flex items-center gap-2"
                  >
                    {formLoading && <Loader2 className="animate-spin" size={16}/>}
                    {formLoading ? 'Processing...' : (editingBlog ? 'Update' : 'Submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
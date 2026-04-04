import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import NavBar from "./../Components/AdminNav.jsx"; // IMPORT NAVBAR

const Blog = () => {
  const API_BASE_URL = "/api/blogs";
  
  // State Management
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Sidebar State for NavBar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4; // Shows 4 blogs per page
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', subTitle: '', paragraph1: '', paragraph2: '', paragraph3: '', status: 'draft'
  });
  
  // Files State
  const [files, setFiles] = useState({
    thumbnail: null, image1: null, image2: null, image3: null, image4: null, image5: null
  });

  const [filePreviews, setFilePreviews] = useState({
    thumbnail: null, image1: null, image2: null, image3: null, image4: null, image5: null
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter Logic & Pagination Reset
  useEffect(() => {
    let result = blogs;
    
    if (statusFilter !== 'all') {
      result = result.filter(blog => blog.status === statusFilter);
    }
    
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.subTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBlogs(result);
    setCurrentPage(1); // Jump back to page 1 whenever filters change
  }, [blogs, statusFilter, searchTerm]);

  // Pagination Calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBlogs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBlogs.length / rowsPerPage);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_BASE_URL);
      
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subTitle', formData.subTitle);
      formDataToSend.append('paragraph1', formData.paragraph1);
      formDataToSend.append('paragraph2', formData.paragraph2);
      formDataToSend.append('paragraph3', formData.paragraph3);
      formDataToSend.append('status', formData.status);
      
      if (files.thumbnail) formDataToSend.append('thumbnail', files.thumbnail);
      
      ['image1', 'image2', 'image3', 'image4', 'image5'].forEach(field => {
        if (files[field]) formDataToSend.append('images', files[field]);
      });
      
      let response;
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editingBlog) {
        response = await axiosInstance.put(`${API_BASE_URL}/${editingBlog.id}`, formDataToSend, config);
      } else {
        response = await axiosInstance.post(API_BASE_URL, formDataToSend, config);
      }
      
      if (response.data.success) {
        alert(editingBlog ? "✅ Blog updated successfully!" : "✅ Blog created successfully!");
        fetchBlogs(); 
        handleCloseForm();
      } else {
        alert(response.data.error || "Operation failed!");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Network error or operation failed. Check your connection.");
    } finally {
      setFormLoading(false);
    }
  };

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
    
    setFiles({ thumbnail: null, image1: null, image2: null, image3: null, image4: null, image5: null });
    setFilePreviews({ thumbnail: null, image1: null, image2: null, image3: null, image4: null, image5: null });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
        if (response.data.success) {
          alert("✅ Blog deleted successfully!");
          fetchBlogs(); 
        } else {
          alert("Failed to delete blog!");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Error deleting blog. Please try again.");
      }
    }
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      setFilePreviews(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlog(null);
    handleClearForm();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearForm = () => {
    setFormData({ title: '', subTitle: '', paragraph1: '', paragraph2: '', paragraph3: '', status: 'draft' });
    setFiles({ thumbnail: null, image1: null, image2: null, image3: null, image4: null, image5: null });
    setFilePreviews({ thumbnail: null, image1: null, image2: null, image3: null, image4: null, image5: null });
  };

  return (
    // FIX: Main container set to h-screen and overflow-hidden for correct sidebar interaction
    <div className="flex bg-[#FDF2F2] h-screen overflow-hidden font-sans">
      
      {/* FIX: Passed sidebar state to NavBar */}
      <NavBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* FIX: Main content area now scrolls independently */}
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 min-w-0">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Container */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#7F0404] mb-6 uppercase tracking-wider">BLOG POSTS</h2>
            
            {/* Controls Row */}
            <div className="flex flex-col md:flex-row items-center gap-4 justify-end">
              <select 
                className="w-full md:w-48 px-4 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7F0404] focus:border-[#7F0404] transition-all font-medium text-gray-600"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={loading}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>

              <div className="relative group w-full md:w-72">
                <input 
                  className="w-full pl-5 pr-10 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#7F0404] focus:border-[#7F0404] transition-all font-medium text-gray-600"
                  type="text" 
                  placeholder="Search by title, subtitle or ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button 
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="bg-[#7F0404] hover:bg-[#6a0303] text-white px-6 py-2.5 rounded-md font-bold transition-all shadow-md active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Loading...' : 'ADD NEW'}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="overflow-x-auto min-h-[380px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#7F0404] text-[#7F0404] font-bold">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Title</th>
                    <th className="py-3 px-2">Sub Title</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-500">
                          <Loader2 className="animate-spin" size={24} />
                          <span className="font-medium">Loading blogs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentRows.length > 0 ? (
                    currentRows.map(blog => (
                      <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2 text-gray-500 font-mono text-sm">
                          #{blog.id.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-2 font-bold text-gray-800">{blog.title}</td>
                        <td className="py-4 px-2 text-gray-600 font-medium">{blog.subTitle}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                            blog.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                            blog.status === 'upcoming' ? 'bg-green-100 text-green-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <div className="flex justify-center gap-3">
                            <button 
                              onClick={() => handleEdit(blog)} 
                              className="text-orange-500 hover:scale-125 transition-transform"
                              title="Edit"
                            >
                              <Edit2 size={20}/> 
                            </button>
                            <button 
                              onClick={() => handleDelete(blog.id)} 
                              className="text-red-500 hover:scale-125 transition-transform"
                              title="Delete"
                            >
                              <Trash2 size={20}/> 
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-gray-400 font-medium italic">
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

            {/* CUSTOM PAGINATION UI */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-gray-100 pt-6">
                <span className="text-sm font-bold text-gray-400 tracking-wide">
                  Page {currentPage} of {totalPages}
                </span>
                
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-md font-bold text-sm transition-all duration-200 shadow-sm ${
                        currentPage === i + 1 
                          ? "bg-[#7F0404] text-white" 
                          : "bg-[#8E8E8E] text-white hover:bg-gray-500"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl relative z-[110] animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
            
            {/* HEADER */}
            <div className="bg-white text-[#7F0404] p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-2xl font-bold uppercase tracking-tight">
                {editingBlog ? 'EDIT BLOG' : 'ADD NEW BLOG'}
              </h3>
              <button 
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-[#7F0404] transition-colors disabled:opacity-50"
                disabled={formLoading}
              >
                <X size={28} strokeWidth={2.5}/>
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="p-8 bg-white max-h-[calc(85vh-80px)] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                   <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                    Title {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter Title *"
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7F0404] transition-colors font-medium"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    disabled={formLoading}
                  />
                </div>

                <div className="mb-4">
                   <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                    Sub Title {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter Sub Title *"
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7F0404] transition-colors font-medium"
                    value={formData.subTitle}
                    onChange={(e) => handleInputChange('subTitle', e.target.value)}
                    required
                    disabled={formLoading}
                  />
                </div>

                <div className="mb-4">
                   <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                    Paragraph 1 {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <textarea
                    placeholder="Enter Paragraph 1 *"
                    rows="4"
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:border-[#7F0404] transition-colors font-medium"
                    value={formData.paragraph1}
                    onChange={(e) => handleInputChange('paragraph1', e.target.value)}
                    required
                    disabled={formLoading}
                  />
                </div>

                <div className="mb-4">
                   <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                    Paragraph 2 {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <textarea
                    placeholder="Enter Paragraph 2 (Optional)"
                    rows="3"
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:border-[#7F0404] transition-colors font-medium"
                    value={formData.paragraph2}
                    onChange={(e) => handleInputChange('paragraph2', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                    Paragraph 3 {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <textarea
                    placeholder="Enter Paragraph 3 (Optional)"
                    rows="3"
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:border-[#7F0404] transition-colors font-medium"
                    value={formData.paragraph3}
                    onChange={(e) => handleInputChange('paragraph3', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                    Thumbnail Image {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional - upload only if changing)</span>}
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    className="w-full border-2 border-gray-300 p-2 rounded-lg outline-none cursor-pointer focus:border-[#7F0404] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-[#7F0404] hover:file:bg-red-100"
                    onChange={(e) => handleFileChange('thumbnail', e)}
                    disabled={formLoading}
                  />
                  {filePreviews.thumbnail && (
                    <p className="mt-2 text-sm font-bold text-green-600">New Thumbnail: {filePreviews.thumbnail}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                  {['image1', 'image2', 'image3', 'image4', 'image5'].map((imgKey, index) => (
                    <div key={imgKey}>
                      <label className="block text-sm font-bold mb-2 text-[#7F0404]">
                        Image {index + 1} {editingBlog && <span className="text-gray-400 font-medium text-xs">(Optional)</span>}
                      </label>
                      <input 
                        type="file"
                        accept="image/*"
                        className="w-full border-2 border-gray-300 p-2 rounded-lg outline-none cursor-pointer focus:border-[#7F0404] transition-colors file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-[#7F0404] hover:file:bg-red-100"
                        onChange={(e) => handleFileChange(imgKey, e)}
                        disabled={formLoading}
                      />
                      {filePreviews[imgKey] && (
                        <p className="mt-1 text-xs font-bold text-green-600">{filePreviews[imgKey]}</p>
                      )}
                    </div>
                  ))}
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#7F0404]">Status</label>
                    <select
                      className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-[#7F0404] transition-colors font-medium"
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

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={handleClearForm}
                    disabled={formLoading}
                    className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Clear Form
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-[#7F0404] text-white font-bold py-2.5 rounded-lg hover:bg-red-800 active:scale-95 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formLoading && <Loader2 className="animate-spin" size={18}/>}
                    {formLoading ? 'Processing...' : (editingBlog ? 'Update Blog' : 'Submit Blog')}
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
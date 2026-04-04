import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  // State for inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handler for input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
  // CORRECTED URL: Added /auth/ prefix to match your backend route
  const response = await axios.post('http://localhost:5000/auth/login', formData);
  
  if (response.data.token) {
    // 1. Store the token
    localStorage.setItem('adminToken', response.data.token);
    
    // 2. Redirect to dashboard
    window.location.href = '/reservation'; 
  }
} catch (err) {
  // Backend returns error messages in err.response.data.message
  setError(err.response?.data?.message || "Invalid email or password");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER AREA */}
        <div className="bg-[#8B0000] p-8 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">
            Admin Login
          </h1>
          <p className="text-red-100 text-sm mt-2 font-medium">
            Enter your credentials to access the panel
          </p>
        </div>

        {/* FORM AREA */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors" size={20} />
              <input 
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8B0000] transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8B0000] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B0000]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B0000] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-800 transition-all shadow-lg active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <LogIn size={20} />
                LOG IN
              </>
            )}
          </button>

         
        </form>
      </div>
    </div>
  );
};

export default Login;
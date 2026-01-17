const express = require('express');
const cors = require('cors');
const path = require('path');
const blogRoutes = require('./Routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '50mb' })); // JSON data
app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb' 
})); // Form data

// Static files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Server is Running Successfully!",
    endpoints: {
      health: "/api/health",
      blogs: "/api/blogs",
      docs: "Coming soon..."
    }
  });
});

//  Blog routes
app.use("/api/blogs", blogRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(' Server Error:', err.stack);
  
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 50MB allowed.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
   Server running on port ${PORT}
   Blog API: http://localhost:${PORT}/api/blogs
    Health: http://localhost:${PORT}/api/health
   Frontend: http://localhost:5173
  `);
});

module.exports = app;
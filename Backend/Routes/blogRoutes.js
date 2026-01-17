const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 6 // Max 6 files (1 thumbnail + 5 images)
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus
} = require("../Controllers/blogController");

// GET all blogs
router.get("/", getBlogs);

// GET single blog
router.get("/:id", getBlogById);

// CREATE new blog (with file upload)
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  createBlog
);

// UPDATE blog (with optional file upload)
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  updateBlog
);

// UPDATE blog status only
router.patch("/:id/status", updateBlogStatus);

// DELETE blog
router.delete("/:id", deleteBlog);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 10MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 6 files allowed.'
      });
    }
  }
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
});

module.exports = router;
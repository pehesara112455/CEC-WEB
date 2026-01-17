const { db, bucket } = require("../Config/Firebase");
const Blog = require("../Models/blogModel");
const { v4: uuidv4 } = require("uuid");

// Helper function to upload image to Firebase Storage
const uploadImage = async (file) => {
  if (!file) return null;
  
  try {
    const fileName = `blogs/${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    // Upload the file
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4()
        }
      }
    });

    // Make the file public
    await fileUpload.makePublic();
    
    // Return public URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// CREATE NEW BLOG
exports.createBlog = async (req, res) => {
  try {
    console.log("📝 Creating new blog...");
    console.log("📦 Request body:", req.body);
    console.log("📁 Request files:", req.files);

    const { title, subTitle, paragraph1, paragraph2, paragraph3, status } = req.body;

    // Upload thumbnail if exists
    let thumbnailUrl = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      console.log("🖼 Uploading thumbnail...");
      thumbnailUrl = await uploadImage(req.files.thumbnail[0]);
      console.log("✅ Thumbnail URL:", thumbnailUrl);
    }

    // Upload images if exist
    let imageUrls = [];
    if (req.files && req.files.images) {
      console.log(`📸 Uploading ${req.files.images.length} images...`);
      for (let img of req.files.images) {
        const url = await uploadImage(img);
        if (url) {
          imageUrls.push(url);
        }
      }
      console.log("✅ Images uploaded:", imageUrls.length);
    }

    // Create blog object
    const blogData = {
      title: title || "",
      subTitle: subTitle || "",
      paragraph1: paragraph1 || "",
      paragraph2: paragraph2 || "",
      paragraph3: paragraph3 || "",
      status: status || "draft",
      thumbnail: thumbnailUrl,
      images: imageUrls,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("💾 Saving to Firestore...");
    
    // Save to Firestore
    const docRef = await db.collection("blogs").add(blogData);

    console.log("✅ Blog created with ID:", docRef.id);

    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      id: docRef.id,
      data: blogData
    });

  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create blog"
    });
  }
};

// GET ALL BLOGS
exports.getBlogs = async (req, res) => {
  try {
    console.log("📚 Fetching all blogs...");
    
    const snapshot = await db
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      console.log("📭 No blogs found");
      return res.json({
        success: true,
        blogs: [],
        count: 0
      });
    }

    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Found ${blogs.length} blogs`);
    
    res.json({
      success: true,
      blogs: blogs,
      count: blogs.length
    });

  } catch (error) {
    console.error("❌ Error getting blogs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch blogs"
    });
  }
};

// GET SINGLE BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching blog with ID: ${id}`);
    
    const doc = await db.collection("blogs").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.json({
      success: true,
      blog: {
        id: doc.id,
        ...doc.data()
      }
    });
    
  } catch (error) {
    console.error("❌ Error getting blog:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Updating blog ID: ${id}`);
    console.log("📦 Update data:", req.body);
    console.log("📁 Update files:", req.files);

    // Get existing blog first
    const docRef = db.collection("blogs").doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const existingData = existingDoc.data();
    const updates = { ...req.body };
    
    // Handle thumbnail update
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      console.log("🖼 Updating thumbnail...");
      updates.thumbnail = await uploadImage(req.files.thumbnail[0]);
    } else if (req.body.removeThumbnail === "true") {
      updates.thumbnail = null;
    }
    
    // Handle images update
    if (req.files && req.files.images && req.files.images.length > 0) {
      console.log(`📸 Adding ${req.files.images.length} new images...`);
      const newImageUrls = [];
      for (let img of req.files.images) {
        const url = await uploadImage(img);
        if (url) newImageUrls.push(url);
      }
      
      // Combine with existing images if not replacing all
      if (req.body.replaceImages !== "true") {
        updates.images = [...(existingData.images || []), ...newImageUrls];
      } else {
        updates.images = newImageUrls;
      }
    }
    
    // Always update the updatedAt timestamp
    updates.updatedAt = new Date();
    
    // Perform update
    await docRef.update(updates);
    
    console.log("✅ Blog updated successfully");
    
    res.json({
      success: true,
      message: "Blog updated successfully!"
    });
    
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update blog"
    });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑 Deleting blog ID: ${id}`);
    
    const docRef = db.collection("blogs").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    await docRef.delete();
    
    console.log("✅ Blog deleted successfully");
    
    res.json({
      success: true,
      message: "Blog deleted successfully!"
    });
    
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete blog"
    });
  }
};

// UPDATE BLOG STATUS
exports.updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📊 Updating blog status: ${id} -> ${status}`);
    
    const docRef = db.collection("blogs").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    await docRef.update({
      status: status,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: `Blog status updated to ${status}`
    });
    
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
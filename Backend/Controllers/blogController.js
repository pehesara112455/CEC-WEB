const { db } = require("../Config/Firebase");
const cloudinary = require("../Config/Cloudinary");
const streamifier = require("streamifier");

/* ================= CLOUDINARY UPLOAD FUNCTION ================= */
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

/* ================= CREATE BLOG ================= */
exports.createBlog = async (req, res) => {
  try {
    const { title, subTitle, paragraph1, paragraph2, paragraph3, status } =
      req.body;

    let thumbnailUrl = null;
    if (req.files?.thumbnail?.[0]) {
      thumbnailUrl = await uploadImage(req.files.thumbnail[0]);
    }

    let imageUrls = [];
    if (req.files?.images) {
      for (let img of req.files.images) {
        const url = await uploadImage(img);
        if (url) imageUrls.push(url);
      }
    }

    const blogData = {
      title,
      subTitle,
      paragraph1,
      paragraph2,
      paragraph3,
      status,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("blogs").add(blogData);

    res.status(201).json({
      success: true,
      id: docRef.id,
      data: blogData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET ALL BLOGS ================= */
exports.getBlogs = async (req, res) => {
  try {
    const snapshot = await db
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .get();

    const blogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET BLOG BY ID ================= */
exports.getBlogById = async (req, res) => {
  try {
    const doc = await db.collection("blogs").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({
      success: true,
      blog: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= UPDATE BLOG ================= */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("blogs").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const existingData = doc.data();
    const updates = { ...req.body };

    if (req.files?.thumbnail?.[0]) {
      updates.thumbnail = await uploadImage(req.files.thumbnail[0]);
    }

    if (req.files?.images?.length > 0) {
      const newImages = [];
      for (let img of req.files.images) {
        const url = await uploadImage(img);
        if (url) newImages.push(url);
      }

      updates.images = [...(existingData.images || []), ...newImages];
    }

    updates.updatedAt = new Date();

    await docRef.update(updates);

    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= DELETE BLOG ================= */
exports.deleteBlog = async (req, res) => {
  try {
    await db.collection("blogs").doc(req.params.id).delete();
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

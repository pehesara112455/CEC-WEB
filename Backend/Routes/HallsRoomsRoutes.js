const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../Config/Cloudinary");
const upload = multer({ storage: multer.memoryStorage() });
const { addItem, updateItem, deleteItem, getItems } = require("../Controllers/HallsRoomsController");

// ADD ITEM
router.post("/add-item", upload.single("image"), addItem);

// GET ITEMS
router.get("/get-items/:type", getItems);

// UPDATE ITEM
router.put("/update-item/:collection/:id", upload.single("image"), updateItem);

// DELETE ITEM
router.delete("/delete-item/:collection/:id", deleteItem);

module.exports = router;
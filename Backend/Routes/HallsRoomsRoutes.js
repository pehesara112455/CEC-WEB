const express = require("express");
const router = express.Router();
const itemController = require("../Controllers/HallsRoomsController");

router.post("/add-item", itemController.addItem);
router.get("/get-items/:type", itemController.getItems);
router.delete("/delete-item/:collection/:id", itemController.deleteItem);
router.put("/update-item/:collection/:id", itemController.updateItem);

module.exports = router;
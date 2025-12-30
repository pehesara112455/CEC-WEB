const express = require("express");
const cors = require("cors");
const hallsRoomsRoutes = require("./Routes/HallsRoomsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server is Running Successfully!");
});

app.use("/api/halls-rooms", hallsRoomsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
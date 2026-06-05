const express = require("express");
const noteRoutes = require("./routes/note.routes");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Welcome route at root for easy verification
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Notes Management API!",
    data: null
  });
});

// Mount notes routes under /api/notes
app.use("/api/notes", noteRoutes);

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Unexpected server or database error",
    data: null
  });
});

module.exports = app;

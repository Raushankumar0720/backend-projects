const express = require("express");
const noteRoutes = require("./routes/note.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Notes Management API - Advanced Queries!",
    data: null
  });
});

app.use("/api/notes", noteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Unexpected server or database error",
    data: null
  });
});

module.exports = app;

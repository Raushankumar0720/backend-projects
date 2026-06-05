const mongoose = require("mongoose");
const Note = require("../models/note.model");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// 1. POST /api/notes — Create single note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required", data: null });
    }
    const newNote = await Note.create({ title, content, category, isPinned });
    return res.status(201).json({ success: true, message: "Note created successfully", data: newNote });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message, data: null });
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 2. POST /api/notes/bulk — Create bulk notes
exports.createNotesBulk = async (req, res) => {
  try {
    const { notes } = req.body || {};
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ success: false, message: "notes array is required and cannot be empty", data: null });
    }
    const createdNotes = await Note.insertMany(notes);
    return res.status(201).json({ success: true, message: `${createdNotes.length} notes created successfully`, data: createdNotes });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message, data: null });
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

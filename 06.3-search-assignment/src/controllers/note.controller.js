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

// 3. GET /api/notes — Read all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 4. GET /api/notes/:id — Read by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note fetched successfully", data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 5. PUT /api/notes/:id — Full replace
exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const { title, content, category, isPinned } = req.body || {};
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required", data: null });
    const updateData = { title, content, category: category !== undefined ? category : "personal", isPinned: isPinned !== undefined ? isPinned : false };
    const replacedNote = await Note.findByIdAndUpdate(id, updateData, { new: true, overwrite: true, runValidators: true });
    if (!replacedNote) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note replaced successfully", data: replacedNote });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message, data: null });
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 6. PATCH /api/notes/:id — Partial update
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: "No fields provided to update", data: null });
    const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedNote) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note updated successfully", data: updatedNote });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message, data: null });
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 7. DELETE /api/notes/:id — Delete single
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note deleted successfully", data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 8. DELETE /api/notes/bulk — Delete bulk
exports.deleteNotesBulk = async (req, res) => {
  try {
    const { ids } = req.body || {};
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: "ids array is required and cannot be empty", data: null });
    for (const id of ids) {
      if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    }
    const result = await Note.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: `${result.deletedCount} notes deleted successfully`, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

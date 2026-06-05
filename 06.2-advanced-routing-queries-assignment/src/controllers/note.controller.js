const mongoose = require("mongoose");
const Note = require("../models/note.model");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// 1. POST /api/notes — Create note
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

// 3. GET /api/notes — Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 4. GET /api/notes/:id — Get note by ID
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

// 5. PUT /api/notes/:id — Replace note completely
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

// 6. PATCH /api/notes/:id — Update specific fields
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

// 7. DELETE /api/notes/:id — Delete single note
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

// 8. DELETE /api/notes/bulk — Delete bulk notes
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

// 9. GET /api/notes/category/:category — Get notes by category
exports.getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowedCategories = ["work", "personal", "study"];
    if (!allowedCategories.includes(category)) return res.status(400).json({ success: false, message: "Invalid category. Allowed: work, personal, study", data: null });
    const notes = await Note.find({ category });
    if (notes.length === 0) return res.status(404).json({ success: false, message: `No notes found for category: ${category}`, data: null });
    return res.status(200).json({ success: true, message: `Notes fetched for category: ${category}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 10. GET /api/notes/status/:isPinned — Get notes by status
exports.getNotesByStatus = async (req, res) => {
  try {
    const { isPinned } = req.params;
    if (isPinned !== "true" && isPinned !== "false") return res.status(400).json({ success: false, message: "isPinned must be true or false", data: null });
    const pinned = isPinned === "true";
    const notes = await Note.find({ isPinned: pinned });
    return res.status(200).json({ success: true, message: pinned ? "Fetched all pinned notes" : "Fetched all unpinned notes", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 11. GET /api/notes/:id/summary — Get summary
exports.getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const note = await Note.findById(id).select("title category isPinned createdAt");
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note summary fetched successfully", data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 12. GET /api/notes/filter — General filter
exports.filterNotes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isPinned !== undefined) filter.isPinned = req.query.isPinned === "true";
    const notes = await Note.find(filter);
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 13. GET /api/notes/filter/pinned — Get pinned notes
exports.getPinnedNotes = async (req, res) => {
  try {
    const filter = { isPinned: true };
    if (req.query.category) filter.category = req.query.category;
    const notes = await Note.find(filter);
    return res.status(200).json({ success: true, message: "Pinned notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 14. GET /api/notes/filter/category — Filter by category name query
exports.filterByCategory = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ success: false, message: "Query param 'name' is required", data: null });
    const notes = await Note.find({ category: name });
    return res.status(200).json({ success: true, message: `Notes filtered by category: ${name}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 15. GET /api/notes/filter/date-range — Date range
exports.filterByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ success: false, message: "Both 'from' and 'to' query params are required", data: null });
    const filter = { createdAt: { $gte: new Date(from), $lte: new Date(to) } };
    const notes = await Note.find(filter);
    return res.status(200).json({ success: true, message: `Notes fetched between ${from} and ${to}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 16. GET /api/notes/paginate — Paginate notes
exports.paginateNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Note.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find().skip(skip).limit(limit);
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 17. GET /api/notes/paginate/category/:category — Paginate category notes
exports.paginateByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowedCategories = ["work", "personal", "study"];
    if (!allowedCategories.includes(category)) return res.status(400).json({ success: false, message: "Invalid category. Allowed: work, personal, study", data: null });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { category };
    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).skip(skip).limit(limit);
    return res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      data: notes,
      pagination: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

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

// 9. GET /api/notes/search — Search title only
exports.searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ title: { $regex: q, $options: "i" } });
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 10. GET /api/notes/search/content — Search content only
exports.searchByContent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ content: { $regex: q, $options: "i" } });
    return res.status(200).json({ success: true, message: `Content search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 11. GET /api/notes/search/all — Search title + content
exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ]
    });
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 12. GET /api/notes/filter-sort — Filter + Sort
exports.filterAndSort = async (req, res) => {
  try {
    const { category, isPinned, sortBy, order } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    
    const allowedSortFields = ["title", "createdAt", "updatedAt", "category"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    
    const notes = await Note.find(filter).sort({ [sortField]: sortOrder });
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

// 13. GET /api/notes/filter-paginate — Filter + Paginate
exports.filterAndPaginate = async (req, res) => {
  try {
    const { category, isPinned, page, limit } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter).skip(skip).limit(limitNum);
    
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unexpected server or database error", data: null });
  }
};

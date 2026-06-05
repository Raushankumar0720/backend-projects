const mongoose = require("mongoose");
const Note = require("../models/note.model");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


// 1. POST /api/notes — Create a note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const newNote = await Note.create({
      title,
      content,
      category,
      isPinned
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unexpected server or database error",
      data: null
    });
  }
};

// 2. POST /api/notes/bulk — Create multiple notes
exports.createNotesBulk = async (req, res) => {
  try {
    const { notes } = req.body || {};

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Notes array is required and cannot be empty",
        data: null
      });
    }

    const createdNotes = await Note.insertMany(notes);

    return res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unexpected server or database error",
      data: null
    });
  }
};

// 3. GET /api/notes — Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server or database error",
      data: null
    });
  }
};

// 4. GET /api/notes/:id — Get note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server or database error",
      data: null
    });
  }
};

// 5. PUT /api/notes/:id — Replace a note completely
exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const { title, content, category, isPinned } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const updateData = {
      title,
      content,
      category: category !== undefined ? category : "personal",
      isPinned: isPinned !== undefined ? isPinned : false
    };

    const replacedNote = await Note.findByIdAndUpdate(
      id,
      updateData,
      { new: true, overwrite: true, runValidators: true }
    );

    if (!replacedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: replacedNote
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unexpected server or database error",
      data: null
    });
  }
};


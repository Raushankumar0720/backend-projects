const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

router.post("/bulk", noteController.createNotesBulk);
router.delete("/bulk", noteController.deleteNotesBulk);
router.get("/category/:category", noteController.getNotesByCategory);
router.get("/status/:isPinned", noteController.getNotesByStatus);
router.get("/filter", noteController.filterNotes);
router.get("/filter/pinned", noteController.getPinnedNotes);
router.get("/filter/category", noteController.filterByCategory);
router.get("/filter/date-range", noteController.filterByDateRange);
router.post("/", noteController.createNote);
router.get("/", noteController.getAllNotes);
router.get("/:id/summary", noteController.getNoteSummary);
router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.replaceNote);
router.patch("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;

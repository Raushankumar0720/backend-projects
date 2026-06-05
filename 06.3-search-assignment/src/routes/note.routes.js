const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

router.post("/bulk", noteController.createNotesBulk);
router.post("/", noteController.createNote);
router.get("/", noteController.getAllNotes);


module.exports = router;

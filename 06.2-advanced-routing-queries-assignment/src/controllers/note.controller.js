const mongoose = require("mongoose");
const Note = require("../models/note.model");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

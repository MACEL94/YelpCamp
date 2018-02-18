var mongoose = require("mongoose");

// Schema setup
var commentSchema = new mongoose.Schema(
    {
        text: String,
        author: String,
    }
);

// Schema compile in modo da avere la classe utilizzabile
module.exports = mongoose.model("Comment", commentSchema);
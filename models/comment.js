var mongoose = require("mongoose");

// Schema setup
var commentSchema = new mongoose.Schema(
    {
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    }
);

// Schema compile in modo da avere la classe utilizzabile
module.exports = mongoose.model("Comment", commentSchema);
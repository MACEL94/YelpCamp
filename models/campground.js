var mongoose = require("mongoose");

// Schema setup
var campGroundSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    }
);

// Schema compile in modo da avere la classe utilizzabile
module.exports = mongoose.model("Campground", campGroundSchema);
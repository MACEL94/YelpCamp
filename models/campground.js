var mongoose = require("mongoose");

// Schema setup
var campGroundSchema = new mongoose.Schema(
    {
        name: String,
        price: String,
        image: String,
        description: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        },
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
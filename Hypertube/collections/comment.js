var mongoose = require("mongoose");

CommentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    text: String,
    date: Date
});

module.exports = mongoose.model("Comment", CommentSchema);
var mongoose                = require("mongoose");

var MovieSchema = new mongoose.Schema({
    name: String,
    tmdbId: Number,
    video: String,
    comments: [{
        authorId: mongoose.Schema.Types.ObjectId,
        authorName: String,
        text: String,
        date: Date
    }]
});

module.exports = mongoose.model("Movie", MovieSchema);
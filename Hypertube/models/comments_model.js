var Comment = require("../collections/comment"),
    Movie   = require("../collections/movie");

module.exports = {
    addComment: function (author, text, callback) {
        Comment.create({
            author:{
                id: author._id,
                name: author.firstName + ' ' + author.lastName
            },
            text: text,
            date: new Date
        }, function (err, comment) {
            if (!err)
                callback(null, comment);
        })
    }
};
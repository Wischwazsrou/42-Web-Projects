var Movie = require("../collections/movie");

module.exports = {
    addMovie: function (id, video, title) {
        Movie.create({
            name: title,
            tmdbId: id,
            video: video
        }, function (err) {
            if (err)
                console.log(err);
        })
    },
    getMovieByTmdbId: function (id, callback) {
        Movie.findOne({tmdbId: id}, function (err, movie) {
            if (!err)
                callback(null, movie);
        })
    }
};
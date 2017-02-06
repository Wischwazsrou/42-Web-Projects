var express     = require("express"),
    app         = express(),
    request     = require("request"),
    torrentStream = require('torrent-stream'),
    fs          = require("fs"),
    movies      = require("../models/movies_model"),
    users       = require("../models/users_model"),
    comments    = require("../models/comments_model");

app.get("/", isLoggedIn, function (req, res) {

});

app.get("/:id", isLoggedIn, function (req, res) {
    request("https://api.themoviedb.org/3/movie/" + req.params.id + "?api_key=08ec0cb8989aefee24d9b23a10574190&append_to_response=credits",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var movie = JSON.parse(body);
                var array = movie.original_title.split(" ");
                var searchName = array[0];
                for (var i = 1; i < array.length; i++){
                    searchName += "-" + array[i];
                }
                searchName += "-" + movie.release_date.split("-")[0];
                searchName = searchName.toLowerCase();
                movies.getMovieByTmdbId(movie.id, function (err, foundMovie) {
                    if (foundMovie) {
                        res.render("streaming", {movie: movie, title: searchName, comments: foundMovie.comments});
                    }
                    else
                        res.render("streaming", {movie: movie, title: searchName, comments: null});
                });
            }
        })
});

app.post("/getMagnet", function (req, res) {
    request("https://yts.ag/movie/" + req.body.titleSearch,
        function (error, response, body) {
            if (!error && response.statusCode == 200){
                var magnet;
                var start = body.indexOf("720p Torrent");
                var getResolution = body.substr(start, 800);
                start = getResolution.indexOf("magnet");
                magnet = getResolution.substr(start, 500).split("\"")[0];
                req.session.canPlay = true;
                res.send(magnet);
            }
            else{
                req.session.canPlay = false;
                res.send(null);
            }
        });
});

app.post("/:id/download", isLoggedIn, function (req, res) {
    var movie_file;
    var format;
    var newFileName;
    var folder;

    movies.getMovieByTmdbId(req.params.id, function (err, movie) {
        if (movie){
            console.log("Movie already exists.");
            newFileName = movie.video;
            users.getSingleUserById(req.user._id, function (err, user) {
                if (!err) {
                    if (user.moviesWatched.indexOf(req.body.movieId) <= -1) {
                        user.moviesWatched.push(req.body.movieId);
                        users.updateMovieWatched(req.user._id, user.moviesWatched);
                    }
                }
            });
            res.send(newFileName);
        }
        else{
            console.log("Begin !");
            var engine = torrentStream(req.body.magnet,
                {
                    connections: 1000,
                    uploads: 10,
                    tmp: 'D:/Documents/42/git_42/Hypertube/public/torrent',
                    path: 'D:/Documents/42/git_42/Hypertube/public/video',
                    verify: true,
                    dht: true,
                    tracker: true,
                    trackers: [
                        'udp://tracker.openbittorrent.com:80',
                        'udp://tracker.ccc.de:80'
                    ]
                });
            engine.on('ready', function() {
                console.log("Engine Ready.");
                engine.files.forEach(function(file) {
                    if (file.name.match(".mkv") !== null || file.name.match(".mp4") !== null || file.name.match(".avi") !== null){
                        movie_file = file;
                        var array = file.name.split(".");
                        format = array[array.length - 1];
                    }
                });
                var index = req.body.movieName.indexOf(":");
                if (index > -1)
                    newFileName = req.body.movieName.slice(0, index) + req.body.movieName.slice(index + 1, req.body.movieName.length) + "_" + req.body.movieId + "." + format;
                else
                    newFileName = req.body.movieName + "_" + req.body.movieId + "." + format;
                movie_file.select();
                movie = movie_file.createReadStream();
                folder = movie._engine.torrent.name;
                engine.on('download', function (piece_index) {
                    // console.log(piece_index);
                    // console.log('torrentStream Notice: Downloaded piece: Index:', piece_index, '(', engine.swarm.downloaded, '/', movie.length, ')');
                });
                engine.on('idle', function () {
                    console.log("Engine Idle.");
                    console.log("Path -> " + folder + "/" + movie_file.name);
                    movies.getMovieByTmdbId(req.params.id, function (err, foundMovie) {
                        if (!foundMovie){
                            fs.stat("D:/Documents/42/git_42/Hypertube/public/video/" + folder + "/" + movie_file.name, function (err, stats) {
                                if (err)
                                    console.log(err);
                                else{
                                    if (stats.size == movie.length) {
                                        console.log('torrentStream Notice: Download completed.');
                                        fs.rename("D:/Documents/42/git_42/Hypertube/public/video/" + folder + "/" + movie_file.name, "D:/Documents/42/git_42/Hypertube/public/video/" + newFileName,
                                            function (err) {
                                                if (!err) {
                                                    engine.destroy();
                                                    console.log("Renamed done.");
                                                    movies.addMovie(req.params.id, newFileName, req.body.movieName);
                                                    users.getSingleUserById(req.user._id, function (err, user) {
                                                        if (!err) {
                                                            if (user.moviesWatched.indexOf(req.body.movieId) <= -1) {
                                                                user.moviesWatched.push(req.body.movieId);
                                                                users.updateMovieWatched(req.user._id, user.moviesWatched);
                                                            }
                                                        }
                                                    });
                                                    done = true;
                                                    res.send(newFileName);
                                                }
                                                else {
                                                    console.log("Why Billy ?");
                                                    console.log(err)
                                                }
                                            });
                                    }
                                }
                            });
                        }

                    });
                });
            });
        }
    });
});

app.post("/comments", function (req, res) {
    movies.getMovieByTmdbId(req.body.movieId, function (err, movie) {
        if (!err){
            movie.comments.push({
                authorId: req.user._id,
                authorName: req.user.firstName + ' ' + req.user.lastName,
                text: req.body.comment,
                date: new Date
            });
            movie.save();
            res.send(req.user.firstName + ' ' + req.user.lastName);
        }
    })

});

app.post("/like", function (req, res) {
    var index;
    users.getSingleUserById(req.user._id, function (err, user) {
        if (!err){
           for (index = 0; index < user.favoriteMovies.length; index++){
               if (user.favoriteMovies[index].id == req.body.movieId)
                   break;
           }
           if (index < user.favoriteMovies.length) {
               user.favoriteMovies.splice(index, 1);
               user.save();
           }
           else{
               user.favoriteMovies.push({
                   title: req.body.movieName,
                   id: req.body.movieId
               });
               user.save();
           }
           res.send("success");
        }
    })
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}

module.exports = app;
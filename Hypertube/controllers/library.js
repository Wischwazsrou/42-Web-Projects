var express     = require("express"),
    app         = express(),
    request     = require("request"),
    validator   = require("validator");

app.get("/", isLoggedIn, function (req, res) {
    req.session.videoType = "movie";
    req.session.search = "";
    request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var movies = JSON.parse(body).results;
                request("https://api.themoviedb.org/3/genre/movie/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                    function (error, response, body){
                        if (!error && response.statusCode == 200){
                            var genres = JSON.parse(body).genres;
                            res.render("library", {movies: movies, genres: genres});
                        }
                        else
                            console.log(error);
                    });
            }
            else
                console.log(error);
        });
});

app.get("/tvShow", isLoggedIn, function (req, res) {
    req.session.videoType = "tv";
    request("https://api.themoviedb.org/3/discover/tv?api_key=08ec0cb8989aefee24d9b23a10574190",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var movies = JSON.parse(body).results;
                request("https://api.themoviedb.org/3/genre/tv/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                    function (error, response, body){
                        if (!error && response.statusCode == 200){
                            var genres = JSON.parse(body).genres;
                            res.render("library", {movies: movies, genres: genres});
                        }
                        else
                            console.log(error);
                    });
            }
            else
                console.log(error);
        });
});

app.get("/genre=:id", isLoggedIn, function (req, res) {
    if (validator.isNumeric(req.params.id) === true){
        request("https://api.themoviedb.org/3/discover/" + req.session.videoType + "?api_key=08ec0cb8989aefee24d9b23a10574190&with_genres=" + req.params.id,
            function (error, response, body) {
                if (!error && response.statusCode == 200){
                    var movies = JSON.parse(body).results;
                    if (movies.length > 0) {
                        request("https://api.themoviedb.org/3/genre/" + req.session.videoType + "/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                            function (error, response, body){
                                if (!error && response.statusCode == 200){
                                    var genres = JSON.parse(body).genres;
                                    res.render("library", {movies: movies, genres: genres});
                                }
                                else
                                    console.log(error);
                            });
                    }
                    else{
                        req.flash("error", "Error: ");
                        req.flash("info", "Invalid request.");
                        res.redirect("/library");
                    }
                }
                else
                    console.log(error);
            })
    }
    else{
        req.flash("error", "Error: ");
        req.flash("info", "Invalid request.");
        res.redirect("/library");
    }
});

app.get("/search", isLoggedIn, function (req, res) {
    if (req.session.search){
        request("https://api.themoviedb.org/3/discover/" + req.session.videoType + "?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search,
            function (error, response, body) {
                if (!error && response.statusCode == 200){
                    var search = JSON.parse(body).results;
                    request("https://api.themoviedb.org/3/genre/" + req.session.videoType + "/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                        function (error, response, body){
                            if (!error && response.statusCode == 200){
                                var genres = JSON.parse(body).genres;
                                res.render("library", {movies: search, genres: genres});
                            }
                            else
                                console.log(error);
                        });
                }
                else
                    console.log(error);
            })
    }
    else{
        req.flash("error", "Error:");
        req.flash("info", "Invalid Research.");
        res.redirect("/library");
    }
});

app.post("/search", isLoggedIn, function (req, res) {
    var genre   = "",
        sort    = "",
        year    = "";

    if (req.body.genres !== "none")
        genre = "&with_genres=" + req.body.genres;
    if (req.body.sortBy !== "none")
        sort = "&sort_by=" + req.body.sortBy;
    if (req.body.years !== "none")
        year = "&primary_release_year=" + req.body.years;

    req.session.search = genre + sort + year;
    res.redirect("/library/search");
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}

module.exports = app;
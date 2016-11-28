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
    req.session.search = "";
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
        if (req.session.search.indexOf("&query=") == -1) {
            request("https://api.themoviedb.org/3/discover/" + req.session.videoType + "?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var search = JSON.parse(body).results;
                        request("https://api.themoviedb.org/3/genre/" + req.session.videoType + "/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
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
            request("https://api.themoviedb.org/3/search/" + req.session.videoType + "?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var search = JSON.parse(body).results;
                        request("https://api.themoviedb.org/3/genre/" + req.session.videoType + "/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
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
    }
    else{
        req.flash("error", "Error:");
        req.flash("info", "Invalid Research.");
        res.redirect("/library");
    }
});

app.post("/search", isLoggedIn, function (req, res) {
    var genre       = "",
        sort        = "",
        year        = "",
        people      = "",
        rate        = "";

    if (!req.body.keywords) {
        if (req.body.people) {
            request("https://api.themoviedb.org/3/search/person?api_key=08ec0cb8989aefee24d9b23a10574190&query=" + req.body.people,
                function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        people = "&with_people=" + JSON.parse(body).results[0].id;
                        if (req.body.genres !== "none")
                            genre = "&with_genres=" + req.body.genres;
                        if (req.body.sortBy !== "none")
                            sort = "&sort_by=" + req.body.sortBy;
                        if (req.body.years !== "none") {
                            if (req.session.videoType == "movie")
                                year = "&primary_release_year=" + req.body.years;
                            else
                                year = "&first_air_date.gte=" + req.body.years;
                        }
                        if (req.body.rate != 0)
                            rate = "&vote_average.gte=" + req.body.rate.toString();
                        req.session.search = genre + sort + year + people + rate;
                        res.redirect("/library/search");
                    }
            });
        }
        else{
            if (req.body.genres !== "none")
                genre = "&with_genres=" + req.body.genres;
            if (req.body.sortBy !== "none")
                sort = "&sort_by=" + req.body.sortBy;
            if (req.body.years !== "none") {
                if (req.session.videoType == "movie")
                    year = "&primary_release_year=" + req.body.years;
                else
                    year = "&first_air_date.gte=" + req.body.years;
            }
            if (req.body.rate != 0)
                rate = "&vote_average.gte=" + req.body.rate.toString();
            req.session.search = genre + sort + year + rate;
            res.redirect("/library/search");
        }
    }
    else {
        req.session.search = "&query=" + req.body.keywords;
        res.redirect("/library/search");
    }
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}

module.exports = app;
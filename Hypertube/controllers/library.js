var express     = require("express"),
    app         = express(),
    request     = require("request"),
    validator   = require("validator");

app.get("/", isLoggedIn, function (req, res) {
    req.session.search = "";
    req.session.genre = "";
    request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                req.session.pagination = {
                    movies: JSON.parse(body).results,
                    currentPage: 1,
                    totalPages: parseInt(JSON.parse(body).total_pages),
                    category: "home",
                    index: 0
                };
                request("https://api.themoviedb.org/3/genre/movie/list?api_key=08ec0cb8989aefee24d9b23a10574190",
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var genres = JSON.parse(body).genres;
                            req.session.pagination.genres = JSON.parse(body).genres;
                            res.render("library", {genres: genres});
                        }
                        else
                            console.log(error);
                    });
                request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190&page=2",
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            req.session.pagination.movies = req.session.pagination.movies.concat(JSON.parse(body).results);
                            req.session.save();
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
    if (validator.isNumeric(req.params.id) === true) {
        req.session.genre = req.params.id;
        request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190&with_genres=" + req.params.id,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    req.session.pagination = {
                        movies: JSON.parse(body).results,
                        currentPage: parseInt(JSON.parse(body).page),
                        totalPages: parseInt(JSON.parse(body).total_pages),
                        category: "genres",
                        index: 0
                    };
                    res.render("library", {genres: req.session.pagination.genres});
                    if (req.session.pagination.totalPages > 1)
                        request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190&with_genres=" + req.params.id + "&page=2",
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    req.session.pagination.movies = req.session.pagination.movies.concat(JSON.parse(body).results);
                                    req.session.save();
                                }
                            });
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
});

app.get("/search", isLoggedIn, function (req, res) {
    if (req.session.search) {
        if (req.session.search.indexOf("&query=") == -1) {
            request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        req.session.pagination = {
                            movies: JSON.parse(body).results,
                            currentPage: parseInt(JSON.parse(body).page),
                            totalPages: parseInt(JSON.parse(body).total_pages),
                            category: "search",
                            index: 0
                        };
                        res.render("library", {genres: req.session.pagination.genres});
                        if (req.session.pagination.totalPages > 1)
                            request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search + "&page=2",
                                function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        req.session.pagination.movies = req.session.pagination.movies.concat(JSON.parse(body).results);
                                        req.session.save();
                                    }
                                    else
                                        console.log(error);
                                });
                    }
                    else
                        console.log(error);
                });
        }
        else {
            request("https://api.themoviedb.org/3/search/movie?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        req.session.pagination = {
                            movies: JSON.parse(body).results,
                            currentPage: parseInt(JSON.parse(body).page),
                            totalPages: parseInt(JSON.parse(body).total_pages),
                            category: "keywords",
                            index: 0
                        };
                        res.render("library", {genres: genres});
                        if (req.session.pagination.totalPages > 1)
                            request("https://api.themoviedb.org/3/search/movie?api_key=08ec0cb8989aefee24d9b23a10574190" + req.session.search,
                                function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        req.session.pagination = {
                                            movies: JSON.parse(body).results,
                                            currentPage: parseInt(JSON.parse(body).page),
                                            totalPages: parseInt(JSON.parse(body).total_pages),
                                            category: "keywords",
                                            index: 0
                                        };
                    }
                    else
                        console.log(error);
                });
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
                        var tmp = JSON.parse(body).results[0].id;
                        if (tmp)
                            people = "&with_people=" + tmp;
                        if (req.body.genres !== "none")
                            genre = "&with_genres=" + req.body.genres;
                        if (req.body.sortBy !== "none")
                            sort = "&sort_by=" + req.body.sortBy;
                        if (req.body.sortBy === "none")
                            sort = "&sort_by=original_title.asc";
                        if (req.body.years !== "none") {
                            year = "&primary_release_year=" + req.body.years;
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
                year = "&primary_release_year=" + req.body.years;
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

app.post("/changePage", isLoggedIn, function (req, res) {
    req.session.pagination.currentPage += parseInt(req.body.page);
    if (req.body.page > 0)
        req.session.pagination.movies.splice(0, 20);
    else
        req.session.pagination.movies.splice(40, 20);
    if (req.session.pagination.category == "home")
        request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190&page=" + (req.session.pagination.currentPage + 1),
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (req.body.page > 0)
                        req.session.pagination.movies = req.session.pagination.movies.concat(JSON.parse(body).results);
                    else
                        req.session.pagination.movies = JSON.parse(body).results.concat(req.session.pagination.movies);
                    req.session.pagination.index = 20;
                    req.session.save();
                }
            });
    if (req.session.pagination.category == "genres")
        request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190&with_genres=" + req.params.id + "&page=1",
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    req.session.pagination = {
                        movies: JSON.parse(body).results,
                        currentPage: parseInt(JSON.parse(body).page),
                        totalPages: parseInt(JSON.parse(body).total_pages),
                        category: "genres",
                        index: 0
                    };
                }
            });
    res.render("library", {genres: req.session.pagination.genres});
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}

module.exports = app;
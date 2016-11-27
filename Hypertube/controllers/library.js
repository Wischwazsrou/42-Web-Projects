var express     = require("express"),
    app         = express(),
    request     = require("request"),
    validator   = require("validator");

app.get("/", isLoggedIn, function (req, res) {
    if (!req.session.movies) {
        request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190",
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var movies = JSON.parse(body).results;
                    res.render("library", {movies: movies});
                }
            });
    }
    else
        res.render("library", {movies: req.session.movies});
});

app.get("/:id", isLoggedIn, function (req, res) {
    if (validator.isNumeric(req.params.id) === true){
        request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190&with_genres=" + req.params.id,
            function (error, response, body) {
                if (!error && response.statusCode == 200){
                    var movies = JSON.parse(body).results;
                    if (movies.length > 0)
                        res.render("library", {movies: movies});
                    else{
                        req.flash("error", "Error: ");
                        req.flash("info", "Invalid request.");
                        res.redirect("/library");
                    }
                }
                else
                    console.log(error)
            })
    }
    else{
        req.flash("error", "Error: ");
        req.flash("info", "Invalid request.");
        res.redirect("/library");
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
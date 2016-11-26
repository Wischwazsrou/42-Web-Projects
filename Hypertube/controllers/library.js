var express     = require("express"),
    app         = express(),
    request     = require("request");

app.get("/", isLoggedIn, function (req, res) {
    request("https://api.themoviedb.org/3/discover/movie?api_key=08ec0cb8989aefee24d9b23a10574190",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var movies = JSON.parse(body).results;
                res.render("library", {movies: movies});
            }
        });
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}

module.exports = app;
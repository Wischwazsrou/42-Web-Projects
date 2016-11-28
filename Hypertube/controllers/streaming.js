var express     = require("express"),
    app         = express(),
    request     = require("request");

app.get("/", isLoggedIn, function (req, res) {
    res.render("streaming");
});

app.get("/:id", isLoggedIn, function (req, res) {
    request("https://api.themoviedb.org/3/movie/" +  req.params.id + "?api_key=08ec0cb8989aefee24d9b23a10574190&append_to_response=credits",
        function (error, response, body) {
            if (!error && response.statusCode == 200){
                var movie = JSON.parse(body);
                res.render("streaming", {movie: movie});
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
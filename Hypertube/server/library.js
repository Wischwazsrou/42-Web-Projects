var express     = require("express"),
    app         = express();

app.get("/", isLoggedIn, function (req, res) {
    res.render("library");
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}

module.exports = app;
var express     = require("express"),
    app         = express(),
    passport    = require("passport"),
    validator   = require("validator"),
    users       = require("../models/users_model");

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/signout", isLoggedIn, function(req, res){
    req.flash("success", "You are now log out");
    req.logout();
    res.redirect("/");
});


app.get("/error", function (req, res) {
    req.flash("error", "Error: Wrong username or password.");
    res.redirect("/");
});

app.post("/", passport.authenticate("local",
    {
        successRedirect: "/library",
        failureRedirect: "/error"
    }),
    function (req, res) {
    }
);

app.post("/signup", function (req, res) {
    var error   = false,
        message = "";

    if (validator.isAlphanumeric(req.body.username) === false){
        message = message + "/Invalid username";
        error = true;
    }
    if (validator.isEmail(req.body.email) === false) {
        message = message + "/Invalid email address";
        error = true;
    }
    if (req.body.password.match(/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/) === null) {
        message = message + "/Invalid password. Must contain between 8 and 18 characters. You also can only use the following special characters [?@.*;:!_-]";
        error = true;
    }
    if (error === false) {
        users.getSingleUserByUsername(req.body.username, function (err, user) {
           if (!err){
               if (user){
                   message = message + "/Username already used.";
                   error = true;
               }
               users.getSingleUserByEmail(req.body.email, function (err, user) {
                   if (!err){
                       if (user){
                           message = message + "/Email already used.";
                           error = true;
                       }
                       if (error === false){
                           users.addUser(req);
                           req.flash("success", "Your account has been successfully created. You can now log in");
                           return res.redirect("/");
                       }
                       else {
                           req.flash("error", "Error:");
                           req.flash("info", message);
                           return res.redirect("/signup");
                       }
                   }
               })
           }
        });
    }
    else {
        req.flash("error", "Error: You didn't filled the form correctly.");
        req.flash("info", message);
        return res.redirect("/signup");
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
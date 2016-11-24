var express     = require("express"),
    app         = express(),
    users       = require("../models/users_model"),
    mongoose    = require("mongoose"),
    validator   = require("validator"),
    hash        = require("nodejs-hash-performance");

app.get("/", isLoggedIn, function (req, res) {
    res.render("library");
});

app.get("/:id", isLoggedIn, function (req, res) {
    if (req.params.id.length == 12 || req.params.id.length == 24) {
        var id = mongoose.Types.ObjectId(req.params.id);
        users.getSingleUserById(id, function (err, user) {
            if (user) {
                if (user._id.toString() !== req.user._id.toString())
                    res.render("usersProfile");
                else
                    res.render("currentUserProfile");
            }
            else
                res.render("home");
        });
    }
    else{
        res.render("home");
    }
});

app.get("/:id/edit_profile", isLoggedIn, function (req, res) {
    if (req.params.id.length == 12 || req.params.id.length == 24) {
        var id = mongoose.Types.ObjectId(req.params.id);
        users.getSingleUserById(id, function (err, user) {
            if (user) {
                if (user._id.toString() !== req.user._id.toString()) {
                    req.flash("error", "You are not allowed to do that.");
                    res.render("home");
                }
                else {
                    res.render("edit_profile");
                }
            }
            else
                res.render("home");
        });
    }
    else{
        res.render("home");
    }
});

app.post("/change_email", isLoggedIn, function (req, res) {
    console.log(req.user.username);
    console.log("=========");
    if (validator.isEmail(req.body.email) ===  true){
        users.getSingleUserByEmail(req.body.email, function (err, user) {
            if (!err){
                if (!user){
                    users.getSingleUserByUsername(req.user.username, function (err, user) {
                        if (!err){
                            if (user.password === hash(req.body.password, "whirlpool", "base64")){
                                users.updateEmail(req.user.username, req.body.email);
                                req.flash("success", "Your email address has been updated.");
                                res.redirect("/users/" + req.user._id.toString());
                            }
                            else{
                                req.flash("error", " Error:");
                                req.flash("info", "Invalid password");
                                res.redirect("/users/" + req.user._id.toString() + "/edit_profile");
                            }
                        }
                    })
                }
                else{
                    req.flash("error", "Error:");
                    req.flash("info", "This email address already exists");
                    res.redirect("/users/" + req.user._id.toString() + "/edit_profile");
                }
            }
        });
    }
    else{
        req.flash("error", "Error:");
        req.flash("info", "Invalid email address");
        res.redirect("/users/" + req.user._id.toString() + "/edit_profile");
    }
});

app.post("/change_password", isLoggedIn, function (req, res) {
    users.getSingleUserByUsername(req.user.username, function (err, user) {
        if (user.password === hash(req.body.current_password, "whirlpool", "base64")){
            if (req.body.new_password.match(/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/) !== null){
                if (req.body.new_password === req.body.confirm_password){
                    users.updatePassword(user.username, req.body.new_password);
                    req.flash("success", "Your password has been updated.");
                    res.redirect("/users/" + req.user._id.toString());
                }
                else{
                    req.flash("error", "Error:")
                    req.flash("info", "New password and confirmm password are not the same.");
                    res.redirect("/users/" + req.user._id.toString() + "/edit_profile");
                }
            }
            else{
                req.flash("error", "Error:")
                req.flash("info", "Invalid new password. Must contain between 8 and 18 characters. You also can only use the following special characters [?@.*;:!_-]");
                res.redirect("/users/" + req.user._id.toString() + "/edit_profile");
            }
        }
        else{
            req.flash("error", "Error:")
            req.flash("info", "Invalid password.");
            res.redirect("/users/" + req.user._id.toString() + "/edit_profile");
        }
    });
});

app.post("/change_about", isLoggedIn, function (req, res) {
    users.getSingleUserByUsername(req.user.username, function (err, user) {
        users.updateAbout(user.username, req.body.about);
        req.flash("success", "Your information has been updated.");
        res.redirect("/users/" + req.user._id.toString());
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
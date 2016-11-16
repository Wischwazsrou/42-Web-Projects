var express         = require("express"),
    app             = express(),
    mongo           = require("../db"),
    mongoDb         = require("mongodb"),
    likes           = require("../models/likes_model"),
    report          = require("../models/reports_model"),
    collection      = require("../models/match_model"),
    notifications   = require("../models/notifications_model"),
    sortMatch       = require("../models/find_match_model"),
    edit            = require("../models/edit_model");

app.get("/", isLoggedIn, function (req, res) {
    var db = mongo.getDb(),
        match = [],
        user_score = {user: String, score: Number};

    collection.getAllPictures(db, function (err, pictures) {
        if (!err){
            collection.getAllLikes(db, function (err, likes) {
                if (!err){
                    collection.getMatchUsers(db, req, res, function (err, users) {
                        if (!err) {
                            sortMatch.init_match(req, users, match, user_score, function (err, matchInit) {
                                if (!err) {
                                    match = matchInit;
                                    if (!req.session.standards) {
                                        sortMatch.classic_sort(req, users, match, function (err, match) {
                                            if (!err) {
                                                res.render("match", {
                                                    req: req,
                                                    users: users,
                                                    likes: likes,
                                                    pictures: pictures,
                                                    array: match
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        sortMatch.sort_by_standards(req, users, match, function (err, match) {
                                            if (!err) {
                                                res.render("match", {
                                                    req: req,
                                                    users: users,
                                                    likes: likes,
                                                    pictures: pictures,
                                                    array: match
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    })
                }
            })
        }
    });
});

app.post("/sort", isLoggedIn, function (req, res) {
    req.session.sortBy = req.body.sort;
    req.session.intervalAgeMin = req.body.filter_min_age;
    req.session.intervalAgeMax = req.body.filter_max_age;
    req.session.intervalPopMin = req.body.filter_min_popularity;
    req.session.intervalPopMax = req.body.filter_max_popularity;
    req.session.city = req.body.filter_location;
    req.session.tags = req.body.filter_tags;

    req.session.intervalAgeMin = !req.session.intervalAgeMin ? 0 : req.session.intervalAgeMin;
    req.session.intervalAgeMax = !req.session.intervalAgeMax ? 99 : req.session.intervalAgeMax;
    req.session.intervalPopMin = !req.session.intervalPopMin ? 0 : req.session.intervalPopMin;
    req.session.intervalPopMax = !req.session.intervalPopMax ? 1000 : req.session.intervalPopMax;

    if (req.session.intervalAgeMin == 0 && req.session.intervalAgeMax == 99
            && req.session.intervalPopMin == 0 && req.session.intervalPopMax == 1000
            && !req.session.city && !req.session.tags && req.session.sortBy == "None") {
        req.session.standards = false;
    }
    else {
        req.session.standards = true;
    }
    res.redirect("/match");
});

app.get("/:id", isLoggedIn, function (req, res) {
    var db = mongo.getDb(),
        id = req.params.id,
        logged = false,
        message = "visited your profile.",
        new_notif = true,
        up_popularity = true;

    collection.getAllLikes(db, function (err, likes) {
        if (!err){
            collection.getSingleUser(db, id, function (err, user) {
                if (!err) {
                    collection.getAllPictures(db, function (err, pictures) {
                        if (!err) {
                            user.userBlocked.forEach(function (user_blocked){
                               if (user_blocked === req.user.username)
                                   new_notif = false;
                            });
                            if (new_notif) {
                                notifications.getNotifications(db, user.username, function (err, foundNotifications) {
                                    if (!err) {
                                        foundNotifications.forEach(function (notification) {
                                            if (notification.sender === req.user.username && notification.message === message) {
                                                var minutes = Math.abs(new Date() - notification.date) / 60000;
                                                if (minutes < 1440) {
                                                    new_notif = false;
                                                }
                                                up_popularity = false;
                                            }
                                        });
                                        if (up_popularity === true)
                                            edit.edit_popularity(db, id, 1);
                                        if (new_notif === true)
                                            notifications.new_notification(db, req, user.username, message);
                                    }
                                });
                            }
                            res.render("show", {user: user, pictures: pictures, logged: logged, likes: likes});
                        }
                    })
                }
            })
        }
    });
});

app.post("/like", isLoggedIn, function (req, res) {
    var db = mongo.getDb(),
        message,
        connected = false,
        new_notif = true;

    collection.getLiked(db, req.user._id, function (err, foundLikes) {
        foundLikes.forEach(function (like){
            if (like.likerUser === req.body.liked_user)
                connected = true;
        });
        if (connected === true && req.body.state === "Like")
           message = "also liked your profile. You are now connected.";
        else if (req.body.state === "Like")
            message = "liked your profile.";
        else
            message = "disliked your profile.";
        likes.update_likes(db, req);
        if (req.body.state == "Like")
            edit.edit_popularity(db, req.body.liked_user, 3);
        else
            edit.edit_popularity(db, req.body.liked_user, -3);
        collection.getSingleUser(db, req.body.liked_user, function (err, user) {
            if (!err) {
                user.userBlocked.forEach(function (user_blocked){
                    if (user_blocked === req.user.username)
                        new_notif = false;
                });
                if (new_notif)
                    notifications.new_notification(db, req, user.username, message);
            }
        })
    });
    res.send("success")
});

app.post("/block_user", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    if (req.body.block == null){
        var index = req.user.userBlocked.indexOf(req.body.unblock);
        if (index > -1) {
            req.body.block = req.body.unblock;
            req.user.userBlocked.splice(index, 1);
        }
    }
    else
        req.user.userBlocked.push(req.body.block);
    report.block_user(db, req.user);
    notifications.getNotifications(db, req.user.username, function (err, notifs) {
       notifs.forEach(function (notif) {
           if (notif.state == 2 && notif.sender == req.body.block){
               notifications.editNotifications(db, notif._id);
           }
       })
    });
    res.redirect("/match/" + req.body.user_id);
});

app.post("/report_fake", isLoggedIn, function (req, res) {
   res.redirect("/match");
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/sign_in");
}

module.exports = app;
var express     = require("express"),
    app         = express(),
    mongo       = require("../db"),
    mongoDb     = require("mongodb"),
    edit        = require("../models/edit_model"),
    multer      = require("multer"),
    collection  = require("../models/match_model"),
    notif       = require("../models/notifications_model"),
    geoloc      = require("../models/geolocation_model"),
    validator   = require("validator"),
    hash        = require('nodejs-hash-performance'),
    request     = require("request");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/upload')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + Date.now() + "." + file.originalname.split(".")[1]);
    }
});
var upload = multer({ storage: storage });

app.get("/", isLoggedIn, function (req, res) {
    var db = mongo.getDb();

    collection.getLiked(db, req.user._id, function (err, liked) {
       if (!err){
           collection.getLiker(db, req.user._id, function (err, liker) {
               if (!err){
                   collection.getAllUsers(db, function (err, users) {
                       if (!err){
                           collection.getAllPictures(db, function (err, pictures) {
                               if (!err)
                                   res.render("user_profile", {liked: liked, liker: liker, users: users, pictures: pictures});
                           })
                       }
                   })
               }
           })
       }
    });
});

app.get("/edit_info", isLoggedIn, function (req, res) {
    res.render("edit_info");
});

app.post("/edit_info", isLoggedIn, function (req, res) {
    var db = mongo.getDb(),
        years = new Date(req.body.birth_date).getFullYear(),
        error = false,
        message = "";

    function check_edit(req, message, error, years, callback){

        if (validator.isAlpha(req.body.first_name) ===  false) {
            message = message + "/Invalid first name";
            error = true;
        }
        if (validator.isAlpha(req.body.last_name) ===  false) {
            message = message + "/Invalid last name";
            error = true;
        }
        if (years > new Date().getFullYear() || years <= new Date().getFullYear() - 100) {
            message = message + "/Invalid birth date";
            error = true;
        }
        if (validator.isEmail(req.body.email) ===  false) {
            message = message + "/Invalid email";
            error = true;
        }
        req.flash("info", message);
        callback(null, error);
    }

    geoloc.getLocation(req.body.location, function (err, foundLocation) {
        if (!err) {
            if (error === false) {
                error = foundLocation;
                if (error === true)
                    message = message + "/Invalid location";
            }
            geoloc.getLocation(req.body.city, function (err, foundCity) {
                if (error === false) {
                    error = foundCity;
                    if (error === true)
                        message = message + "/Invalid city";
                }
                if (!err){
                    check_edit(req, message, error, years, function (err, foundError) {
                        if (!err){
                            if (error === false)
                                error = foundError;
                            if (error === false){
                                req.flash("success", "Your profile has been successfully updated");
                                edit.edit_geolocate(db, req.user.username, "true");
                                edit.edit_info(db, req, req.user);
                                res.redirect("/user");
                            }
                            else {
                                req.flash("error", "Error: You didn't filled the form correctly.")
                                res.redirect("/user/edit_info");
                            }
                        }
                    })
                }
            })
        }
    });
});

app.post("/edit_pwd", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    if (req.body.new_password.match(/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/)) {
        if (hash(req.body.current_password, "whirlpool", "base64") === req.user.password) {
            if (req.body.new_password === req.body.confirm_password) {
                req.flash("success", "Your password has been successfully changed");
                edit.edit_pwd(db, hash(req.body.new_password, "whirlpool", "base64"), req.user);
                return res.redirect("/user");
            }
            else
                req.flash("error", "New password and confirmation password are not the same");
        }
        else
            req.flash("error", "Incorrect password");
    }
    else
        req.flash("error", "Invalid format for your new password");
    return res.redirect("/user/edit_info");
});

app.post("/edit_tags", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    req.user.tags.push(req.body.new_tag);
    edit.edit_tags(db, req.user);
    res.redirect("/user");
});

app.post("/remove_tags", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    var index = req.user.tags.indexOf(req.body.tag);
    if (index > -1){
        req.user.tags.splice(index, 1);
        edit.edit_tags(db, req.user);
        return res.send("success");
    }
    return res.send("failure");
});

app.get("/edit_pics", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    collection.getUserPictures(db, req.user.username, function (err, pictures) {
        if (!err)
            res.render("edit_pics", {pictures: pictures})
    });
});

app.post("/upload_pics", isLoggedIn, upload.single("displayImage"), function (req, res) {
    var db = mongo.getDb();
    collection.getUserPictures(db, req.user.username, function (err, pictures) {
        if (!err) {
            console.log(pictures.length);
            if (pictures.length < 5){
                edit.edit_pics(db, req);
                req.flash("success", "Picture successfully uploaded");
                res.redirect("/user/edit_pics");
            }
            else {
                req.flash("error", "You've already reach the maximum pictures allowed. Delete some to add new ones");
                res.redirect("/user/edit_pics");
            }
        }
    });
});

app.post("/remove_pic", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    edit.remove_pic(db, req.body);
    req.flash("success", "Picture successfully removed");
    res.redirect("/user/edit_pics");
});

app.post("/profile_pic", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    edit.profile_pic(db, req);
    req.flash("success", "Profile picture successfully updated");
    res.redirect("/user/edit_pics");
});

app.get("/edit_description", isLoggedIn, function (req, res) {
    res.render("edit_description");
});

app.post("/edit_description", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    edit.edit_description(db, req.body.description, req.user);
    req.flash("success", "Description successfully updated");
    res.redirect("/user");
});

app.get("/notifications", isLoggedIn, function (req, res) {
    var db = mongo.getDb();

    notif.getNotifications(db, req.user.username, function (err, notifications) {
        if (!err) {
            collection.getAllUsers(db, function (err, users) {
                if (!err){
                    collection.getAllPictures(db, function (err, pictures) {
                        if (!err) {
                            notifications.forEach(function (notification) {
                                if (notification.state  === 2) {
                                    notif.editNotifications(db, notification._id);
                                }
                            });
                            res.render("notifications", {
                                notifications: notifications,
                                users: users,
                                pictures: pictures
                            });
                        }
                    })
                }
            })
        }
    })
});

app.post("/notification", isLoggedIn, function (req, res) {
    var db = mongo.getDb(),
        new_notifications = "false";

    notif.getNotifications(db, req.body.receiver, function (err, notifications) {
        if (!err){
            notifications.forEach(function (notification) {
                if (notification.state === 2) {
                    new_notifications = "flag";
                    if (notification.message == "new message") {
                        new_notifications = "chat";
                    }
                }
            });
            res.send(new_notifications);
        }
    });
});

app.get("/chat", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    var chatters = [];
    var new_user;

    collection.getAllUsers(db, function (err, users) {
        if (!err){
            collection.getAllPictures(db, function (err, pictures) {
                if (!err){
                    collection.getUserAllMessages(db, req.user.username, function (err, messages) {
                        if (!err){
                            messages.forEach(function (message) {
                                new_user = true;
                                chatters.forEach(function (chatter) {
                                    if (message.sender === chatter || message.receiver === chatter){
                                        new_user = false;
                                    }
                                });
                                if (new_user === true){
                                    if (message.sender === req.user.username)
                                        chatters.push(message.receiver);
                                    else
                                        chatters.push(message.sender);
                                }
                            });
                            res.render("chat_room", {users: users, pictures: pictures, chatters: chatters, messages: messages});
                        }
                    });
                }
            })
        }
    });
});

app.post("/chat", isLoggedIn, function (req, res) {
    var db = mongo.getDb(),
        new_notif = true;

    collection.getSingleUserByUsername(db, req.body.receiver, function (err, user) {
        if (!err) {
            user.userBlocked.forEach(function (user_blocked){
                if (user_blocked === req.user.username)
                    new_notif = false;
            });
            if (new_notif)
                notif.new_notification(db, req, user.username, "new message");
        }
    });
    edit.new_message(db, req.body.receiver, req.body.sender, req.body.message);
    res.send("Success");
});

app.get("/chat/:id", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    collection.getSingleUser(db, req.params.id, function (err, user) {
        if (!err) {
            collection.getMessages(db, req.user.username, user.username, function (err, messages) {
                if (!err) {
                    messages.forEach(function (message) {
                        if (message.sender === user.username) {
                            notif.getNotifications(db, req.user.username, function (err, notifications) {
                                if (!err){
                                    notifications.forEach(function (notification) {
                                        if (notification.message === "new message" && notification.state === 2)
                                            notif.editNotifications(db, notification._id);
                                    })
                                }
                            });
                            edit.edit_message(db, message._id);
                        }
                    });
                    res.render("chat", {user: user, messages: messages});
                }
            })
        }
    });
});

app.post("/geolocate", isLoggedIn, function (req, res) {
    var db = mongo.getDb();

    collection.getSingleUserByUsername(db, req.user.username, function (err, user) {
        if (!err){
            if (user.permission != "true")
                edit.edit_geolocate(db, req.user.username, req.body.permission);
        }
    });
    res.send("success");
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/sign_in");
}

module.exports = app;
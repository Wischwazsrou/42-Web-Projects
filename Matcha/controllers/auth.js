var express         = require("express"),
    app             = express(),
    mongo           = require("../db"),
    passport        = require("passport"),
    newUser         = require("../models/sign_up"),
    logged          = require("../models/logged_model"),
    notifications   = require("../models/notifications_model"),
    collections     = require("../models/match_model"),
    edit            = require("../models/edit_model"),
    validator       = require("validator"),
    nodemailer      = require("nodemailer"),
    smtpTransport   = require('nodemailer-smtp-transport'),
    randomstring    = require("randomstring"),
    hash            = require('nodejs-hash-performance'),
    request         = require("request"),
    satelize        = require("satelize"),
    geo             = require("../models/geolocation_model");

app.get("/", function(req, res){
   res.render("index");
});

app.get("/sign_in", function (req, res) {
    res.render("sign_in");
});

app.get("/sign_up", function (req, res) {
    if (req.isAuthenticated())
        res.redirect("/match");
    else {
        res.render("sign_up");
    }
});

app.post("/sign_in", passport.authenticate("local",
    {
        successRedirect: "/logged",
        failureRedirect: "/sign_in"
    }), function (req, res) {
});

app.get("/logged", isLoggedIn, function (req, res) {
    var db = mongo.getDb();
    req.session.standards = false;
    req.session.sortBy = "None";
    req.session.intervalAgeMin = 0;
    req.session.intervalAgeMax = 99;
    req.session.intervalPopMin = 0;
    req.session.intervalPopMax = 1000;
    req.session.city = "";
    req.session.tags = "";
    logged.signin(db, req);
    res.redirect("/match");
});

app.post("/sign_up", function (req, res) {
    var db = mongo.getDb(),
        years = new Date(req.body.birth_date).getFullYear(),
        error = false,
        message = "",
        ipAddress = "";

    if (validator.isAlphanumeric(req.body.username) ===  false) {
        message = message + "/Invalid username.";
        error = true;
    }
    if (validator.isAlpha(req.body.first_name) ===  false) {
        message = message + "/Invalid first name.";
        error = true;
    }
    if (validator.isAlpha(req.body.last_name) ===  false) {
        message = message + "/Invalid last name.";
        error = true;
    }
    if (years > new Date().getFullYear() || years <= new Date().getFullYear() - 100) {
        message = message + "/Invalid birth date.";
        error = true;
    }
    if (validator.isEmail(req.body.email) ===  false) {
        message = message + "/Invalid email.";
        error = true;
    }
    if (req.body.password.match(/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/) ===  null) {
        message = message + "/Invalid password. Must contain between 8 and 18 characters. You also can only use the following special characters [?@.*;:!_-]";
        error = true;
    }
    if (req.body.confirm_password !== req.body.password) {
        message = message + "/Passwords are not the same.";
        error = true;
    }
    if (req.body.gender === "0") {
        message = message + "/You must select a gender.";
        error = true;
    }
    if (req.body.orientation === "0")
        req.body.orientation = 2;
    if (error === false) {
        collections.getSingleUserByUsername(db, req.body.username, function (err, foundUser) {
            if(!err){
                if (foundUser) {
                    message = message + "/Username already used.";
                    error = true
                }
                collections.getSingleUserByEmail(db, req.body.email, function (err, foundUser) {
                    if(!err){
                        if (foundUser) {
                            message = message + "/Email already used.";
                            error = true
                        }
                        if (error === false){
                            request('https://api.ipify.org?format=json', function (error, response, body) {
                                if(!error && response.statusCode == 200){
                                    ipAddress = body.toString().split("\"");
                                    satelize.satelize({ip: ipAddress[3].toString()}, function (err, coord) {
                                        if (!err) {
                                            geo.getLocationByLatlng(coord.latitude, coord.longitude, function (err, res) {
                                                if (!err) {
                                                    newUser.add_user(db, req, res[0].formattedAddress, res[0].city);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            req.flash("success", "Your account has been successfully created. You can now log in");
                            res.redirect("/sign_in");
                        }
                        if (error === true){
                            req.flash("error", "Error:");
                            req.flash("info", message);
                            res.redirect("/sign_up");
                        }
                    }
                });
            }
        });
    }
    else {
        req.flash("error", "Error: You didn't filled the form correctly.");
        req.flash("info", message);
        res.redirect("/sign_up");
    }
});

app.get("/logout", isLoggedIn, function(req, res){
    var db = mongo.getDb();
    logged.signout(db, req);
    req.flash("success", "You are now log out");
    req.logout();
    res.redirect("/");
});

app.get("/change_pwd", function (req, res) {
    res.render("change_pwd");
});

app.post("/change_pwd", function (req, res) {
    var db = mongo.getDb();

    if (validator.isAlphanumeric(req.body.username) === true) {
        console.log("valide username");
        collections.getSingleUserByUsername(db, req.body.username, function (err, foundUser) {
            if (foundUser.token == req.body.token) {
                console.log("valide token")
                if (req.body.new_password === req.body.confirm_password) {
                    console.log("valide pwd");
                    edit.edit_pwd(db, hash(req.body.new_password, "whirlpool", "base64"), foundUser);
                    res.redirect("/sign_in");
                }
            }
        })
    }
    else
        res.redirect("change_pwd");
});

app.post("/forgot_pwd", function (req, res) {
    var db = mongo.getDb();

    if (validator.isAlphanumeric(req.body.username) === true) {
        collections.getSingleUserByUsername(db, req.body.username, function (err, foundUser) {
            if (!err && foundUser){
                var token = randomstring.generate(8);
                req.flash("success", "An email has been send.");
                edit.edit_token(db, foundUser.username, token);
                var options = {
                    service: 'outlook',
                    auth: {
                        user: "pepey33@hotmail.fr",
                        pass: "Matcha9614*"
                    }
                };

                var transport = nodemailer.createTransport(smtpTransport(options));

                console.log('SMTP Configured');

                var mailOptions = {
                    from: '"Test" <pepey33@hotmail.fr>',
                    to: foundUser.email,
                    subject: 'Reset Password',
                    text: '',
                    html: '<p>Hi ' + foundUser.firstName + ' ! You asked for a reset of your password. Click on the link below ' +
                    'and insert this code <strong>' + token + '</strong> to get a new one</p>' +
                        '<a href="http://localhost:3000/change_pwd">Link</a>'
                };

                console.log('Sending Mail');

                transport.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent successfully!');
                    console.log('Message sent: ' + info.response);
                });
            }
            else {
                req.flash("error", "Error");
                req.flash("info", "Invalid username");
            }
            res.redirect("/sign_in");
        });
    }
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/sign_in");
}

module.exports = app;

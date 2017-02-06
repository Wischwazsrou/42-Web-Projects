var express         = require("express"),
    app             = express(),
    passport        = require("passport"),
    validator       = require("validator"),
    nodemailer      = require("nodemailer"),
    smtpTransport   = require('nodemailer-smtp-transport'),
    randomstring    = require("randomstring"),
    multer          = require("multer"),
    users           = require("../models/users_model");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.username + "." + file.originalname.split(".")[1]);
    }
});
var upload = multer({ storage: storage });

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

app.post("/", passport.authenticate("local",
    {
        successRedirect: "/init",
        failureRedirect: "/error"
    }),
    function (req, res) {
    }
);

app.get("/authFacebook", passport.authenticate("facebook",
    {
        scope: ["email"]
    }
));

app.get('/authFacebook/callback', passport.authenticate('facebook', {
        successRedirect : '/library',
        failureRedirect : '/'
    }));

app.get("/authGoogle", passport.authenticate("google",
    {
        scope: ["profile", "email"]
    }
));

app.get("/authGoogle/callback", passport.authenticate("google",
    {
        successRedirect: "/library",
        failureRedirect: "/"
    }
));

app.get("/auth42", passport.authenticate("42"));

app.get("/auth42/callback", passport.authenticate("42",
    {
        successRedirect: "/library",
        failureRedirect: "/"
    }
));

app.post("/signup", upload.single("displayImage"), function (req, res) {
    var error   = false,
        message = "",
        format = "";

    if (req.file)
        format = req.file.filename.split(".")[1];
    if (validator.isAlphanumeric(req.body.username) === false){
        message = message + "/Invalid username";
        error = true;
    }
    if (validator.isAlpha(req.body.first_name) === false){
        message = message + "/Invalid first name";
        error = true;
    }
    if (validator.isAlpha(req.body.last_name) === false){
        message = message + "/Invalid last name";
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
    if (format !== "png" && format !== "jpg" && format !== "jpeg"){
        message = message + "/Wrong type of file.";
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

app.get("/forgot_pwd", function (req, res) {
    res.render("forgotPwd");
});

app.get("/change_pwd", function (req, res) {
    res.render("changePwd");
});

app.post("/forgot_pwd", function (req, res) {
    if(validator.isAlphanumeric(req.body.username) === true) {
        users.getSingleUserByUsername(req.body.username, function (err, user) {
            if (!user) {
                req.flash("error", "Error:");
                req.flash("info", "This username doesn't exist");
                res.redirect("/forgot_pwd");
            }
            else {
                var token = randomstring.generate(8);
                users.updateToken(user.local.username, token);
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
                    from: '"Admin" <pepey33@hotmail.fr>',
                    to: user.email,
                    subject: 'Reset Password',
                    text: '',
                    html: '<p>Hi ' + user.firstName + ' ' + user.lastName + ' ! You asked for a reset of your password. Click on the link below ' +
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
                req.flash("success", "An email has been send.");
                res.redirect("/");
            }
        })
    }
    else{
        req.flash("error", "Error:");
        req.flash("info", "This username doesn't exist");
        res.redirect("/forgot_pwd");
    }
});

app.post("/change_pwd", function (req, res) {
    users.getSingleUserByUsername(req.body.username, function (err, user) {
        if (user){
            if (req.body.new_password.match(/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/) !== null) {
                if (req.body.new_password === req.body.confirm_password) {
                    if (req.body.code === user.token) {
                        users.updatePassword(user.local.username, req.body.new_password);
                        users.updateToken(user.local.username, "");
                        req.flash("success", "Your password has been changed. You can now sign in.");
                        res.redirect("/");
                    }
                    else{
                        req.flash("error", "Error:");
                        req.flash("info", "Invalid code");
                        res.redirect("/change_pwd");
                    }
                }
                else{
                    req.flash("error", "Error:");
                    req.flash("info", "New password and confirm password are not the same.");
                    res.redirect("/change_pwd");
                }
            }
            else{
                req.flash("error", "Error:");
                req.flash("info", "Invalid new password. Must contain between 8 and 18 characters. You also can only use the following special characters [?@.*;:!_-]");
                res.redirect("/change_pwd");
            }
        }
        else{
            req.flash("error", "Error:");
            req.flash("info", "Invalid username");
            res.redirect("/change_pwd");
        }
    });
});

app.get("/error", function (req, res) {
    req.flash("error", "Error: Wrong username or password.");
    res.redirect("/");
});

app.get("/init", function (req, res) {
    req.session.moviesWatched = req.user.moviesWatched;
    req.session.pagination = {
        movies: [],
        genres: [],
        currentPage: 1,
        totalPages: 0,
        category: "home",
        index: 0,
        moreInfo: ""
    };
    res.redirect("/library");
});

function  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be login to do that");
    res.redirect("/");
}


module.exports = app;
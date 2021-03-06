var User        = require("./collections/user"),
    passport    = require("passport"),
    local       = require("./passports/local"),
    facebook    = require("./passports/facebook"),
    google      = require("./passports/google"),
    fortytwo    = require("./passports/42");

module.exports = function () {

    passport.serializeUser(function (user, callback) {
        callback(null, user._id);
    });

    passport.deserializeUser(function (id, callback) {
        User.findOne({_id: id}, function (err, user) {
            if (err)
                return callback(err);
            else
                return callback(null, user);
        })
    });

    passport.use(local);
    passport.use(facebook);
    passport.use(google);
    passport.use(fortytwo);
};
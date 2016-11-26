var LocalStrategy   = require("passport-local"),
    User            = require("../collections/user"),
    hash            = require("nodejs-hash-performance");

module.exports = new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
    }, function (username, password, done) {
        User.findOne({"local.username": username}, function (err, user) {
            if (!err) {
                if (user) {
                    if (user.local.password === hash(password, "whirlpool", "base64"))
                        return done(null, user);
                    else
                        return done(null, false);
                }
                else
                    return done(null, false);
            }
        })
});
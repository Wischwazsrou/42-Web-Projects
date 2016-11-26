var FortyTwoStrategy    = require("passport-42"),
    User                = require("../collections/user"),
    users               = require("../models/users_model");

module.exports = new FortyTwoStrategy({
    clientID: "a3f1260cbd5ca06e50f3aa214fdb26c378aee62f7a2b89490c77f5a23d53437e",
    clientSecret: "81c18ae5874f8eadc0e47aea20764d4cfbb6f583e307c498fe8469cd9e789443",
    callbackURL: "http://localhost:3000/auth42/callback"
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({'42.id': profile.id}, function (err, user) {
        if (err)
            return done(err);
        if (user) {
            return done(null, user);
        }
        else {
            User.findOne({email: profile.emails[0].value}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    users.updateUserWith42(user._id, profile, accessToken);
                    return done(null, user);
                }
                else{
                    users.addUserWith42(profile, accessToken, function (err, user) {
                        if (!err)
                            return done(null, user);
                    });
                }
            })
        }
    })
});
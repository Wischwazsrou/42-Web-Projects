var GoogleStrategy      = require("passport-google-oauth20"),
    User                = require("../collections/user"),
    users               = require("../models/users_model"),
    passport            = require("passport");

module.exports = new GoogleStrategy({
    clientID: "798522901805-4okjam510mvsu409a74gpiiuft9qmq2m.apps.googleusercontent.com",
    clientSecret: "nckbmPhivgNSaQEOkmvPUKFq",
    callbackURL: "http://localhost:3000/authGoogle/callback"
    }, function (token, refreshToken, profile, done) {
        User.findOne({'google.id': profile.id}, function (err, user) {
            if (err)
                return done(err);
            if (user)
                return done(null, user);
            else{
                User.findOne({email: profile.emails[0].value}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        users.updateUserWithGoogle(user._id, profile, token);
                        return done(null, user);
                    }
                    else {
                        users.addUserWithGoogle(profile, token, function (err, user) {
                            if (err)
                                console.log(err);
                            else
                                return done(null, user);
                        })
                    }
                })
            }
        })
    }
);
var FacebookStrategy    = require("passport-facebook"),
    User                = require("../collections/user"),
    users               = require("../models/users_model");

module.exports = new FacebookStrategy({
    clientID: "1832946213646922",
    clientSecret: "4bc2d0626ced9b11090c82403ef80929",
    callbackURL: "http://localhost:3000/authFacebook/callback",
    profileFields: ['id', 'emails', 'name']
    }, function (token, refreshToken, profile, done) {
        User.findOne({'facebook.id': profile.id}, function (err, user) {
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
                        users.updateUserWithfb(user._id, profile, token);
                        return done(null, user);
                    }
                    else{
                        users.addUserWithFb(profile, token, function (err, user) {
                            if (!err)
                                return done(null, user);
                        });
                    }
                })
            }
        })
});
var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("../collections/user");

module.exports = {
    addUser: function (req) {
        User.create({
            username: req.body.username,
            password: hash(req.body.password, "whirlpool", "base64"),
            email: req.body.email
        }, function (err) {
            if (err)
                console.log(err);
        })
    },
    getSingleUserByUsername: function (username, callback) {
        User.findOne({username: username}, function (err, user) {
            if (!err)
                callback(null, user);
        })
    },
    getSingleUserByEmail: function (email, callback) {
        User.findOne({email: email}, function (err, user) {
            if (!err)
                callback(null, user);
        })
    },
    getSingleUserById: function (id, callback) {
        User.findOne({_id: id}, function (err, user) {
            if (!err)
                callback(null, user);
        })
    },
    updateEmail: function (username, email) {
        User.findOneAndUpdate({username: username}, {$set:{email: email}}, function (err) {
                if (err)
                    console.log(err);
            })
    },
    updatePassword: function (username, password) {
        User.findOneAndUpdate({username: username}, {$set:{password: hash(password, "whirlpool", "base64")}}, function (err) {
                if (err)
                    console.log(err);
        })
    },
    updateAbout: function (username, about) {
        User.findOneAndUpdate({username: username}, {$set:{about: about}}, function (err) {
            if (err)
                console.log(err);
        })
    }
};
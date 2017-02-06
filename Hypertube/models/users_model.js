var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("../collections/user");

module.exports = {
    addUser: function (req) {
        User.create({
            local : {
                username    : req.body.username,
                password    : hash(req.body.password, "whirlpool", "base64")
            },
            firstName   : req.body.first_name,
            lastName    : req.body.last_name,
            email       : req.body.email,
            picture     : "/img/" + req.file.filename
        }, function (err) {
            if (err)
                console.log(err);
        })
    },
    addUserWithFb: function (profile, token, callback) {
        User.create({
            facebook:{
                id      : profile.id,
                token   : token
            },
            firstName   : profile.name.familyName,
            lastName    : profile.name.givenName,
            email       : profile.emails[0].value,
            picture     : "/img/empty_user.png"
        }, function (err, user) {
            if (err)
                console.log(err);
            else
                callback(null, user);
        })
    },
    addUserWithGoogle: function (profile, token, callback) {
        User.create({
            google:{
                id      : profile.id,
                token   : token
            },
            firstName   : profile.name.familyName,
            lastName    : profile.name.givenName,
            email       : profile.emails[0].value,
            picture     : "/img/empty_user.png"
        }, function (err, user) {
            if (err)
                console.log(err);
            else
                callback(null, user);
        })
    },
    addUserWith42: function (profile, token, callback) {
        User.create({
            42:{
                id      : profile.id,
                token   : token
            },
            firstName   : profile.name.givenName,
            lastName    : profile.displayName.split(" ")[2],
            email       : profile.emails[0].value,
            picture     : "/img/empty_user.png"
        }, function (err, user) {
            if (err)
                console.log(err);
            else
                callback(null, user);
        })
    },
    getAlluser: function (callback) {
        User.find({}, function (err, users) {
            if (!err)
                callback(null, users)
        })
    },
    getSingleUserByUsername: function (username, callback) {
        User.findOne({"local.username": username}, function (err, user) {
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
        User.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, user) {
            if (!err)
                callback(null, user);
        })
    },
    updateEmail: function (id, email) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set:{email: email}}, function (err) {
                if (err)
                    console.log(err);
        })
    },
    updatePassword: function (username, password) {
        User.findOneAndUpdate({"local.username": username}, {$set:{"local.password": hash(password, "whirlpool", "base64")}}, function (err) {
                if (err)
                    console.log(err);
        })
    },
    updateAbout: function (id, about) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set:{about: about}}, function (err) {
            if (err)
                console.log(err);
        })
    },
    updatePic: function(id, picture){
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set:{picture: picture}}, function (err) {
            if (err)
                console.log(err);
        })
    },
    updateToken: function (username, token) {
        User.findOneAndUpdate({"local.username": username}, {$set:{"local.token": token}}, function (err) {
            if (err)
                console.log(err);
        })
    },
    updateName: function (id, firstName, lastName) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {
                $set:{
                    firstName: firstName,
                    lastName: lastName
                }
            },  function (err) {
                    if (err)
                        console.log(err);
            })
    },
    updateUserWithfb: function (id, profile, token) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {
                $set:{
                    facebook:{
                        id      : profile.id,
                        token   : token
                    }
                }
            },  function (err) {
                    if (err)
                        console.log(err);
            })
    },
    updateUserWithGoogle: function (id, profile, token) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {
                $set:{
                    google:{
                        id      : profile.id,
                        token   : token
                    }
                }
            },  function (err) {
                    if (err)
                        console.log(err);
            })
    },
    updateUserWith42: function (id, profile, token) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {
                $set:{
                    google:{
                        id      : profile.id,
                        token   : token
                    }
                }
            },  function (err) {
                    if (err)
                        console.log(err);
            })
    },
    updateMovieWatched: function (id, moviesWatched) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {
                $set: {
                    moviesWatched: moviesWatched
                }
            },  function (err) {
                    if (err)
                        console.log(err);
            })
    },
    updateFavoriteMovies: function (id, favortieMovies) {
        User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {
                $set: {
                    favoriteMovies: favoriteMovies
                }
            },  function (err) {
                    if (err)
                        console.log(err);
            })
    }
};
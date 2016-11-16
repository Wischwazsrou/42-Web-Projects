var mongoDb = require ("mongodb");

var pictures;

module.exports = {
    getMatchUsers: function (db, req, res, callback) {
        if (req.user.orientation === 2) {
            db.collection("users").find({
                _id: {$ne: mongoDb.ObjectId(req.user._id)},
                $or: [{gender: req.user.gender, orientation: 1}, {orientation: req.user.orientation},
                    {gender: req.user.gender * -1, orientation: -1}]
            }).toArray(function (err, foundUsers) {
                if (!err)
                    callback(null, foundUsers);
            });
        }
        else{
            db.collection("users").find({_id: {$ne: mongoDb.ObjectId(req.user._id)},
                gender: req.user.gender * req.user.orientation,
                $or: [{orientation: req.user.orientation}, {orientation: 2}]
            }).toArray(function (err, foundUsers) {
                if (!err)
                    callback(null, foundUsers);
            });
        }
    },
    getSingleUser: function (db, id, callback) {
        db.collection("users").findOne({_id: mongoDb.ObjectId(id)},
            (function (err, foundUser) {
                if (!err)
                    callback(null, foundUser);
            })
        );
    },
    getSingleUserByUsername: function (db, username, callback) {
        db.collection("users").findOne({username: username},
            (function (err, foundUser) {
                if (!err)
                    callback(null, foundUser);
            })
        );
    },
    getSingleUserByEmail: function (db, email, callback) {
        db.collection("users").findOne({email: email},
            (function (err, foundUser) {
                if (!err)
                    callback(null, foundUser);
            })
        );
    },
    getAllUsers: function (db, callback) {
        db.collection("users").find().toArray(function (err, foundUsers) {
            if (!err) {
                callback(null, foundUsers);
            }
        });
    },
    getAllLikes: function (db, callback) {
        db.collection("likes").find().toArray(function (err, foundLikes) {
            if (!err)
                callback(null, foundLikes);
        });
    },
    getAllPictures: function (db, callback) {
        db.collection("pictures").find().toArray(function (err, foundPictures) {
            if (!err) {
                callback(null, foundPictures);
            }
        });
    },
    getUserPictures: function (db, author, callback) {
        db.collection("pictures").find({author: author}).toArray(function (err, foundPictures) {
            if (!err)
                callback(null, foundPictures);
        });
    },
    getLiker: function (db, id, callback) {
        db.collection("likes").find({likerUser: id.toString()}).toArray(function (err, foundLikes) {
            if (!err)
                callback(null, foundLikes)
        });
    },
    getLiked: function (db, id, callback) {
        db.collection("likes").find({likedUser: id.toString()}).toArray(function (err, foundLikes) {
            if (!err)
                callback(null, foundLikes)
        });
    },
    getMessages: function (db, firstId, secondId, callback) {
        db.collection("messages").find(
            {
                $or:[
                    {receiver: firstId.toString(), sender: secondId.toString()},
                    {receiver: secondId.toString(), sender: firstId.toString()}
                ]
            }).toArray(function (err, foundMessages) {
            if (!err)
                callback(null, foundMessages);
        })
    },
    getUserAllMessages: function (db, id, callback) {
        db.collection("messages").find(
            {
                $or:[
                    {receiver: id.toString()},
                    {sender: id.toString()}
                ]
        }).sort({date: -1}).toArray(function (err, foundMessages) {
            if (!err)
                callback(null, foundMessages);
        })

    }
};
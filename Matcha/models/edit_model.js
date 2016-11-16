var mongoDb = require("mongodb");

module.exports = {
    edit_info: function (db, req, currentUser) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(currentUser._id)},
            {
                $set: {
                    firstName : req.body.first_name,
                    lastName : req.body.last_name,
                    birthDate : req.body.birth_date,
                    gender : parseInt(req.body.gender),
                    orientation : parseInt(req.body.orientation),
                    email : req.body.email,
                    location: req.body.location,
                    city: req.body.city
                }
            },
            function (err) {
                if (err)
                    console.log("ERROR");
        });
    },
    edit_pwd: function (db, pwd, currentUser) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(currentUser._id)},
            {
                $set : {
                    password : pwd
                }
            },
            function (err){
                if (err)
                    console.log("ERROR");
            });
    },
    edit_tags: function (db, currentUser) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(currentUser._id)},
            {
                $set: {
                    tags : currentUser.tags
                }
            },
            function (err){
                if (err)
                    console.log("ERROR");
            });
    },
    edit_pics: function (db, req) {
        db.collection("pictures").insertOne({
            link : "/img/upload/" + req.file.filename,
            author : req.user.username,
            status : 0
        }, function (err) {
            if (err)
                console.log("ERROR");
        })
    },
    edit_description: function (db, description, currentUser) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(currentUser._id)},
            {
                $set:{
                    description: description
                }
            }, function (err) {
                if (err)
                    console.log("ERROR");
            })
    },
    profile_pic: function (db, req) {
        db.collection("pictures").findOneAndUpdate({author: req.user._id.toString(), status: 1},
            {
                $set: {
                    status : 0
                }
            },
            function (err) {
                if (!err) {
                    db.collection("pictures").findOneAndUpdate({_id: mongoDb.ObjectId(req.body.new_profile_pic)},
                        {
                            $set: {
                                status : 1
                            }
                        },
                        function (err){
                            if (err)
                                console.log("ERROR");
                    });
                }
        });
    },
    remove_pic: function (db, pic) {
        db.collection("pictures").findOneAndDelete({_id: mongoDb.ObjectId(pic.deleted_pic)},
        function (err) {
           if (err)
               console.log("ERROR");
        });
    },
    new_message: function (db, receiverId, senderId, message) {
        db.collection("messages").insertOne({
            receiver: receiverId.toString(),
            sender: senderId.toString(),
            message: message,
            state: 1,
            date: new Date
        }, function (err) {
            if (err)
                console.log("ERROR");
        })
    },
    edit_message: function (db, id) {
        db.collection("messages").findOneAndUpdate({_id: mongoDb.ObjectId(id)},
            {
                $set:{
                    state: 0
                }
            }, function (err) {
                if (err)
                    console.log("ERROR");
            });
    },
    edit_popularity: function (db, id, value) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(id)},
            {
                $inc:{
                    popularity: value
                }
            }, function (err) {
                if (err)
                    console.log("ERROR");
            });
    },
    edit_token: function(db, username, token){
        db.collection("users").findOneAndUpdate({username: username},
            {
                $set:{
                    token: token
                }
            }, function (err) {
                if (err)
                    console.log("ERROR");
            })
    },
    edit_geolocate: function (db, username, permission) {
        db.collection("users").findOneAndUpdate({username: username},
            {
                $set:{
                    permission: permission
                }
            }, function (err) {
                if (err)
                    console.log("ERROR");
            })
    }
};
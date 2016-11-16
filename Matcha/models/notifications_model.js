var mongoDb = require("mongodb");

module.exports = {
    new_notification: function (db, req, username, message) {
        db.collection("notifications").insertOne({
            receiver: username,
            sender: req.user.username,
            message: message,
            state: 2,
            date: new Date()
        })
    },
    getNotifications: function (db, username, callback) {
        db.collection("notifications").find({receiver: username}).sort({date: -1}).toArray(function (err, foundNotification) {
            if (!err)
                callback(null, foundNotification);
        })
    },
    editNotifications: function (db, id) {
        db.collection("notifications").findOneAndUpdate({_id: mongoDb.ObjectId(id)},
            {
                $set: {
                    state: 1
                }
            }, function (err) {
                if (err)
                    console.log(err)
            });
    }
};
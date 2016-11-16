var mongoDb = require("mongodb");

module.exports = {
    block_user: function (db, currentUser) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(currentUser._id)},
            {
                $set: {
                    userBlocked : currentUser.userBlocked
                }
            }, function (err) {
                if (err)
                    console.log("ERROR");
        });
    }
};
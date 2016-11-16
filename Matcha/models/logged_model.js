var mongoDb = require("mongodb");

module.exports = {
    signin: function (db, req) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(req.user._id)},
            {
                $set: {
                    logged: true
                }
            },
            function (err) {
                if (err)
                    console.log("ERROR");
            }
        );
    },
    signout: function (db, req) {
        db.collection("users").findOneAndUpdate({_id: mongoDb.ObjectId(req.user._id)},
            {
                $set: {
                    logged: false,
                    lastConnect: new Date()
                }
            },
            function (err) {
                if (err)
                    console.log("ERROR");
            }
        );
    }
};
var MongoClient = require("mongodb").MongoClient,
    configDB    = require("./config");

var url = "mongodb://localhost:27017/matcha",
    _db;

module.exports = {
    connectionToServer: function () {
        MongoClient.connect(url, function (err, db) {
            if (err)
                console.log("Error connecting Mongo.");
            else {
                console.log("Connected to Mongo");
                //  configDB(db);
                _db = db;
            }
        });
    },
    getDb: function () {
        return _db;
    }
};
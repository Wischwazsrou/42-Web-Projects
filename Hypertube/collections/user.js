var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    local: {
        username    : String,
        password    : String,
        token       : String
    },
    facebook: {
        id          : String,
        token       : String
    },
    google: {
        id          : String,
        token       : String
    },
    42: {
        id          : String,
        token       : String
    },
    firstName       : String,
    lastName        : String,
    email           : String,
    about           : String,
    picture         : String,
    favoriteMovies  : Array,
    registerDate    : Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    facebook: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },
    google: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },
    username        : String,
    password        : String,
    firstName       : String,
    lastName        : String,
    email           : String,
    about           : String,
    picture         : String,
    favoriteMovies  : Array,
    registerDate    : Date,
    token           : String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    about: String,
    picture: String,
    favoriteMovies: Array,
    registerDate: Date,
    token: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
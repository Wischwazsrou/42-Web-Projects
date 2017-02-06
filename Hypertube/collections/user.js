var mongoose                = require("mongoose");

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
    moviesWatched   : Array,
    registerDate    : Date
});

module.exports = mongoose.model("User", UserSchema);
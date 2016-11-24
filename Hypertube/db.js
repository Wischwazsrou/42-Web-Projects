var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("./collections/user");

var users = [
    {
        username: "admin",
        password: hash("root", "whirlpool", "base64"),
        email: "docjr0605@hotmail.com",
        about: "What is love ?!",
        favoriteMovies: ["Inception", "Django Unchained"],
        registerDate: new Date
    }
];

module.exports = {
    configDb : function()
    {
        User.remove({}, function (err) {
            if (err)
                console.log(err);
            console.log("Users removed.");
            users.forEach(function (data) {
                User.create(data, function (err, user) {
                    if (err)
                        console.log(err);
                    else
                        console.log("New user added");
                })
            })
        })
    }
}
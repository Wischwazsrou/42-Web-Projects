var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("./collections/user"),
    Movie       = require("./collections/movie");

module.exports = {
    configDb : function()
    {
        User.remove({}, function (err) {
            if (err)
                console.log(err);
            console.log("Users removed.");
            User.create({
                local: {
                    username: "pbeesly",
                    password: hash("Beesly123*", "whirlpool", "base64"),
                    token: ""
                },
                firstName: "Pam",
                lastName: "Beesly",
                email: "docjr0605@hotmail.com",
                about: "What is love ?!",
                picture: "/img/Pam.jpg",
                favoriteMovies: [],
                moviesWatched: [],
                registerDate: new Date
                }, function (err, user) {
                    if (err)
                        console.log(err);
                    else
                        console.log("New user added");
            });
            // Movie.create({
            //     name: "Insurgent",
            //     tmdbId: 262500,
            //     video: "Insurgent_262500.mp4",
            //     comments:[]
            // })
        })
    }

};
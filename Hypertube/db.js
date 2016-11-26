var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("./collections/user");

var users = [
    {
        local: {
            username: "pbeesly",
            email: "docjr0605@hotmail.com",
            token: ""
        },
        firstName: "Pam",
        lastName: "Beesly",
        password: hash("Beesly123*", "whirlpool", "base64"),

        about: "What is love ?!",
        picture: "/img/Pam.jpg",
        favoriteMovies: ["Inception", "Django Unchained"],
        registerDate: new Date
    },
    {
        local: {
            username: "jhalpert",
            email: "jim@hotmail.com",
            token: ""
        },
        firstName: "Jim",
        lastName: "Halpert",
        password: hash("Halpert123*", "whirlpool", "base64"),
        about: "Baby don'thurt me...",
        picture: "/img/Jim.jpg",
        favoriteMovies: ["Interstellar", "Deadpool"],
        registerDate: new Date
    },
    {
        local: {
            username: "dschrute",
            email: "dwight@hotmail.com",
            token: ""
        },
        firstName: "Dwight",
        lastName: "Schrute",
        password: hash("Dwight123*", "whirlpool", "base64"),
        about: "NO MORE !",
        picture: "/img/Dwight.jpg",
        favoriteMovies: ["Hooligans"],
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
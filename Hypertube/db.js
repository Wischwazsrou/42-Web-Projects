var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("./collections/user");

var users = [
    {
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
        favoriteMovies: ["Inception", "Django Unchained"],
        registerDate: new Date
    },
    {
        local: {
            username: "jhalpert",
            password: hash("Halpert123*", "whirlpool", "base64"),
            token: ""
        },
        firstName: "Jim",
        lastName: "Halpert",
        email: "jim@hotmail.com",
        about: "Baby don'thurt me...",
        picture: "/img/Jim.jpg",
        favoriteMovies: ["Interstellar", "Deadpool"],
        registerDate: new Date
    },
    {
        local: {
            username: "dschrute",
            password: hash("Dwight123*", "whirlpool", "base64"),
            token: ""
        },
        firstName: "Dwight",
        lastName: "Schrute",
        email: "dwight@hotmail.com",
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
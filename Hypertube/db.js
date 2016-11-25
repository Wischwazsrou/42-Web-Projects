var mongoose    = require("mongoose"),
    hash        = require('nodejs-hash-performance'),
    User        = require("./collections/user");

var users = [
    {
        username: "pbeesly",
        firstName: "Pam",
        lastName: "Beesly",
        password: hash("Beesly123*", "whirlpool", "base64"),
        email: "docjr0605@hotmail.com",
        about: "What is love ?!",
        picture: "/img/Pam.jpg",
        favoriteMovies: ["Inception", "Django Unchained"],
        registerDate: new Date,
        token: ""
    },
    {
        username: "jhalpert",
        firstName: "Jim",
        lastName: "Halpert",
        password: hash("Halpert123*", "whirlpool", "base64"),
        email: "jim@hotmail.com",
        about: "Baby don'thurt me...",
        picture: "/img/Jim.jpg",
        favoriteMovies: ["Interstellar", "Deadpool"],
        registerDate: new Date,
        token: ""

    },
    {
        username: "dschrute",
        firstName: "Dwight",
        lastName: "Schrute",
        password: hash("Dwight123*", "whirlpool", "base64"),
        email: "dwight@hotmail.com",
        about: "NO MORE !",
        picture: "/img/Dwight.jpg",
        favoriteMovies: ["Hooligans"],
        registerDate: new Date,
        token: ""
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
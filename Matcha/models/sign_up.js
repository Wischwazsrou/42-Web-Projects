var hash = require('nodejs-hash-performance');

module.exports = {
    add_user: function (db, req, location, city) {
        db.collection("users").insertOne({
            username: req.body.username,
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            birthDate: req.body.birth_date,
            gender: parseInt(req.body.gender),
            orientation: parseInt(req.body.orientation),
            email: req.body.email,
            password: hash(req.body.password, "whirlpool", "base64"),
            tags: [],
            userBlocked: [],
            location: location,
            city: city,
            popularity: 0
        }, function (err) {
            if (err)
                console.log("ERROR");
        });
    }
};

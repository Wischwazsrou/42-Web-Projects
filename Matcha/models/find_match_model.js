var googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyAMCrKl1Jn1z6vCZz-SymgBVkfPp_rsLx8"
});

function compareNbr(a, b) {
    return a.score - b.score;
}

function sortByAge (req, users, match, callback) {
    match.forEach(function (matchUser) {
        users.forEach(function (user) {
            if (user._id.toString() == matchUser.user){
                matchUser.score = Math.abs(new Date(user.birthDate).getFullYear() - new Date(req.user.birthDate).getFullYear());
            }
        });
    });
    match.sort(compareNbr);
    callback(null, match);
}

function sortByLocation (req, users, match, callback){
    var destinations = "",
        i = 0;
    users.forEach(function (user) {
        destinations = destinations + "|" + user.location;
    });
    googleMapsClient.distanceMatrix({
        origins:[
            req.user.location
        ],
        destinations: [
            destinations
        ]
    },  function (err, response) {
        if (!err){
            response.json.rows[0].elements.forEach(function (item) {
                match[i].score = (parseInt(item.distance.text));
                i++;
            });
            match.sort(compareNbr);
            callback(null, match);
        }
    });
}

function sortByTags(req, users, match, callback) {
    match.forEach(function (matchUser) {
        users.forEach(function (user) {
            if (user._id.toString() == matchUser.user) {
                req.user.tags.forEach(function (tag) {
                    var index = user.tags.indexOf(tag);
                    if (index > -1)
                        matchUser.score += 1;
                })
            }
        })
    });
    match.sort(compareNbr);
    match.reverse();
    callback(null, match);
}

function sortByPopularity (users, match, callback) {
    match.forEach(function (matchUser) {
        users.forEach(function (user) {
            if (user._id.toString() == matchUser.user){
                matchUser.score = user.popularity;
            }
        });
    });
    match.sort(compareNbr);
    match.reverse();
    callback(null, match);
}

function scoreByLocation (req, users, match, callback){
    var destinations = "",
        i = 0;
    users.forEach(function (user) {
        destinations = destinations + "|" + user.location;
    });
    googleMapsClient.distanceMatrix({
        origins:[
            req.user.location
        ],
        destinations: [
            destinations
        ]
    },  function (err, response) {
        if (!err){
            response.json.rows[0].elements.forEach(function (item) {
                var distance = parseInt(item.distance.text);
                if (distance < 1)
                    match[i].score = 40;
                else
                    match[i].score = 40 / distance;

                i++;
            });
            match.sort(compareNbr);
            match.reverse();

        }
        callback(null, match);
    });
}

function scoreByTags(req, users, match, callback) {
    match.forEach(function (matchUser) {
        users.forEach(function (user) {
            if (user._id.toString() == matchUser.user){
                req.user.tags.forEach(function (tag) {
                    var index = user.tags.indexOf(tag);
                    if (index > -1)
                        matchUser.score += 2;
                })
            }
        })
    });
    match.sort(compareNbr);
    match.reverse();
    callback(null, match);
}

function scoreByPopularity(users, match, callback) {
    match.forEach(function (matchUser) {
        users.forEach(function (user) {
            if (user._id.toString() == matchUser.user) {
                matchUser.score += user.popularity;
            }
        });
    });
    match.sort(compareNbr);
    match.reverse();
    callback(null, match);
}

function filterByAge(req, users, match, callback) {
    var userAge = 0;

    for (var i = 0; i < match.length; i++) {
        users.forEach(function (user) {
            if (match[i] && user._id.toString() == match[i].user) {
                userAge = Math.abs(new Date().getFullYear() - new Date(user.birthDate).getFullYear());
                if (userAge > req.session.intervalAgeMax || userAge < req.session.intervalAgeMin) {
                    match.splice(i, 1);
                    i = 0;
                }
            }
        });
    }
    callback(null, match);
}
function filterByPopularity(req, users, match, callback) {
    for (var i = 0; i < match.length; i++) {
        users.forEach(function (user) {
            if (match[i] && user._id.toString() == match[i].user) {
                if (user.popularity > req.session.intervalPopMax || user.popularity < req.session.intervalPopMin) {
                    match.splice(i, 1);
                    i = 0;
                }
            }
        });
    }
    callback(null, match);
}
function filterByLocation(req, users, match, callback) {
    for (var i = 0; i < match.length; i++) {
        users.forEach(function (user) {
            if (match[i] && user._id.toString() == match[i].user) {
                if (user.city !== req.session.city) {
                    match.splice(i, 1);
                    i = 0;
                }
            }
        });
    }
    callback(null, match);
}
function filterByTags(req, users, match, callback) {
    for (var i = 0; i < match.length; i++) {
        users.forEach(function (user) {
            if (match[i] && user._id.toString() == match[i].user) {
                req.session.tags_array.forEach(function (tag) {
                    var index = user.tags.indexOf(tag);
                    if (index <= -1) {
                        match.splice(i, 1);
                    }
                });
                i = 0;
            }
        });
    }
    callback(null, match);
}

module.exports = {
    init_match: function (req, users, match, user_score, callback) {
        users.forEach(function (user) {
            user_score = {
                user: user._id.toString(),
                score: 0
            };
            match.push(user_score);
        });
        callback(null, match);
    },
    classic_sort: function (req, users, match, callback) {
        scoreByLocation(req, users, match, function (err, sortLocation) {
            if (!err) {
                match = sortLocation;
                scoreByTags(req, users, match, function (err, sortTags) {
                    if (!err) {
                        match = sortTags;
                        scoreByPopularity(users, match, function (err, sortPopularity) {
                            if (!err) {
                                match = sortPopularity;
                                callback (null, match);
                            }
                        });
                    }
                });
            }
        });
    },
    sort_by_standards: function (req, users, match, callback) {
        if (req.session.intervalAgeMin != 0 || req.session.intervalAgeMax != 99){
            filterByAge(req, users, match, function (err, filteredAge) {
                if (!err)
                    match = filteredAge;
            })
        }
        if (req.session.intervalPopMin != 0 || req.session.intervalPopMax != 1000){
            filterByPopularity(req, users, match, function (err, filteredPop) {
                if (!err)
                    match = filteredPop;
            })
        }
        if (req.session.city){
            filterByLocation(req, users, match, function (err, filteredCity) {
                if (!err)
                    match = filteredCity;
            })
        }
        if (req.session.tags){
            req.session.tags_array = req.session.tags.split("/");
            filterByTags(req, users, match, function (err, filteredTags) {
                if (!err) {
                    match = filteredTags;
                }
            })
        }
        if (req.session.sortBy != "None") {
            if (req.session.sortBy === "Age") {
                sortByAge(req, users, match, function (err, sortAge) {
                    if (!err)
                        match = sortAge;
                })
            }
            else if (req.session.sortBy === "Location") {
                sortByLocation(req, users, match, function (err, sortLocation) {
                    if (!err) {
                        match = sortLocation;
                        callback(null, match);
                    }
                })
            }
            else if (req.session.sortBy === "Tags") {
                sortByTags(req, users, match, function (err, sortTags) {
                    if (!err)
                        match = sortTags;
                })
            }
            else if (req.session.sortBy === "Popularity") {
                sortByPopularity(users, match, function (err, sortPopularity) {
                    if (!err)
                        match = sortPopularity;
                })
            }
        }
        if (req.session.sortBy !== "Location")
            callback(null, match);
    }
};
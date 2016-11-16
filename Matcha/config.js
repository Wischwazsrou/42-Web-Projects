var hash = require('nodejs-hash-performance');

function configDB(db) {
    db.collection("users").drop();
    db.collection("pictures").drop();
    db.collection("likes").drop();
    db.collection("notifications").drop();
    db.collection("messages").drop();
    db.createCollection("users", {
        username: String,
        firstName: String,
        lastName: String,
        birthDate: Date,
        gender: Number,
        orientation: String,
        email: String,
        password: String,
        tags: [],
        description: String,
        logged: Boolean,
        lastConnect: String,
        userBlocked: [],
        location: String,
        city: String,
        permission: String,
        popularity: Number,
        token: String
    });
    db.createCollection("pictures", {
        link: String,
        author: String,
        status: Number
    });
    db.createCollection("likes", {
        likedUser: String,
        likerUser: String
    });
    db.createCollection("notifications",{
        receiver: String,
        sender: String,
        message: String,
        status: Number,
        date: Date
    });
    db.createCollection("messages",{
        receiver: String,
        sender: String,
        messages: String,
        state: Number,
        date: Date
    });
    db.collection("users").insertMany([
        {
            username: "jhalpert",
            firstName: "Jim",
            lastName: "Halpert",
            birthDate: "1986-01-17",
            gender: 1,
            orientation: -1,
            email: "jimhalpert@outlook.com",
            password: hash("Halpert123*", "whirlpool", "base64"),
            tags: ["Basketball", "Jokes", "Sport"],
            userBlocked: [],
            description:
                "Everything I have I owe to this job...this stupid, wonderful, boring, amazing job.",
            location: "Paris",
            city: "Paris",
            popularity: 16,
            permission: "true"
        },
        {
            username: "pbeesly",
            firstName: "Pam",
            lastName: "Beesly",
            birthDate: "1988-04-24",
            gender: -1,
            orientation: -1,
            email: "pambeesly@outlook.com",
            password: hash("Beesly123*", "whirlpool", "base64"),
            tags: ["Drawing", "Working", "Farming", "Jokes"],
            userBlocked: [],
            description:
                "I think an ordinary paper company like Dunder-Mifflin was a great subject for a documentary. There's a lot of beauty in ordinary things. Isn't that kind of the point?",
            location: "Paris",
            city: "Paris",
            popularity: 21,
            permission: "true"
        },
        {
            username: "mscott",
            firstName: "Michael",
            lastName: "Scott",
            birthDate: "1964-07-06",
            gender: 1,
            orientation: -1,
            email: "michaelscott@outlook.com",
            password: hash("Scott123*", "whirlpool", "base64"),
            tags: ["Doing shit", "Not working"],
            userBlocked: [],
            description:
                "You don't call retarded people retards, It's bad taste. " +
                "You call your friend retards, when they are acting retarded.",
            location: "Lille",
            city: "Lille",
            popularity: 13,
            permission: "true"
        },
        {
            username: "dschrute",
            firstName: "Dwight",
            lastName: "Schrute",
            birthDate: "1979-06-18",
            gender: 1,
            orientation: -1,
            email: "dwightschrute@outlook.com",
            password: hash("Schrute123*", "whirlpool", "base64"),
            tags: ["Working", "Farming", "Video Games"],
            userBlocked: [],
            description:
                "As a volunteer Sheriff’s Deputy I’ve been doing surveillance for years. " +
                "One time I suspected an ex-girlfriend of mine of cheating on me, so I tailed her for six nights straight. Turns out… she was. " +
                "With a couple of guys actually, so… mystery solved.",
            location: "Saint Ouen",
            city: "Saint Ouen",
            popularity: 9,
            permission: "true"
        },
        {
            username: "amartin",
            firstName: "Angela",
            lastName: "Martin",
            birthDate: "1979-03-12",
            gender: -1,
            orientation: 2,
            email: "angelamartin@outlook.com",
            password: hash("Martin123*", "whirlpool", "base64"),
            tags: ["Cat"],
            userBlocked: [],
            description:
                "I have a nice comforter and several cozy pillows. I usually read a chapter of a book, and it’s lights out by 8:30. That’s how I sleep at night!",
            location: "Courbevoie",
            city: "Courbevoie",
            popularity: 12,
            permission: "true"
        },
        {
            username: "omartinez",
            firstName: "Oscar",
            lastName: "Martinez",
            birthDate: "1978-02-13",
            gender: 1,
            orientation: 1,
            email: "oscarmartinez@outlook.com",
            password: hash("Martinez123*", "whirlpool", "base64"),
            tags: ["Tacos", "Burritos"],
            userBlocked: [],
            description:
                "The Dunder Mifflin stock symbol is DMI. Do you know what that stands for? Dummies, morons, and idiots. Because that's what you'd have to be to own it. And as one of those idiots, I believe the board owes me answers.",
            location: "Neuilly-sur-Seine",
            city: "Neuilly-sur-Seine",
            popularity: 17,
            permission: "true"
        },
        {
            username: "abernard",
            firstName: "Andy",
            lastName: "Bernard",
            birthDate: "1982-11-30",
            gender: 1,
            orientation: 2,
            email: "andybernard@outlook.com",
            password: hash("Bernard123*", "whirlpool", "base64"),
            tags: ["Cornel", "Singing"],
            userBlocked: [],
            description:
                "I wish there was a way to know you're in the good old days before you've actually left them.",
            location: "Aubervilliers",
            city: "Aubervilliers",
            popularity: 20,
            permission: "true"
        },
        {
            username: "kkapoor",
            firstName: "Kelly",
            lastName: "Kapoor",
            birthDate: "1988-09-06",
            gender: -1,
            orientation: -1,
            email: "kellykapoor@outlook.com",
            password: hash("Kapoor123*", "whirlpool", "base64"),
            tags: ["Shopping", "Talking"],
            userBlocked: [],
            description:
                "I guess in most romantic comedies, the guy you're supposed to be with is the one that you've never really thought of in that way. You might have even thought he was annoying, or possibly homosexual.",
            location: "Ivry-sur-Seine",
            city: "Ivry-sur-Seine",
            popularity: 19,
            permission: "true"
        },
        {
            username: "pvance",
            firstName: "Phyllis",
            lastName: "Vance",
            birthDate: "1964-07-19",
            gender: -1,
            orientation: 1,
            email: "phyllisvance@outlook.com",
            password: hash("Vance123*", "whirlpool", "base64"),
            tags: ["Knitting"],
            userBlocked: [],
            description:
                "If they don't like it then they can leave - I mean, a lot of their work can be done in India.",
            location: "Montreuil",
            city: "Montreuil",
            popularity: 14,
            permission: "true"
        }
    ]);
    db.collection("pictures").insertMany([
        {
            link: "/img/Pam_3.jpg",
            author: "pbeesly",
            status: 1
        },
        {
            link: "/img/Pam_4.jpg",
            author: "pbeesly",
            status: 0
        },
        {
            link: "/img/Pam_2.jpg",
            author: "pbeesly",
            status: 0
        },
        {
            link: "/img/Pam_1.jpg",
            author: "pbeesly",
            status: 0
        },
        {
            link: "/img/Jim_2.jpg",
            author: "jhalpert",
            status: 1
        },
        {
            link: "/img/Jim_1.jpg",
            author: "jhalpert",
            status: 0
        },
        {
            link: "/img/Michael_1.jpg",
            author: "mscott",
            status: 1
        },
        {
            link: "/img/Michael_2.jpg",
            author: "mscott",
            status: 0
        },
        {
            link: "/img/Michael_3.jpg",
            author: "mscott",
            status: 0
        },
        {
            link: "/img/Dwight_1.jpg",
            author: "dschrute",
            status: 1
        },
        {
            link: "/img/Dwight_2.jpg",
            author: "dschrute",
            status: 0
        },
        {
            link: "/img/Angela_1.jpg",
            author: "amartin",
            status: 1
        },
        {
            link: "/img/Angela_2.jpg",
            author: "amartin",
            status: 0
        },
        {
            link: "/img/Kelly_1.jpg",
            author: "kkapoor",
            status: 1
        },
        {
            link: "/img/Kelly_2.jpg",
            author: "kkapoor",
            status: 0
        },
        {
            link: "/img/Oscar_1.jpg",
            author: "omartinez",
            status: 1
        },
        {
            link: "/img/Oscar_2.jpg",
            author: "omartinez",
            status: 0
        },
        {
            link: "/img/Andy_2.jpg",
            author: "abernard",
            status: 1
        },
        {
            link: "/img/Andy_1.jpg",
            author: "abernard",
            status: 0
        },
        {
            link: "/img/Phyllis_2.jpg",
            author: "pvance",
            status: 1
        },
        {
            link: "/img/Phyllis_1.jpg",
            author: "pvance",
            status: 0
        }
    ])
}

module.exports = configDB;
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    FacebookStrategy = require("passport-facebook"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    hash            = require('nodejs-hash-performance'),
    User            = require("./collections/user"),
    users           = require("./models/users_model"),
    db              = require("./db");

var authRoutes      = require("./server/auth"),
    usersRoutes     = require("./server/users"),
    libraryRoutes   = require("./server/library"),
    streamingRoutes = require("./server/streaming");

mongoose.connect("mongodb://localhost/hypertube");
//db.configDb();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("scripts"));
app.set("views", "./client/views");
app.set("view engine", "ejs");
app.use(flash());

app.use(require("express-session")({
    secret: "42 is always the answer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
        if(!err){
            if (user){
                if (user.password === hash(password, "whirlpool", "base64"))
                    return done(null, user);
                else
                    return done(null, false);
            }
            else
                return done(null, false);
        }
    })
}));

passport.use(new FacebookStrategy({
    clientID: "1832946213646922",
    clientSecret: "4bc2d0626ced9b11090c82403ef80929",
    callbackURL: "http://localhost:3000/authFacebook/callback",
    profileFields: ['id', 'emails', 'name']
}, function (token, refreshToken, profile, done) {
    process.nextTick(function () {
        User.findOne({'facebook.id': profile.id}, function (err, user) {
            if (err)
                return done(err);
            if (user){
                return done(null, user);
            }
            else{
                users.addUserWithFb(profile, token, function (err, user) {
                    if (!err)
                        return done(null, user);
                });
            }
        })
    })
}));

passport.serializeUser(function (user, callback) {
    callback(null, user._id);
});

passport.deserializeUser(function (id, callback) {
    User.findOne({_id: id}, function (err, user) {
        if (err)
            return callback(err);
        else
            return callback(null, user);
    })
});

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});

app.use("/", authRoutes);
app.use("/users", usersRoutes);
app.use("/library", libraryRoutes);
app.use("/streaming", streamingRoutes);

app.listen(3000, "127.0.0.1", function () {
    console.log("Hypertube server has started.");
});
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    db              = require("./db");

var authRoutes      = require("./controllers/auth"),
    usersRoutes     = require("./controllers/users"),
    libraryRoutes   = require("./controllers/library"),
    streamingRoutes = require("./controllers/streaming");

mongoose.connect("mongodb://localhost/hypertube");
// db.configDb();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("scripts"));
app.set("views", "./client/views");
app.set("view engine", "ejs");
app.set('view cache', false);
app.use(flash());

app.use(require("express-session")({
    secret: "42 is always the answer",
    resave: false,
    saveUninitialized: false
}));

require("./passport")();
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.session = req.session;
    next();
});

app.use("/", authRoutes);
app.use("/users", usersRoutes);
app.use("/library", libraryRoutes);
app.use("/streaming", streamingRoutes);

app.listen(3000, "127.0.0.1", function () {
    console.log("Hypertube server has started.");
});
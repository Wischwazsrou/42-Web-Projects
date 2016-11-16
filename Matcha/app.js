var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongo         = require("./db"),
    mongoDb       = require("mongodb"),
    hash          = require('nodejs-hash-performance'),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    http          = require('http').Server(app),
    io            = require("socket.io")(http);

mongo.connectionToServer();

io.on('connection', function(socket){
   socket.on('chat message', function(msg){
      io.emit('chat message', msg);
   });
});

var authRoutes    = require("./controllers/auth"),
    matchRoutes   = require("./controllers/match"),
    userRoutes    = require("./controllers/user");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("scripts"));
app.use(flash());


app.use(require("express-session")({
   secret: "matcha",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
   usernameField: "username",
   passwordField: "password"
}, function (username, password, done){
   var db = mongo.getDb();
   db.collection("users").findOne({username: username},
       (function(err, user){
         if (!err) {
            if (user) {
               if (user.password === hash(password, "whirlpool", "base64")) {
                  return done(null, user);
               }
               else {
                  return done(null, false);
               }
            }
            else {
               return done(null, false);
            }
         }
      }));
}));

passport.serializeUser(function(user, done){
   done(null, user._id);
});

passport.deserializeUser(function (id, done) {
   var db = mongo.getDb();
   db.collection("users").findOne({_id: mongoDb.ObjectId(id)},
       (function (err, user) {
          if (err) {
             console.log("ERROR");
             return done(err);
          }
          done(null, user);
       })
   )
});


app.use(function (req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.info = req.flash("info");
   next();
});


app.use("/", authRoutes);
app.use("/match", matchRoutes);
app.use("/user", userRoutes);

http.listen(3000, '127.0.0.1', function () {
   console.log("Matcha server has started.");
});
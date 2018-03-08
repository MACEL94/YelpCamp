var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");

// Require dei routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

// Faccio usare il bodyParser a express
app.use(bodyParser.urlencoded({ extended: true }));

/*      Configurazione      */
// Per collegarsi al db e debuggare da powershell:
// ii "C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"
// Crea o si collega al DB
mongoose.connect("mongodb://localhost/yelp_camp");

// Setto ejs come VE
app.set("view engine", "ejs");

// Includo le mie modifiche CSS
app.use(express.static(__dirname + "/public"));

// Includo method override
app.use(methodOverride("_method"));

// Faccio usare flash
app.use(flash());
/*          Rigenerazione opzionale del DB            */
//seedDB();

/*Passport config*/
app.use(require("express-session")({
    secret: "Bellissimo sto plugin",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middlewares per OGNI pagina
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Usa i Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen("3000", function () {
    console.log("server on localhost:3000 started");
});
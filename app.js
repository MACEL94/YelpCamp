var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user")
seedDB = require("./seeds");

/*      Configurazione      */
// Per collegarsi al db e debuggare da powershell: 
// ii "C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"
// Crea o si collega al DB
mongoose.connect("mongodb://localhost/yelp_camp");

// Setto ejs come VE
app.set("view engine", "ejs");

// Faccio usare il bodyParser a express
app.use(bodyParser.urlencoded({ extended: true }));

// Includo le mie modifiche CSS
app.use(express.static(__dirname + "/public"));

/*          Rigenerazione del DB            */
seedDB();

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

//Middleware per ogni pagina
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// Inizio dell'Applicazione
app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })
});

app.post("/campgrounds", function (req, res) {
    // Prendo i dati dal form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newDBObj = { name: name, image: image, description: description };

    //Crea il nuovo campground e lo salva in db
    Campground.create(newDBObj, function (err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            // ridirigo alla pagina corretta
            res.redirect("/campgrounds");
        }
    });
});

// Nuovo campground
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

// Pagina del singolo CampGround
app.get("/campgrounds/:id", function (req, res) {
    // prende il camp tramite l'id passato nell'url
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            // lo rendedizza
            res.render("campgrounds/show", { campground: foundCamp });
        }
    })
});

// COMMENTI
// Form nuovo commento
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    //Trova l'oggetto dall'id
    var campGround = Campground.findById(req.params.id, function (err, dbCamp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: dbCamp });
        }
    });
});

// Creazione del commento
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    // Ho già raggruppato i dati necessari in un oggetto comment
    //Trova l'oggetto dall'id
    Campground.findById(req.params.id, function (err, dbCamp) {
        //Crea il nuovo commento in db
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Creo il nuovo commento
            Comment.create(req.body.comment, function (err, dbnewComment) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    // Collego il nuovo commento al campground in db
                    dbCamp.comments.push(dbnewComment._id);

                    //Salvo
                    dbCamp.save();

                    // Infine ridirigo alla pagina corretta
                    res.redirect("/campgrounds/" + dbCamp._id);
                }
            })
        }
    })
});

// ===================
// AUTH ROUTES
// ===================

// show reg form
app.get("/register", function (req, res) {
    res.render("register");
});

// sign up
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, newlySavedUser) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        //Strategia
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        })
    })
});

//show login form
app.get("/login", function (req, res) {
    res.render("login");
});

// login route con middleware che prende 
// user e passw da solo dal body
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    // Fa tutto il middleware quindi qui non eseguo nulla
});

// logout route
app.get("/logout", function (req, res) {
    req.logout("login");
    res.redirect("/campgrounds");
});

//Controlla se l'utente è loggato, middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

app.listen("3000", function () {
    console.log("server on localhost:3000 started!!");
});
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
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

/*          Rigenerazione del DB            */
seedDB();

// Inizio dell'Applicazione
app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: campgrounds });
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
    res.render("new");
});

// Pagina del singolo CampGround
app.get("/campgrounds/:id", function (req, res) {
    // prende il camp tramite l'id passato nell'url
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            // lo rendedizza
            res.render("show", { campground: foundCamp });
        }
    })
});

app.listen("3000", function () {
    console.log("server on localhost:3000 started!!");
});
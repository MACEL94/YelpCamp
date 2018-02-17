var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    // Per collegarsi al db e debuggare da powershell: 
    // ii "C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"
    mongoose = require("mongoose");

// Crea o si collega al DB
mongoose.connect("mongodb://localhost/yelp_camp");

// Schema setup
var campGroundSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String,
    }
);

// Schema compile in modelper avere la classe utilizzabile
var Campground = mongoose.model("Campground", campGroundSchema);

// // Codice esempio che crea un nuovo campGround
// Campground.create({
//     name: "Salmon Creek",
//     image: "http://www.photosforclass.com/download/8288665755",
//     description: "Bellissima descrizione inutile del mio primo campground."
// }, function (err, nuovoOggetto) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Nuovo Oggetto Creato!!");
//         console.log(nuovoOggetto);
//     }
// });

// Setto ejs come VE
app.set("view engine", "ejs");

// Faccio usare il bodyParser a express
app.use(bodyParser.urlencoded({ extended: true }));


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
    Campground.findById(req.params.id, function (err, foundCamp) {
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
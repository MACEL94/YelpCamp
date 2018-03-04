var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// Index 
router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })
});

// Creazione
router.post("/", function (req, res) {
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

// Nuovo campground - NUOVO
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

// Pagina del singolo CampGround -SHOW
router.get("/:id", function (req, res) {
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

module.exports = router;
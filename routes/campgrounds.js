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
router.post("/", isLoggedIn, function (req, res) {
    // Prendo i dati dal form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    // AUTORE
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    // CampgroundObj
    var newDBObj = {
        name: name,
        image: image,
        description: description,
        author: author
    };

    //Crea il nuovo campground e lo salva in db
    Campground.create(newDBObj, function (err, newlyCreatedCamp) {
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
router.get("/new", isLoggedIn, function (req, res) {
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

// EDIT CAMPGROUND
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    // Carico l'id e se è possibile lo renderizzo nel form
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE CAMPGROUND
router.put("/:id", checkCampgroundOwnership, function (req, res) {
    // Carico il camp tramite l'id e poi ne faccio l'update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
    // Carico il camp tramite l'id e poi ne faccio l'update
    Campground.findByIdAndRemove(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            console.log(err);
        }

        // A prescindere devo riportare l'utente indietro
        res.redirect("/campgrounds");
    });
});


// Controlla se l'utente è loggato, middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

// Controlla se l'utente è l'utente corretto oltre ad essere loggato
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        // Carico l'id e se è possibile lo renderizzo nel form
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            }
            else {
                // Controllo che sia l'effettivo creatore del campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        // Rimando indietro l'user
        res.redirect("back");
    }
}

module.exports = router;
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
            req.flash("error", "Unexpected error occurred, please retry");
            req.redirect("back");
        }
        else {
            // ridirigo alla pagina corretta
            res.redirect("/campgrounds");
        }
    });
});

// Nuovo campground - NUOVO
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.get("/:id/edit", middleware.checkCampGroundOwnership, function (req, res) {
    // Carico l'id e se è possibile lo renderizzo nel form
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampGroundOwnership, function (req, res) {
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

// DELETE 
router.delete("/:id", middleware.checkCampGroundOwnership, function (req, res) {
    // Carico il camp tramite l'id e poi ne faccio l'update
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("success", "Campground Deleted");
            res.redirect("back");
        }
        else{
            req.flash("success", "Campground Deleted");
            res.redirect("/campgrounds");
        }
    });
});

// N.B. Nel caso in cui qualcuno aggiunga qualcosa che non dovbrebbe, mi riservo di poterli cancellare con questo route
router.delete("/:id/ADMINROUTE", function (req, res) {
    // Carico il camp tramite l'id e poi ne faccio l'update
    Campground.findByIdAndRemove(req.params.id, function (err) {
        req.flash("success", "Campground Deleted");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
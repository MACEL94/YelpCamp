var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// COMMENTI
// Form nuovo commento
router.get("/new", isLoggedIn, function (req, res) {
    //Trova l'oggetto dall'id
    Campground.findById(req.params.id, function (err, dbCamp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: dbCamp });
        }
    });
});

// Creazione del commento
router.post("/", isLoggedIn, function (req, res) {
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

//Controlla se l'utente è loggato, middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;
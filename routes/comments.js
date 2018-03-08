var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTI
// Form nuovo commento
router.get("/new", middleware.isLoggedIn, function (req, res) {
    // Trova l'oggetto dall'id
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
router.post("/", middleware.isLoggedIn, function (req, res) {
    // Ho già raggruppato i dati necessari in un oggetto comment
    // Trova l'oggetto dall'id
    Campground.findById(req.params.id, function (err, dbCamp) {
        // Crea il nuovo commento in db
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Creo il nuovo commento
            Comment.create(req.body.comment, function (err, dbnewComment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    res.redirect("/campgrounds");
                } else {
                    // Aggiungo username e id al commento
                    dbnewComment.author.id = req.user.id;
                    dbnewComment.author.username = req.user.username;
                    // Salvo
                    dbnewComment.save();

                    // Collego il nuovo commento al campground in db
                    dbCamp.comments.push(dbnewComment._id);

                    // Salvo
                    dbCamp.save();

                    // Messaggio per l'user
                    req.flash("success", "Comment created!");

                    // Infine ridirigo alla pagina corretta
                    res.redirect("/campgrounds/" + dbCamp._id);
                }
            })
        }
    })
});

// Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    // Trova l'oggetto dall'id
    Campground.findById(req.params.id, function (err, dbCamp) {
        if (err) {
            res.redirect("back");
        }
        else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    res.redirect("back");
                }
                else {
                    res.render("comments/edit", { campground: dbCamp, comment: foundComment });
                }
            });
        }
    });
});

// Update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // Trova l'oggetto dall'id
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        // Al campground del commento
        res.redirect("../../" + req.params.id);
    });
});

// Delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        req.flash("success", "Comment Deleted");
        res.redirect("../../" + req.params.id);
    });
});

// N.B. Nel caso in cui qualcuno aggiunga qualcosa che non dovbrebbe, mi riservo di poterli cancellare con questo route
router.delete("/:comment_id/ADMINROUTE", function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        req.flash("success", "Comment Deleted");
        res.redirect("../../" + req.params.id);
    });
});

module.exports = router;
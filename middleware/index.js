var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

// Controlla se l'utente è l'utente corretto oltre ad essere loggato
middlewareObj.checkCampGroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        // Carico l'id e se è possibile lo renderizzo nel form
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                // Controllo che sia l'effettivo creatore del campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // Rimando indietro l'user
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// Controlla se l'utente è l'utente corretto oltre ad essere loggato
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        // Carico l'id e se è possibile lo renderizzo nel form
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                // Controllo che sia l'effettivo creatore del commento
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // Rimando indietro l'user
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// Controlla se l'utente è loggato, middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ===================
// AUTH - Index ROUTES
// ===================

// Inizio dell'applicazione
router.get("/", function (req, res) {
    res.render("landing");
});

// show reg form
router.get("/register", function (req, res) {
    res.render("register");
});

// sign up
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, newlySavedUser) {
        if (err) {
            req.flash("error", err.message)
            return res.render("register");
        }
        //Strategia
        passport.authenticate("local")(req, res, function () {
            req.flash("success","Welcome to YelpCamp " + newlySavedUser.username)
            res.redirect("/campgrounds");
        })
    })
});

//show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// user e passw da solo dal body
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash:"Something went wrong while logging in",
    successFlash: "You've been logged in"
}));

// logout route
router.get("/logout", function (req, res) {
    req.logout("login");
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;
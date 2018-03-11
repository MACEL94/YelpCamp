var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var primoAuthor = {};

var campGroundBaseDataArray = [
    {
        name: "Cloud's Rest",
        price: "999.00",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        price: "998.00",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        price: "996.00",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

// Funzione effettiva da esportare
function seedDB() {
    // Prendo il primo author
    User.findOne({}, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            primoAuthor.username = foundUser.username;
            primoAuthor.id = foundUser._id;
        }
    });

    // Rimuove tutti i campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("removed campgrounds");
        }

        // Rimuove tutti i commenti
        Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("removed comments");
            }

            // Li riaggiunge prendendoli dall'array hardcoded
            campGroundBaseDataArray.forEach(function (seed) {
                // assegno l'author
                seed.author = primoAuthor;
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a campground");

                        // Crea i commenti per ciascuno
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: primoAuthor,
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment._id);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;
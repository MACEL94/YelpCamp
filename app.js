var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var campgrounds = [
    {
        name: "Salmon Creek",
        image: "http://www.photosforclass.com/download/8288665755"
    },
    {
        name: "Ivana De Bonis's",
        image: "http://www.photosforclass.com/download/3730341267"
    },
    {
        name: "John Locke's",
        image: "http://www.photosforclass.com/download/22116667926"
    }
];

// Setto ejs come VE
app.set("view engine", "ejs");
// Faccio usare il bodyParser a express
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {

    res.render("campgrounds", { campgrounds: campgrounds });
})

app.post("/campgrounds", function (req, res) {
    // Prendo i dati dal form
    var name = req.body.name;
    var image = req.body.image;

    campgrounds.push({name: name, image: image});
    // ridirigo alla pagina corretta
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

app.listen("3000", function () {
    console.log("server on localhost:3000 started!!");
});
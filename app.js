var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");
    //seedDB = require("./models/seeds"); // seed the database

// requiring routes 
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


   

mongoose.connect("mongodb://localhost/yelp_camp_v11", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
console.log("__dirname = ", __dirname);
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// Schema and model of campground has been shifted to campground.js

// passport configuration
app.use(require("express-session")({
  secret: "Once again Bruno wins",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User.authenticate comes with passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
       
app.use(campgroundRoutes); //app.use("/campgrounds", campgroundRoutes); this will append /campgrounds in every route in campgrounds.js and in campgrounds.js file we only define the rest of route coz /campgrounds is already there
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(3333, "127.0.0.1", function()
{
    console.log("Yelp camp server has started");
});

// mongod --directoryperdb --dbpath C:\Users\Master\Desktop\mongodb\data\db

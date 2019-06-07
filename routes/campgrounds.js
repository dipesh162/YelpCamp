var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");  // it automatically render index file


// THis is INDEX routes - show all campgrounds
router.get("/campgrounds", function(req, res)
  {
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds)
    {
         if(err)
         {
          console.log(err);
         }
         else
         {
          res.render("campgrounds/index", {campgrounds:allCampgrounds});
         }
    });
  });

                                                    //res.render("campgrounds", {campgrounds:campgrounds});
                                                    //});

//CREATE - Add new campgrounds to DB 
router.post("/campgrounds", middleware.isLoggedIn,  function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
    id: req.user._id,
    username: req.user.username
   }
   var newCampground = {name : name, image : image , description: desc, author: author};
   //Create a new campground and save to database
   Campground.create(newCampground , function(err , newCreated)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
           console.log(newCreated)
           res.redirect("/campgrounds");
      }
    });
   //campgrounds.push(newcampground);
   // res.redirect("/campgrounds");
});

// NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn , function(req, res){
    res.render("campgrounds/new.ejs");
});

// shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
      {
        if(err){
          console.log(err);
        }
        else{
          
          //render show template with that campground
          res.render("campgrounds/show" , {campground: foundCampground});
        }
      });

    //render show template with that campground
    //res.render("show");
});


// EDIT campground route              
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      res.render("/campgrounds/edit", {campground: foundCampground});
   });
});    

// other wise, redirect  
// if not , redirect somewhere





// UPDATE campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
    // redirect somewhere
});


// Destroy Route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }
    else{
      res.redirect("/campgrounds");
    }
  });
});



module.exports = router;
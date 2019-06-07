var express = require("express");
var router = express.Router(); // express.Router({mergeParams: true}) by adding this we will have id identified when we indent our route by only writing particular route coz beginning phrase of route can be defined in  e.g app.use("/dasdsa", filename) 
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");  // it automatically render index file


// Comments new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }
    else{
      res.render("comments/new", {campground: campground});
    }
  });
  
});

// Comments create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
// look campground using id
Campground.findById(req.params.id, function(err, campground){
  if(err){
    console.log(err);
    res.redirect("/campgrounds");
  }
  else{
    Comment.create(req.body.comment, function(err, comment){
      if(err){
        req.flash("error", "Oops something went wrong")
;        console.log(err);
      }
      else{
        // add username and id to comment
        comment.author.id = req.user._id;
        comment.author.username = req.user.user;
        console.log("New comment username will be" + req.user.username);
        // save comment
        comment.save();
        campground.comments.push(comment);
        campground.save();
        console.log(comment);
        req.flash("success", "Woo hoo your comment is created");
        res.redirect('/campgrounds/' + campground._id);
      }
    });
  }
});
});

// Comments edit route

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
  
})

// Comments update
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err, updatedComment){
       if(err){
                 res.redirect("back");
       } else{ 
                 res.redirect("/campgrounds/" + req.params.id);
       }
  });
});


// COMMENTS DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
  // find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id , function(err){
    if(err){
    res.redirect("back");
     } else {
      req.flash("success", "Comment Deleted");
      res.redirect("/campgrounds/" + req.params.id);
     }
  });
});


module.exports = router;


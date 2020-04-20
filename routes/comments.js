var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var methodOverride = require("method-override");
//comments
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err)
		}else{
			
			res.render("commentform.ejs", {campground:campground});
		}
	});
	
});
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	//look for id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
				Comment.create(req.body.comment,function(err,comment){
					if(err){
						req.flash("error","Something went wrong");
						console.log(err)
					}else{
						//add username and id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						//save comment
						comment.save();
						campground.comments.push(comment);
						campground.save();
						req.flash("success","Comment added successfully");
						res.redirect("/campgrounds/" + campground._id);
					}
				})
		}
	})
});
//Edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("show.ejs")
		}else{
			Comment.findById(req.params.comment_id,function(err, foundComment){
				if(err){
					res.redirect("back");
				}else{
					res.render("commentedit.ejs",{campground:campground,comment:foundComment});
				}
			})
	
		}
	});
});

//Update Comment
//findByIdAndUpdate(id,data wich you want to update,callback)
router.post("/campgrounds/:id/comments/:comment_id",checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//Delete comment
router.post("/campgrounds/:id/comments/:comment_id/delete",checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err,deleteComment){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please loggin!! ");
	res.redirect("/login");
};

function checkCommentOwnership(req,res,next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
						next();
				}else{
					req.flash("error","You dont have the permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","You are not logged in!!!");
		res.redirect("back");
	}
};

module.exports=router;
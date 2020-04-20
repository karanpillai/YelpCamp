var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var methodOverride = require("method-override");


router.get("/campgrounds",function(req,res){
	//GET CAMPGROUNDS FROM DB
	Campground.find({},function(err , allcampground){
		if(err){
			console.log("Something went wrong");
			console.log(err);
		}else{
			res.render("campgrounds.ejs",{campground:allcampground,currentUser:req.user});
		}
	});
		
});

router.post("/campgrounds",isLoggedIn,function(req , res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description
	var author ={
		id:req.user._id,
		username: req.user.username
	}
	var newcampground = {name:name,image:image, description:desc,price:price, author:author};
	Campground.create(newcampground,function(err , campground){
		if(err){
			console.log(err);
		}else{
			req.flash("success","Campground created successfully");
			res.redirect("/campgrounds");
		}
	});
	
	
});

router.get("/campgrounds/new",isLoggedIn,function(req , res){
	res.render("form.ejs");
});

//show more information about particular item
router.get("/campgrounds/:id",function(req,res){
	//FIND THE CAMPGROUND WITH THE PROVIDED ID
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//DISPLAY A TEMPLATE ABOUT THAT ITEM
			res.render("show.ejs", {campground:foundCampground});  //foundCampground sab info dega 
			
		}
	});
	
});

//EDIT CAMPGROUND

//does user logged in?
		//does it own the campground?
		//else redirect somewhere.
//if not redirect.

router.get("/campgrounds/:id/edit",checkUserOwnership,function(req,res){
	
			Campground.findById(req.params.id,function(err,foundCampground){
				res.render("campgroundedit.ejs",{campground:foundCampground});
		});	
	
});
//UPDATE CAMPGROUND
router.post("/campgrounds/:id",checkUserOwnership, function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Editing done Successfully..");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//Destroy Campground
router.post("/campgrounds/:id/delete",checkUserOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","Campground not deleted,Please retry...");
			res.redirect("/cammpgrounds");
		}else{
			req.flash("success","Campground deleted Successfully...");
			res.redirect("/campgrounds");
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login first!!");
	res.redirect("/login");
};

function checkUserOwnership(req,res,next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
						next();
				}else{
					req.flash("error","You dont have the permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","You need to be logged in to do that!!");
		res.redirect("back");
	}
};

module.exports=router;
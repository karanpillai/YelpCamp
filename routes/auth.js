var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/",function(req,res){
	res.render("landing.ejs");
});
//============//
// Auth routes
//================//

//show signup form
router.get("/register",function(req, res){
	res.render("register.ejs")
});

router.post("/register", function(req, res){
	//username and password(hash) are stored in databse
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            res.redirect("/register");
        }
        //take cre of sessions
        passport.authenticate("local")(req, res, function(){
        	req.flash("success","Welcome to YelpCamp " + user.username);
           res.redirect("/login");
        });
    });
});

//show login form
router.get("/login",function(req,res){
	res.render("login.ejs");
});
//handle login form
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	
});

//logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have been logged out successfully!!!");
	res.redirect("/campgrounds");
});

router.get("/about",function(req,res){
	res.render("about.ejs");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};


module.exports = router;
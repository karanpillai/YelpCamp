require('dotenv').config();
var express       =require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport 	  = require("passport");
var LocalStrategy = require("passport-local");
var User          = require("./models/user");
var Campground 	  = require("./models/campground");
var flash         = require("connect-flash"); 
var seedDB		  = require("./seed");
var Comment 	  = require("./models/comment");
var methodOverride =require("method-override");

var campgroundRoutes=require("./routes/campgrounds")
var commentsRoutes=require("./routes/comments")
var authRoutes=require("./routes/auth")
const PORT = process.env.PORT || 5000


//seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{useNewUrlParser:true});
/*mongoose.connect("mongodb+srv://karan:karan721@cluster0-1w8r0.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err =>{
	console.log('ERROR:', err.message);
});*/


//Passport Configuration
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
	secret:"Rusty is still cutest",
	resave:false,
	saveUninitialized:false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//middleware :har ek route m yeh pass hoyga
app.use(function(req,res,next){
	res.locals.currentUser= req.user;   //req.user se logged in user ka info milega
	res.locals.error 	= req.flash("error");
	res.locals.success 	= req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use(authRoutes);
app.use(methodOverride("_method"));


//create campground
// Campground.create({
// 			name:"Himalayan hill", 
// 			image:"https://images.unsplash.com/photo-1557256728-cd9dbea73286?ixlib=rb-						1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 			description:"This is a great hill,Please do have a visit here."},
// 				function(err,campground){
// 				if(err){
// 					console.log("SOMETHING WENT WRONG!!!");
// 				}else{
// 					console.log("Campground added to the Database");
// 					console.log(campground);
// 	}
// });




//comments


//============//
// Auth routes
//================//



//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
 app.listen(3000,function(){
 	console.log("YelpCamp has been started");
 });


/*//comments:
nested routes-
/comments/new      new route - form open hoyga
/comments          create route - db m save krna http
particular campground k sath comment link rehena chaiye :

/campgrounds/:id/comments/new   
/campgrounds/:id/comments*/
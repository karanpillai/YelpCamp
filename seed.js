var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{name:"Sahayadri Hills",
	 image:"https://images.unsplash.com/photo-1578165219176-ece04edbd053?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	 description:"Place to be visited every year.."},
	 {name:"Mount Abu",
	 image:"https://images.unsplash.com/photo-1578165219176-ece04edbd053?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	 description:"Nice mountains, cool weather.."},
	 {name:"Kedarnath Hills",
	 image:"https://images.unsplash.com/photo-1578165219176-ece04edbd053?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	 description:"Nature comes true here.."},
	 {name:"Vasudev Hills",
	 image:"https://images.unsplash.com/photo-1578165219176-ece04edbd053?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	 description:"Mann mai shiva.."},
]

function seedDB(){
	//remove campgrounds
	Campground.remove({},function(err,Campground){
		if(err){
			console.log(err);
		}
		else{
			console.log("Campground removed successfully");
		}

		
	});
	//add new campgrounds
		data.forEach(function(seeds){
			Campground.create(seeds,function(err,campground){
				if(err){
					console.log(err);
				}else{
					console.log("added successfully");
					Comment.create({
						title:"This place is great but there is no internet",
						author:"Homer charlie"
					},function(err,comment){
						if(err){
							console.log(err);
						}else{
							campground.comments.push(comment);
							campground.save();
							console.log("Comment created");
						}
						
					});
				}

			});
		});
		//ad comments

		

}
module.exports = seedDB;





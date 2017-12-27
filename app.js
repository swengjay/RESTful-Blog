// BASE SETUP
// =============================================================================

// Call the packages we need.
const expressSanitizer = require("express-sanitizer"),
methodOverride 		 = require("method-override"),
bodyParser 		     = require('body-parser'),
express 	 	     = require('express'),
app 		  	     = express();

// App Configuration.
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());// after bodyParser(always)
app.use(methodOverride("_method"));

// Database Setup.
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restful_blog_app');

// Blog model lives here
const Blog = require('./app/models/Blog.js');

// RESTFul Routes

app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs) {
		if(err) {
			console.log("ERROR!");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("==========");
	console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog) {
		if(err) {
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog:foundBlog});
		}
	})
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		} 
	});
});

app.listen(3000, function() {
  console.log("Blog App");
});

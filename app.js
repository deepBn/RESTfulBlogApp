var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

//APP CONFIG
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

//MONGOOSE/MODEL CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

/* Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1512805668868-1608a189cc2b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=612e8772acf04c29749cc5cf6a4c211a&auto=format&fit=crop&w=1489&q=80",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id est fringilla, vulputate mauris convallis, tincidunt erat. Pellentesque habitant morbi."
}, function (err, newBlog) {
    if (err) {
        console.log(err)
    } else {
        console.log(newBlog);
    }
}); */

//RESTFUL ROUTES

//INDEX ROUTE
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                blogs: blogs
            });
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    Blog.create(req.body.blog, function (err, blog) {
        if (err) {
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {
                blog: blog
            });
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", {
                blog: blog
            });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen("3000", function () {
    console.log("blog app running");
});
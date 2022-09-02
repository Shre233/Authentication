//jshint esversion:6
require('dotenv').config()
var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var mongoose = require("mongoose");
var encrypt=require("mongoose-encryption");//module for encryption

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public")); 

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userdb", { useNewUrlParser: true });
//making a schema using mongoose class
const userSchema = new mongoose.Schema( {
  Email: String,
  Password: String
});
//setting encryption
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['Password']});//before forming model add plugin to schema 
//mongodb automatically decript at findone function
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  User.findOne({ Email: req.body.username }, function (err, foundUser) {
    if (err) 
    {
      console.log(err);
    } 
    else 
    {
      if (foundUser) 
      {
        if (foundUser.Password === req.body.password) 
        res.render("secrets");
        else 
        res.send("Password doesnot match");
      }
       else
        {
        res.send("User doesnot exist");
      }
    }
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  var newUser = new User({
    Email: req.body.username,
    Password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) console.log(err);
    else res.render("secrets");
  });
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});

var express = require('express');
var app = express();
var config = require('./config/index');
var mongoose = require('mongoose');
var loginController = require('./controllers/login.controller');

mongoose.connect(config.getDBConnectionString());

var bodyParser = require('body-parser');
//var config = require('./config/index');
var mongoose = require('mongoose');

app.get('/', function(req, res){
   res.send("testing");
});

loginController(app);

process.env.PORT = process.env.PORT || 80;

app.listen(process.env.PORT, function(){
    console.log("running on " + process.env.PORT);
});
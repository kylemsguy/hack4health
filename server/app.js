var express = require('express');
var app = express();

var bodyParser = require('body-parser');
//var config = require('./config/index');
var mongoose = require('mongoose');

app.get            ('/', function(req, res){
   res.send("testing");
});

process.env.PORT = process.env.PORT || 80;

app.listen(process.env.PORT, function(){
    console.log("running on " + process.env.PORT);
});
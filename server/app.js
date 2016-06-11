var express = require('express');
var app = express();
var config = require('./config/index');
var mongoose = require('mongoose');
var loginController = require('./controllers/login.controller');
var receptionController = require('./controllers/reception.controller');
var cors = require('cors');

app.use(cors());

mongoose.connect(config.getDBConnectionString());


app.get('/', function(req, res){
   res.send("testing");
});

loginController(app);
receptionController(app);

process.env.PORT = process.env.PORT || 80;

app.listen(process.env.PORT, function(){
    console.log("running on " + process.env.PORT);
});
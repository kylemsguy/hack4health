var User = require('../models/User.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    
    
    app.post('/signup', function(req, res){
        //save info from form to database
        try {
            User.find({username: req.body.username}, function(err, existingProf){
	            if (err) {
	                throw err;
	            } else if (existingProf.length === 0) { //if username doesn't exist, create new profile
	                console.log(req.body.username + ' ' + req.body.locationLong +' '+ req.body.locationLat);
	            
	                var newUser = User ({
	                    username: req.body.username,
	                    appointments: [],
	                    locationLong: req.body.locationLong || 0,
	                    locationLat: req.body.locationLat || 0
	                });
	        
	                newUser.save(function(err){
	                    if (err) throw err;
	                    res.end("success");
	                });
	            }
	        });
        } catch (err) {
            console.log("Error with findOne method in MongoDB");
            res.end("error");
        }
    });

 // var newUser = User ({
 //                        username: req.body.username,
 //                        email: req.body.email,
 //                        password: req.body.password,
 //                        friends: [],
 //                        messages: []
 //                    });
            
 //                    newUser.save(function(err){
 //                        if (err) throw err;
 //                        res.end("success");



	app.post('/makeappointment', function(req, res){
		User.find({username: req.body.username}, function)
	});

	app.post('/makeClinic', function(req, res){

	})


    
    
    app.post('/location', function(req, res){
        var query = {username: req.body.username};
        console.log(req.body.username + ' ' + req.body.long);
        
        User.findOneAndUpdate(query, {$set:{locationLong: req.body.long, locationLat: req.body.lat}}, {new: true}, function(err, data){
            if (err) throw err;
            res.end("success");
            
        });
        
    });
    

    
};

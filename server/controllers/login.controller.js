var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    
    
    app.post('/signup', function(req, res){
        //save info from form to database
        try {
            User.find({email: req.body.email}, function(err, existingProf){
	            if (err) {
	                throw err;
	            } else if (existingProf.length === 0) { //if username doesn't exist, create new profile
	                console.log(req.body.email + ' ' + req.body.locationLong +' '+ req.body.locationLat);
	            
	                var newUser = User ({
	                    email: req.body.email,
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

    //receive email & appointment info(clinicName, doctorName, time, username)
	app.post('/newAppointment', function(req, res){
	    //make new appointment
	    var newAppid;
	    Appointment.find({}, function(err, appointments){
	        if (err) throw err;
	        console.log(appointments.length);
	        newAppid = appointments.length + 1;
	        
	        var newAppointment = Appointment ({
	            appid: newAppid,
	            email: req.body.email,
	            clinicName: req.body.clinicName,
	            doctorName: req.body.doctorName,
	            checkedIn: false,
	            distance: 0,
	            time: req.body.time
	        });
	    
	        newAppointment.save(function(err){
    	        if (err) throw err;
	            res.send("successfully booked an appointment");
	        });    
	    });
	    
	    //update user info
		User.findOne({email: req.body.email}, function(err, user){
		    if (err) throw err;
		    user.appointments.push(newAppid);
		    user.save(function(err){
		        if (err) throw err;
		        console.log("successfully updated all this new appointment shit");
		    });
		    console.log(user);
		    
		});
	});


    //make a new clinic
	app.post('/makeClinic', function(req, res){
        var newClinic = Clinic ({
            clinicName: req.body.clinicName,
            locationLong: req.body.long,
            locationLat: req.body.lat,
            patients: []
        });
        
        newClinic.save(function(err){
            if (err) throw err;
            console.log("successfully made new clinic");
        })
	});


    
    
    app.post('/location', function(req, res){
        var query = {email: req.body.email};
        console.log(req.body.email + ' ' + req.body.long);
        
        User.findOneAndUpdate(query, {$set:{locationLong: req.body.long, locationLat: req.body.lat}}, {new: true}, function(err, data){
            if (err) throw err;
            res.end("success");
            
        });
        
    });
    

    
};

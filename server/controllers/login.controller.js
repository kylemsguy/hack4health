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
	            doctorName: req.body.doctorName || "Mrs. Li",
	            checkedIn: false,
	            distance: 0,
	            month: req.body.month,
	            day: req.body.day,
	            time: req.body.time,
	            estimateTime: req.body.estimateTime || 20
	        });
	    
	    	console.log(newAppointment);
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
		    });
		    console.log(user);
		    
		    
		});
		
		Clinic.findOne({clinicName: req.body.clinicName}, function(err, clinic){
			if (err) throw err;
			console.log(clinic);
			clinic.patients.push(newAppid);
			clinic.save(function(err){
				if (err) throw err;
				console.log("Yayy finished making new appointment");
			});
		});
	});


    //make a new clinic
	app.post('/makeClinic', function(req, res){
	    console.log(req.body.clinicName);
        var newClinic = Clinic ({
            clinicName: req.body.clinicName,
            locationLong: req.body.long,
            locationLat: req.body.lat,
            patients: []
        });
        
        newClinic.save(function(err){
            if (err) throw err;
            res.end("successfully made new clinic");
            console.log("successfully made new clinic");
        });
	});
    
};

var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());


    //receive clinicName
    //send list of appid, checkedIn, name
    app.post('/clinicLogin', function(req, res){
        console.log(req.body.clinicName);
        Clinic.findOne({clinicName: req.body.clinicName}, function(err, clinic){
            if (err) throw err;
            var appDetailList = [];
            console.log(clinic);
        
            
            Appointment.find({'appid': { $in: clinic.patients}}, function(err, docs){
                if (err) throw err;
                
                res.send(docs);
            });
            
        });
    });
    
    //find appid and update checkedin to true
    app.post('/checkIn', function(req, res){
        Appointment.findOne({appid: req.body.appid}, function(err, app){
            if (err) throw err;
            app.checkedIn = true;
            app.save(function(err){
                if (err) throw err;
            });
            res.send("success");
        });
    });
    
    //receives clinicName & appid
    //updates pt data to remove appointment,
    //updates clinic.patients to remove the element
    app.post('/endApp', function(req, res){
        Clinic.findOne({clinicName: req.body.clinicName}, function(err, clinic){
            if (err) throw err;
            var finished = clinic.patients.indexOf(req.body.appid);
            clinic.patients.splice(finished, 1);
            clinic.save(function(err){
                  if (err) throw err; 
            });
            
        
            Appointment.findOne({appid: req.body.appid}, function(err, appDetails){
                if(err)throw err;
                
                User.findOne({email: appDetails.email}, function(err, userData){
                    if(err)throw err;
                    userData.appointments.splice(userData.appointments.indexOf(req.body.appid), 1);
                    userData.save(function(err){
                        if (err) throw err;
                    });
                });
                
                // Appointment.remove({appid: req.body.appid}, function(err){
                //     if (err) throw err;
                // });
                
                res.send("success");
            });  
            
           

        });
        
        
       
    });
    
};
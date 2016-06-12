var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    //endpoint: post to /clinicLogin
    //receive clinicName
    //send sorted list of appid, checkedIn, name, etc
    app.post('/clinicLogin', function(req, res){
        console.log(req.body.clinicName);
        Clinic.findOne({clinicName: req.body.clinicName}, function(err, clinic){
            if (err) throw err;
            var appDetailList = [];
            console.log(clinic);
        
            //find all appointments for one clinic, sort them, and send back
            Appointment.find({'appid': { $in: clinic.patients}}, function(err, docs){
                if (err) throw err;
                var sendStuff = [];
                docs.forEach(function(doc){
                    if (doc.ended==true){
                        sendStuff.push(doc);
                    }
                });
                sortedDocs(docs);
                res.send(docs);
            });
        });
    });
    
    //return "success"
    app.post('/checkIn', function(req, res){
        console.log("checkin request received");
        Appointment.findOne({appid: req.body.appid}, function(err, app){
            if (err) throw err;
            app.checkedIn = true;
            app.save(function(err){
                if (err) throw err;
                //console.log("checkin complete for appointment");
            });
            
            //update the clinic's patient's list
            //get the clinic name
            Clinic.findOne({clinicName: app.clinicName}, function(err, clinic){
                if (err) throw err;
                console.log("patient list: " + clinic.patients);
                Appointment.find({'appid': { $in: clinic.patients}}, function(err, appList){
                    if (err) throw err;
                    console.log(appList);
                    sortedDocs(appList);
                    //res.send(appList);
                    res.send("success");
                    console.log("checkin request done");
                });
            });
        });
    });
                                                                                                      
    //receives clinicName & appid
    //updates pt data to remove appointment,
    //updates clinic.patients to remove the element,
    //doesn't do much for the appointment bc of the appid system for the apps, sorrrrry
    //send back "success"
    app.post('/endApp', function(req, res){
        console.log("received request for ending/cancelling appointment");
        //find clinic and update patients array to leave out the appid for this req.body.appid
        Clinic.findOne({clinicName: req.body.clinicName}, function(err, clinic){
            if (err) throw err;
            var finished = clinic.patients.indexOf(req.body.appid);
            clinic.patients.splice(finished, 1);
            clinic.save(function(err){
                  if (err) throw err; 
            });
            
            //cancel the appointment so ended = true and remove the appid from the user's list of appointments
            Appointment.findOne({appid: req.body.appid}, function(err, appDetails){
                if(err)throw err;
                
                // appDetails.ended = true;
                // appDetails.save(function(err){
                //   if (err) throw err; 
                // });
                
                User.findOne({email: appDetails.email}, function(err, userData){
                    if(err)throw err;
                    userData.appointments.splice(userData.appointments.indexOf(req.body.appid), 1);
                    userData.save(function(err){
                        if (err) throw err;
                    });
                });
                
                console.log('finished ending/cancelling appointment');
                res.send("success");
            });  
        });
    });
    
    
    //spits out all appointments that are not cancelled
    app.post('/allappointments', function(req, res){
        Appointment.find({}, function(err, data){
            if (err) throw err;
            res.send(data);
        });
    });
};




//takes the docs and sort them according to time
//put the time into two groups, one checked in and one not checked in
function sortedDocs(docs){
    var checkedIn = [];
    var notCheckedIn = [];
    docs.forEach(function(doc){
        if (doc.checkedIn === true){
            checkedIn.push(doc);
        } else {
            notCheckedIn.push(doc);
        }
    });
    sortList(checkedIn);
    sortList(notCheckedIn);

    notCheckedIn.forEach(function(app){
      checkedIn.push(app);
    });
    
    return checkedIn;
}

function sortList(list){
  list.sort(function(a, b){
    if (a.time < b.time){
            return -1;
        } else if (a.time > b.time) {
            return 1;
        } else {
            return 0;
        }
  });
}
    




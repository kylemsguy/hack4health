var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
  
    //receive email
    //give back lots of shit
    app.post('/login', function(req, res){
        User.findOne({email: req.body.email}, function(err, userData){
            if (err) throw err;
            console.log(userData);
            
            //gives back a bunch of login stuff
            Appointment.find({'appid': { $in: userData.appointments}}, function(err, docs){
                if (err) throw err; 
                console.log(docs);
                var returnObject = [];
                sortedDocs(docs);
                docs.forEach(function(doc){
                    var hour = Math.floor(doc.time);
                    var min = (doc.time - hour) * 60;
                    
                    var date = new Date(2016, doc.month-1, doc.day, hour, min).getTime().toString();
                    console.log(date);
                    returnObject.push(
                        {
                            appid: doc.appid,
                            email: doc.email,
                            clinicName: doc.clinicName,
                            checkedIn: doc.checkedIn,
                            distance: doc.distance,
                            date: date 
                        });
                });
                
                res.send(returnObject);
            });

        });
    });
    
    
    //receive appid, give back lots of stuff
    //whether or not you've checked in, clinicInfo: how many pt before you, average time to intake(add all pt time before you),
    //and how far away you are from app
    app.post('/appdetail', function(req, res){
        Appointment.findOne({appid: req.body.appid}, function(err, appdetail){
            if (err) throw err;
            Clinic.findOne({clinicName: appdetail.clinicName}, function(err, clinicInfo){
                if (err) throw err;
                Appointment.find({'appid': { $in: clinicInfo.patients}}, function(err, docs){
                    if (err) throw err;
                    var sortedList = sortedDocs(docs);
                    //res.send(sortedList);
                    var listOfAppids = [];
                    sortedList.forEach(function(doc){
                        listOfAppids.push(doc.appid); 
                    });
                    
                    //save new pt list for clinic
                    clinicInfo.patients = listOfAppids;
                    clinicInfo.save(function(err){
                        if(err) throw err;
                    });
                    
                    //tell pt how many patients in front of him/her
                    //get sublist of ppl in front of you and add their approx time
                    var index = listOfAppids.indexOf(appdetail.appid);
                    var time = 0;
                    if (index > 0){
                        var patientsBefore = listOfAppids.slice(0, index);
                        Appointment.find({'appid': { $in: patientsBefore}}, function(err, appointmentList){
                            if (err) throw err;
                            appointmentList.forEach(function(objectAppt){
                                time = objectAppt.estimateTime + time; 
                            });
                            console.log("estimated time: " + time);
                            res.send({
                                time: time || 60,
                                checkedIn: appdetail.checkedIn
                            });
                            
                        });
                        
                        console.log(patientsBefore);
                        
                    }
                    else {
                        res.send({
                           time: 0,
                           checkedIn: appdetail.checkedIn
                        });
                    }
                    
                    //console.log(index);
                    
                    //res.send(listOfAppids);
                });
                //res.send(clinicInfo); 
            });
            console.log(appdetail); 
            //res.send("hey beautiful");
        });
    });
    
    //get waitTimes of all clinics around you
    app.post('/waitTimes', function(req, res){
         Clinic.find({}, function(err, clinics){
            if (err) throw err;
            
            clinics.forEach(function(clinic){
                Appointment.find({'appid': { $in: clinic.patients}}, function(err, appList){
                   if (err) throw err;
                   console.log(clinic.patients);
                   var time = 0;
                   appList.forEach(function(app){

                        if (app.checkedIn === true){
                            time = time + app.estimateTime;
                            console.log(app.estimateTime);
                        } 
                   });
                   console.log(time);
                   clinic.waitTime = time;
                   clinic.save(function(err){
                      if (err) throw err; 
                   });
            
                });
            });
            
            Clinic.find({}, function(err, returnObject){
                if (err) throw err;
                res.send(returnObject);
            });
         });
    });
    
    
};

//sort stuff
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
    
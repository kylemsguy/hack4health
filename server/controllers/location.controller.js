var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());






    
    app.post('/location', function(req, res){
        var query = {email: req.body.email};
        console.log(req.body.email + ' ' + req.body.long);
        
        
        //update the user and get their appointment list
        //if any appointment's checkedIn == true && ended == false, then update the distance
        User.findOneAndUpdate(query, {$set:{locationLong: req.body.long, locationLat: req.body.lat}}, {new: true}, function(err, data){
            if (err) throw err;
            console.log(data.appointments);
            Appointment.find({'appid': { $in: data.appointments}}, function(err, apps){
                if (err) throw err;
                res.send(apps);
                apps.forEach(function(oneApp){
                    //update distance
                    //go find clinic's long & lat
                    if (oneApp.checkedIn === true && oneApp.ended !== true){
                        Clinic.findOne({clinicName: oneApp.clinicName}, function(err, clinic){
                            if (err) throw err;
                            var long1 = clinic.locationLong;
                            var lat1 = clinic.locationLat;
                            //req.body.long
                            oneApp.distance = getDistanceFromLatLonInKm(req.body.lat, req.body.long, lat1, long1);
                            console.log(oneApp.distance);
                            //res.send(oneApp.distance);
                            oneApp.save(function(err){
                                if (err) throw err; 
                            });
                        });
                    } 
                });
            });
        });
        

        //res.end("success");
    });


};








function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
